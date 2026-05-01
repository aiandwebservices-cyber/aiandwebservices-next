'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MAX_PHOTOS = 20;
const MAX_AT_ONCE = 10;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const RESIZE_MAX_DIM = 2000;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function resizeImage(file) {
  // HEIC can't be decoded by canvas in most browsers — pass through.
  if (file.type === 'image/heic' || file.type === 'image/heif') return file;

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const { width, height } = img;
        const longest = Math.max(width, height);
        if (longest <= RESIZE_MAX_DIM) {
          URL.revokeObjectURL(url);
          resolve(file);
          return;
        }
        const scale = RESIZE_MAX_DIM / longest;
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.\w+$/, outType === 'image/png' ? '.png' : '.jpg');
            resolve(new File([blob], newName, { type: outType }));
          },
          outType,
          0.88,
        );
      } catch {
        URL.revokeObjectURL(url);
        resolve(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

function uploadWithProgress(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
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
      fileName: p.fileName || '',
      status: 'done',
      progress: 100,
    })),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);
  const dragKeyRef = useRef(null);

  // Notify parent on every change.
  const onPhotosChangeRef = useRef(onPhotosChange);
  useEffect(() => {
    onPhotosChangeRef.current = onPhotosChange;
  }, [onPhotosChange]);
  useEffect(() => {
    if (typeof onPhotosChangeRef.current === 'function') {
      onPhotosChangeRef.current(
        photos.filter((p) => p.status === 'done').map((p) => ({
          key: p.key,
          publicUrl: p.publicUrl,
          fileName: p.fileName,
        })),
      );
    }
  }, [photos]);

  const showToast = useCallback((message, kind = 'error') => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 4000);
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
        const resized = await resizeImage(file);
        updatePhoto(entry.id, { status: 'uploading', progress: 1 });

        const presignRes = await fetch(
          `/api/dealer/${encodeURIComponent(dealerId)}/photos/upload`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vehicleId,
              fileName: resized.name,
              contentType: resized.type || 'image/jpeg',
            }),
          },
        );
        const presign = await presignRes.json();
        if (!presignRes.ok || !presign.ok) {
          throw new Error(presign.error || 'Failed to get upload URL');
        }

        await uploadWithProgress(presign.uploadUrl, resized, (pct) =>
          updatePhoto(entry.id, { progress: pct }),
        );

        updatePhoto(entry.id, {
          status: 'done',
          progress: 100,
          key: presign.key,
          publicUrl: presign.publicUrl,
          fileName: resized.name,
        });
      } catch (err) {
        updatePhoto(entry.id, { status: 'error', error: err.message });
        showToast(err.message || 'Upload failed');
      }
    },
    [dealerId, vehicleId, updatePhoto, showToast],
  );

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (files.length === 0) return;

      const room = MAX_PHOTOS - photos.length;
      if (room <= 0) {
        showToast(`Photo limit reached (${MAX_PHOTOS}).`);
        return;
      }
      const accepted = [];
      for (const f of files.slice(0, Math.min(MAX_AT_ONCE, room))) {
        if (f.size > MAX_FILE_BYTES) {
          showToast(`${f.name}: file is over 10 MB`);
          continue;
        }
        if (!ACCEPTED_TYPES.includes(f.type) && !/\.(jpe?g|png|heic|heif|webp)$/i.test(f.name)) {
          showToast(`${f.name}: unsupported file type`);
          continue;
        }
        accepted.push(f);
      }
      if (accepted.length === 0) return;

      const newEntries = accepted.map((f) => ({
        id: genId(),
        key: null,
        publicUrl: URL.createObjectURL(f),
        fileName: f.name,
        status: 'pending',
        progress: 0,
        _isObjectUrl: true,
      }));
      setPhotos((prev) => [...prev, ...newEntries]);

      await Promise.all(
        newEntries.map((entry, i) => uploadOne(entry, accepted[i])),
      );
    },
    [photos.length, showToast, uploadOne],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer?.files);
    },
    [handleFiles],
  );

  const onPick = useCallback(
    (e) => {
      handleFiles(e.target.files);
      e.target.value = '';
    },
    [handleFiles],
  );

  const handleDelete = useCallback(
    async (entry) => {
      if (entry.status !== 'done' || !entry.key) {
        removeLocal(entry.id);
        return;
      }
      try {
        const res = await fetch(
          `/api/dealer/${encodeURIComponent(dealerId)}/photos`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: entry.key }),
          },
        );
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

  // Native HTML5 drag for reorder.
  const onCardDragStart = (id) => () => {
    dragKeyRef.current = id;
  };
  const onCardDragOver = (e) => {
    e.preventDefault();
  };
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

  const doneCount = useMemo(
    () => photos.filter((p) => p.status === 'done').length,
    [photos],
  );

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
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
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
          {doneCount} of {MAX_PHOTOS} photos
        </div>
      </div>

      {photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p, i) => (
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
                    src={p.publicUrl}
                    alt={p.fileName || 'photo'}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                {i === 0 && p.status === 'done' && (
                  <span className="absolute left-1 top-1 rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                    HERO
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
          ))}
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
