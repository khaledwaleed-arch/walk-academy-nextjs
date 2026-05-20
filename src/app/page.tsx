import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import About from "@/components/About";
import Academy from "@/components/Academy";
import OdooModules from "@/components/OdooModules";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Contact from "@/components/Contact";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Problem />
        <Services />
        <About />
        <Academy />
        <OdooModules />
        <WhyUs />
        <Testimonials />
        <Blog />
        <FAQ />
        <CTABanner />
        <Contact />
        <Register />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
