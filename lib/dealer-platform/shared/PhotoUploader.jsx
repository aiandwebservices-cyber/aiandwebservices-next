'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useImageOptimizer } from '../hooks/useImageOptimizer.js';

const MAX_PHOTOS = 20;
const MAX_AT_ONCE = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fmtBytes(bytes) {
  if (!bytes) return '?';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function uploadFileWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { reject(new Error('Invalid server response')); }
      } else {
        let msg = `Upload failed: ${xhr.status}`;
        try { msg = JSON.parse(xhr.responseText)?.error || msg; } catch { /* noop */ }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export default function PhotoUploader({
  dealerId,
  vehicleId,
  existingPhotos = [],
  onPhotosChange,
}) {
  const [photos, setPhotos] = useState(() =>
    existingPhotos.map((p) => ({
      id: genId(),
      key: p.key,
      publicUrl: p.publicUrl,
      thumbUrl: p.thumbUrl || null,
      mediumUrl: p.mediumUrl || null,
      fileName: p.fileName || '',
      originalSize: p.originalSize || null,
      optimizedSize: p.optimizedSize || null,
      status: 'done',
      progress: 100,
    })),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);
  const dragKeyRef = useRef(null);
  const optimizer = useImageOptimizer();

  const onPhotosChangeRef = useRef(onPhotosChange);
  useEffect(() => { onPhotosChangeRef.current = onPhotosChange; }, [onPhotosChange]);
  useEffect(() => {
    if (typeof onPhotosChangeRef.current === 'function') {
      onPhotosChangeRef.current(
        photos.filter((p) => p.status === 'done').map((p) => ({
          key: p.key,
          publicUrl: p.publicUrl,
          thumbUrl: p.thumbUrl,
          mediumUrl: p.mediumUrl,
          fileName: p.fileName,
          originalSize: p.originalSize,
          optimizedSize: p.optimizedSize,
        })),
      );
    }
  }, [photos]);

  const showToast = useCallback((message, kind = 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const updatePhoto = useCallback((id, patch) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removeLocal = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const uploadOne = useCallback(
    async (entry, file) => {
      try {
        updatePhoto(entry.id, { status: 'uploading', progress: 1 });

        const formData = new FormData();
        formData.append('vehicleId', vehicleId);
        formData.append('image', file);

        const result = await uploadFileWithProgress(
          `/api/dealer/${encodeURIComponent(dealerId)}/photos/upload`,
          formData,
          (pct) => updatePhoto(entry.id, { progress: Math.round(pct * 0.7) }), // 0-70% = upload
        );

        if (!result.ok) throw new Error(result.error || 'Upload failed');

        // If R2 not configured, fall back gracefully
        if (result.degraded === 'r2_unavailable') {
          optimizer.setWarning('Photos uploaded without optimization — configure R2 for optimized delivery');
        }

        updatePhoto(entry.id, {
          status: 'done',
          progress: 100,
          key: result.key || result.publicUrl,
          publicUrl: result.publicUrl,
          thumbUrl: result.thumb?.url || null,
          mediumUrl: result.medium?.url || null,
          fileName: file.name,
          originalSize: result.originalSize || file.size,
          optimizedSize: result.optimizedSize || null,
        });

        optimizer.completeOne();
      } catch (err) {
        updatePhoto(entry.id, { status: 'error', error: err.message });
        showToast(err.message || 'Upload failed');
        optimizer.completeOne({ warning: err.message });
      }
    },
    [dealerId, vehicleId, updatePhoto, showToast, optimizer],
  );

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (files.length === 0) return;

      const room = MAX_PHOTOS - photos.length;
      if (room <= 0) { showToast(`Photo limit reached (${MAX_PHOTOS}).`); return; }

      const accepted = [];
      for (const f of files.slice(0, Math.min(MAX_AT_ONCE, room))) {
        if (f.size > MAX_FILE_BYTES) { showToast(`${f.name}: file is over 10 MB`); continue; }
        if (!ACCEPTED_TYPES.includes(f.type) && !/\.(jpe?g|png|heic|heif|webp)$/i.test(f.name)) {
          showToast(`${f.name}: unsupported file type`);
          continue;
        }
        accepted.push(f);
      }
      if (accepted.length === 0) return;

      optimizer.startBatch(accepted.length);

      const newEntries = accepted.map((f) => ({
        id: genId(),
        key: null,
        publicUrl: URL.createObjectURL(f),
        thumbUrl: null,
        mediumUrl: null,
        fileName: f.name,
        originalSize: f.size,
        optimizedSize: null,
        status: 'pending',
        progress: 0,
        _isObjectUrl: true,
      }));
      setPhotos((prev) => [...prev, ...newEntries]);

      await Promise.all(newEntries.map((entry, i) => uploadOne(entry, accepted[i])));
    },
    [photos.length, showToast, uploadOne, optimizer],
  );

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer?.files);
  }, [handleFiles]);

  const onPick = useCallback((e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles]);

  const handleDelete = useCallback(
    async (entry) => {
      if (entry.status !== 'done' || !entry.key) { removeLocal(entry.id); return; }
      try {
        const res = await fetch(`/api/dealer/${encodeURIComponent(dealerId)}/photos`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: entry.key }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed');
        removeLocal(entry.id);
      } catch (err) {
        showToast(err.message || 'Delete failed');
      }
    },
    [dealerId, removeLocal, showToast],
  );

  const makeHero = useCallback((id) => {
    setPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx <= 0) return prev;
      const next = prev.slice();
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return next;
    });
  }, []);

  const onCardDragStart = (id) => () => { dragKeyRef.current = id; };
  const onCardDragOver = (e) => { e.preventDefault(); };
  const onCardDrop = (targetId) => (e) => {
    e.preventDefault();
    const fromId = dragKeyRef.current;
    dragKeyRef.current = null;
    if (!fromId || fromId === targetId) return;
    setPhotos((prev) => {
      const fromIdx = prev.findIndex((p) => p.id === fromId);
      const toIdx = prev.findIndex((p) => p.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const next = prev.slice();
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const doneCount = useMemo(() => photos.filter((p) => p.status === 'done').length, [photos]);

  const dropzoneCls = [
    'rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
    isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50',
  ].join(' ');

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
        multiple
        className="hidden"
        onChange={onPick}
      />

      <div
        role="button"
        tabIndex={0}
        className={dropzoneCls}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className="text-base font-medium text-gray-800">
          Drag photos here or click to browse
        </div>
        <div className="mt-1 text-sm text-gray-500">
          Supports JPG, PNG, HEIC — up to {MAX_PHOTOS} photos per vehicle
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {doneCount} of {MAX_PHOTOS} photos · Uploaded photos are auto-optimized to WebP
        </div>
      </div>

      {/* Batch optimization progress bar */}
      {optimizer.active && (
        <div className="mt-3 rounded-md border border-teal-200 bg-teal-50 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-teal-800">
              Optimizing… ({optimizer.done} of {optimizer.total} photos)
            </span>
            <span className="text-teal-600">{optimizer.progressPct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-teal-200">
            <div
              className="h-1.5 rounded-full bg-teal-500 transition-all"
              style={{ width: `${optimizer.progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* R2 not configured warning */}
      {optimizer.warning && (
        <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
          ⚠ {optimizer.warning}
        </div>
      )}

      {photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p, i) => {
            const saved = p.originalSize && p.optimizedSize
              ? Math.round((1 - p.optimizedSize / p.originalSize) * 100)
              : null;
            return (
              <li
                key={p.id}
                draggable={p.status === 'done'}
                onDragStart={onCardDragStart(p.id)}
                onDragOver={onCardDragOver}
                onDrop={onCardDrop(p.id)}
                className="group relative overflow-hidden rounded-md border border-gray-200 bg-white"
              >
                <div className="relative aspect-square bg-gray-100">
                  {p.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbUrl || p.publicUrl}
                      alt={p.fileName || 'photo'}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                  {i === 0 && p.status === 'done' && (
                    <span className="absolute left-1 top-1 rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                      HERO
                    </span>
                  )}
                  {saved !== null && p.status === 'done' && (
                    <span className="absolute right-1 top-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      -{saved}%
                    </span>
                  )}
                  {p.status !== 'done' && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[11px] text-white">
                      {p.status === 'error' ? `Error: ${p.error || 'failed'}` : `Uploading… ${p.progress}%`}
                      <div className="mt-1 h-1 w-full rounded bg-white/20">
                        <div
                          className={`h-1 rounded ${p.status === 'error' ? 'bg-red-500' : 'bg-teal-400'}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* size savings label */}
                {p.originalSize && p.optimizedSize && p.status === 'done' && (
                  <div className="border-t border-gray-100 px-2 py-1 text-[10px] text-gray-400">
                    {fmtBytes(p.originalSize)} → {fmtBytes(p.optimizedSize)}
                  </div>
                )}

                <div className="flex items-center justify-between gap-1 p-1">
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-yellow-700 hover:bg-yellow-50 disabled:opacity-30"
                    onClick={() => makeHero(p.id)}
                    disabled={i === 0 || p.status !== 'done'}
                    title="Make hero image"
                  >
                    ★ Hero
                  </button>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(p)}
                    title="Delete photo"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded px-3 py-2 text-sm text-white shadow-lg ${
            toast.kind === 'error' ? 'bg-red-600' : 'bg-gray-800'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
