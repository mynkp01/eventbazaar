import dynamic from "next/dynamic";
import { jost } from "../global";
import "../global.css";

const ScrollToTop = dynamic(() => import("@components/ScrollToTop"), {
  ssr: true,
});
const PublicHeader = dynamic(() => import("@components/PublicHeader"), {
  ssr: true,
});
const Footer = dynamic(() => import("@components/Footer"), {
  ssr: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`flex min-h-screen ${jost.className}`}>
      <div className="relative w-full flex-1">
        <PublicHeader />
        {children}
        <Footer />

        <ScrollToTop />
      </div>
    </section>
  );
}
