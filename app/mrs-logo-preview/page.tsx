const logos = [
  'logo-with-text.png',
  'logo.jpg',
  'logo-icon.png',
  'logo-icon-transparent.png',
];

export default function MrsLogoPreview() {
  return (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-12 bg-white p-12">
      {logos.map((file) => (
        <div key={file} className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/mrs-preview/${file}`} alt={file} style={{ maxWidth: 300, maxHeight: 200, objectFit: 'contain' }} />
          <p className="text-sm text-gray-600">{file}</p>
        </div>
      ))}
    </div>
  );
}
