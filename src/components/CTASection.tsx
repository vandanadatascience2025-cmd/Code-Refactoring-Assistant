import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const CTASection = () => {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto text-center card-gradient rounded-2xl border border-border p-12 glow-border scroll-hidden-scale ${isVisible ? "scroll-visible" : ""}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-gradient">modernize</span> your codebase?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start detecting technical debt and planning safe migrations in minutes.  
            No configuration required — point AIForge at your repo and go.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 px-8 py-6 font-semibold text-base">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-6 text-base">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6 font-mono">
            Free tier • No credit card • Analyze up to 50k lines
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
