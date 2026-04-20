import { FL_CONFIG } from "@/lib/site-config";
import HomePage from "@/components/pages/HomePage";

export default function Page() {
  return <HomePage config={FL_CONFIG} />;
}
