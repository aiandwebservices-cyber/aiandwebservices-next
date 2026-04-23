'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function QRTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-gradient-light.svg" alt="AI and Web Services" style={{ width: 520, height: 104, display: 'block', transform: 'translateX(95px)' }} />
      <QRCodeCanvas value="https://aiandwebservices.com" size={256} level="H" />
    </div>
  );
}
