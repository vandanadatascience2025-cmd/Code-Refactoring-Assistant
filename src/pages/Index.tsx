import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import CodePreviewSection from "@/components/CodePreviewSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="features"><FeaturesSection /></div>
      <div id="architecture"><ArchitectureSection /></div>
      <div id="preview"><CodePreviewSection /></div>
      <CTASection />
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground font-mono">
        © 2026 AIForge Refactor. Built for engineering teams that refuse to ship debt.
      </footer>
    </div>
  );
};

export default Index;
