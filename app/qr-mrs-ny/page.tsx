'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function QRMrsPage() {
  const canvasRef = useRef<HTMLDivElement>(null);

  function download() {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'mrs-qr.png';
    a.click();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mrs-preview/logo-with-text.png" alt="Mitigation Restoration Service" style={{ width: 256, display: 'block' }} />
      <div ref={canvasRef}>
        <QRCodeCanvas value="https://www.mitigationrestorationservice.com/ny" size={256} level="H" />
      </div>
      <p className={`${montserrat.className} text-lg font-semibold tracking-wide`}>New York City</p>
    </div>
  );
}
