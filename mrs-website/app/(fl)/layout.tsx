import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FL_CONFIG } from "@/lib/site-config";

export default function FLLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header config={FL_CONFIG} />
      <main className="flex-1">{children}</main>
      <Footer config={FL_CONFIG} />
    </>
  );
}
