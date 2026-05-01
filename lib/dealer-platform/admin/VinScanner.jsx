'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, Zap, RotateCcw, Check } from 'lucide-react';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { validVin } from './_internals';

export default function VinScanner({ isOpen, onClose, onVinDetected }) {
  const videoRef = useRef(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [manualVin, setManualVin] = useState('');
  const [manualError, setManualError] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [greenFlash, setGreenFlash] = useState(false);

  const {
    startScanning, stopScanning, isScanning,
    detectedVin, setDetectedVin,
    error, setError,
    isSupported, getTorchTrack,
  } = useBarcodeScanner(videoRef);

  useEffect(() => {
    if (isOpen) {
      if (isSupported) {
        startScanning();
      } else {
        setShowManual(true);
      }
    } else {
      stopScanning();
      setDetectedVin(null);
      setError(null);
      setManualVin('');
      setManualError('');
      setTorchOn(false);
      setTorchAvailable(false);
      setShowManual(false);
      setGreenFlash(false);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isScanning) {
      const track = getTorchTrack();
      setTorchAvailable(!!track);
    }
  }, [isScanning, getTorchTrack]);

  useEffect(() => {
    if (detectedVin) {
      setGreenFlash(true);
      const t = setTimeout(() => setGreenFlash(false), 800);
      return () => clearTimeout(t);
    }
  }, [detectedVin]);

  const handleToggleTorch = async () => {
    const track = getTorchTrack();
    if (!track) return;
    const next = !torchOn;
    try {
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch {}
  };

  const handleScanAgain = () => {
    setDetectedVin(null);
    setError(null);
    setTorchOn(false);
    startScanning();
  };

  const handleUseVin = () => {
    if (detectedVin) {
      onVinDetected(detectedVin);
      onClose();
    }
  };

  const handleManualSubmit = () => {
    const v = manualVin.trim().toUpperCase();
    if (!validVin(v)) {
      setManualError('VIN must be 17 characters (no I, O, Q)');
      return;
    }
    onVinDetected(v);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-lg mx-auto bg-zinc-900 sm:rounded-2xl overflow-hidden"
        style={{
          maxHeight: '100dvh',
          boxShadow: greenFlash
            ? '0 0 0 4px #4ade80, 0 20px 60px rgba(0,0,0,0.8)'
            : '0 20px 60px rgba(0,0,0,0.8)',
          transition: 'box-shadow 0.15s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-400" />
            <span className="text-white font-semibold text-sm">Scan VIN Barcode</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />

          {/* Scan overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Dim corners */}
              <div className="absolute inset-0 bg-black/40" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 calc(50% - 48px), calc(50% - 128px) calc(50% - 48px), calc(50% - 128px) calc(50% + 48px), calc(50% + 128px) calc(50% + 48px), calc(50% + 128px) calc(50% - 48px), 0 calc(50% - 48px))' }} />

              {/* Targeting rectangle */}
              <div className="relative" style={{ width: 256, height: 96 }}>
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-400" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-400" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-teal-400" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-teal-400" />

                {/* Animated scan line */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-teal-400"
                  style={{ animation: 'vinScanLine 2s ease-in-out infinite', opacity: 0.9 }}
                />
              </div>
            </div>
          )}

          {/* Detected state */}
          {detectedVin && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs text-center uppercase tracking-widest mb-1">VIN Detected</p>
                <p className="font-mono text-white text-xl font-bold text-center tracking-wider">{detectedVin}</p>
              </div>
            </div>
          )}

          {/* Permission denied */}
          {error === 'permission' && (
            <div className="absolute inset-0 bg-zinc-900/95 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Camera className="w-10 h-10 text-white/20" />
              <p className="text-white/70 text-sm leading-relaxed">
                Camera access needed for VIN scanning. You can also type the VIN manually below.
              </p>
            </div>
          )}

          {/* Browser unsupported */}
          {error === 'unsupported' && (
            <div className="absolute inset-0 bg-zinc-900/95 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-white/70 text-sm leading-relaxed">
                Barcode scanning not supported in this browser. Enter VIN manually.
              </p>
            </div>
          )}

          {/* Timeout */}
          {error === 'timeout' && (
            <div className="absolute inset-0 bg-zinc-900/95 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-white/70 text-sm">No barcode found. Tap to try again.</p>
              <button
                onClick={handleScanAgain}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Torch button */}
          {isScanning && torchAvailable && (
            <button
              onClick={handleToggleTorch}
              className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                torchOn ? 'bg-yellow-400 text-black' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title={torchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
            >
              <Zap className="w-4 h-4" />
            </button>
          )}

          {/* Instruction label */}
          {isScanning && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
              <span className="text-white/80 text-xs bg-black/60 px-3 py-1 rounded-full">
                Point camera at VIN barcode...
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 space-y-3">
          {detectedVin ? (
            <div className="flex gap-2">
              <button
                onClick={handleScanAgain}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Scan Again
              </button>
              <button
                onClick={handleUseVin}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-bold hover:bg-teal-400 transition-colors"
              >
                <Check className="w-4 h-4" />
                Use This VIN
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowManual(v => !v)}
              className="w-full text-white/50 text-xs hover:text-white/80 transition-colors py-1"
            >
              {showManual ? '▲ Hide manual entry' : '▼ Enter VIN manually instead'}
            </button>
          )}

          {/* Manual VIN entry */}
          {(showManual || error === 'unsupported' || error === 'permission') && (
            <div className="space-y-2">
              <input
                value={manualVin}
                onChange={e => { setManualVin(e.target.value.toUpperCase()); setManualError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleManualSubmit(); }}
                maxLength={17}
                placeholder="Enter 17-character VIN"
                autoCapitalize="characters"
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
              {manualError && <p className="text-red-400 text-xs">{manualError}</p>}
              <button
                onClick={handleManualSubmit}
                disabled={manualVin.length < 17}
                className="w-full py-2.5 rounded-xl bg-teal-500 text-white text-sm font-bold hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Use This VIN
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes vinScanLine {
          0%, 100% { top: 2px; opacity: 1; }
          50% { top: calc(100% - 4px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
