import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactExperience from '@/components/ContactExperience';

export default function Contact2() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: '#080d18', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 60% at 80% 30%, rgba(37,99,235,.15) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,58,237,.1) 0%, transparent 60%)` }} />
        <ContactExperience standalone />
      </main>
      <div style={{ marginTop: '-15px' }}><Footer /></div>
    </>
  );
}
