import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { DocumentTypes } from "@/components/landing/DocumentTypes";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Hero />
        <Features />
        <DocumentTypes />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
