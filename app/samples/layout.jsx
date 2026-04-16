export default function SamplesLayout({ children }) {
  return (
    <>
      <style>{`
        /* Override the main site's overflow:hidden on desktop —
           sample pages are vertical-scroll pages, not the horizontal track */
        html, body {
          overflow: auto !important;
          height: auto !important;
        }
        /* Hide the main site nav/track that sits behind everything */
        #nav, #track { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
