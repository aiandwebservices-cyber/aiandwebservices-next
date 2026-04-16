import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function V1Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
