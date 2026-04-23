'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function QRMrsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mrs-preview/logo-with-text.png" alt="Mitigation Restoration Service" style={{ width: 256, display: 'block' }} />
      <QRCodeCanvas value="https://www.mitigationrestorationservice.com" size={256} level="H" />
      <p className={`${montserrat.className} text-lg font-semibold tracking-wide`}>South Florida</p>
    </div>
  );
}
