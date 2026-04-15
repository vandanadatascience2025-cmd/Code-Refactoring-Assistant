import { ArrowRight, Shield, Zap, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const HeroSection = () => {
  const [badgeRef, badgeVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [headingRef, headingVisible] = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.1 });
  const [subRef, subVisible] = useScrollAnimation<HTMLParagraphElement>({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [statsRef, statsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-info/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            ref={badgeRef}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border mb-8 scroll-hidden-scale ${badgeVisible ? "scroll-visible" : ""}`}
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-sm font-mono text-muted-foreground">v2.0 — Now with AI-Powered Migration Planning</span>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 scroll-hidden ${headingVisible ? "scroll-visible" : ""}`}
            style={{ transitionDelay: "100ms" }}
          >
            Eliminate Technical Debt
            <br />
            <span className="text-gradient">with Precision AI</span>
          </h1>

          {/* Subheading */}
          <p
            ref={subRef}
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed scroll-hidden ${subVisible ? "scroll-visible" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            AIForge Refactor detects code smells, maps dependencies, suggests safe refactorings, 
            and plans migration strategies — so your team ships faster with confidence.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className={`flex flex-col sm:flex-row items-center gap-4 mb-16 scroll-hidden ${ctaVisible ? "scroll-visible" : ""}`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8 py-6 font-semibold">
                Start Analyzing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 text-base px-8 py-6">
              View Demo
            </Button>
          </div>

          {/* Quick stats */}
          <div
            ref={statsRef}
            className={`grid grid-cols-3 gap-8 md:gap-16 scroll-hidden ${statsVisible ? "scroll-visible" : ""}`}
            style={{ transitionDelay: "400ms" }}
          >
            {[
              { icon: Shield, value: "80%", label: "Fewer bugs during refactoring" },
              { icon: Zap, value: "60%", label: "Debt reduced in 6 months" },
              { icon: GitBranch, value: "100%", label: "Dependency impact visibility" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-5 h-5 text-primary mb-1" />
                <span className="text-3xl md:text-4xl font-bold text-foreground">{value}</span>
                <span className="text-xs md:text-sm text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
