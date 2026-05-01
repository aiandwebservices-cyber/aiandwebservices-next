import { useState, useRef, useEffect, useCallback } from 'react';

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export function useBarcodeScanner(videoRef) {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedVin, setDetectedVin] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported] = useState(
    () => typeof window !== 'undefined' && 'BarcodeDetector' in window
  );

  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isSupported) {
      try {
        detectorRef.current = new window.BarcodeDetector({ formats: ['code_39', 'code_128'] });
      } catch {}
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopScanning = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    setError(null);
    setDetectedVin(null);

    if (!isSupported || !detectorRef.current) {
      setError('unsupported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsScanning(true);

      // Auto-stop after 30 seconds to save battery
      timeoutRef.current = setTimeout(() => {
        stopScanning();
        setError('timeout');
      }, 30000);

      const scan = async () => {
        if (!videoRef.current || !detectorRef.current || !streamRef.current) return;
        try {
          const results = await detectorRef.current.detect(videoRef.current);
          for (const r of results) {
            const raw = r.rawValue.trim().toUpperCase();
            if (VIN_RE.test(raw)) {
              if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
              if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
              setIsScanning(false);
              setDetectedVin(raw);
              if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
              return;
            }
          }
        } catch {}
        rafRef.current = requestAnimationFrame(scan);
      };

      rafRef.current = requestAnimationFrame(scan);
    } catch (err) {
      setError(err.name === 'NotAllowedError' ? 'permission' : (err.message || 'Camera error'));
    }
  }, [isSupported, videoRef, stopScanning]);

  const getTorchTrack = useCallback(() => {
    if (!streamRef.current) return null;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return null;
    const caps = track.getCapabilities?.();
    return caps?.torch ? track : null;
  }, []);

  return {
    startScanning,
    stopScanning,
    isScanning,
    detectedVin,
    setDetectedVin,
    error,
    setError,
    isSupported,
    getTorchTrack,
  };
}
