export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

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
        /* Hide Crisp live chat on sample pages — each sample has its own AI chatbot demo */
        .crisp-client, #crisp-chatbox, [data-id="crisp"] { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
