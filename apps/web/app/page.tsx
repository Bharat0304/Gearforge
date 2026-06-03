import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <LogoBar />
      <Features />
      <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.06)" }} />
      <HowItWorks />
      <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.06)" }} />
      <Testimonials />
      <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.06)" }} />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
