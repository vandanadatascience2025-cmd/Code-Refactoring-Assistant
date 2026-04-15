import { BarChart3, Code2, GitFork, Route, RefreshCcw, TestTube } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: BarChart3,
    title: "Technical Debt Quantification",
    description: "Measures and prioritizes technical debt with composite scoring across complexity, duplication, and code smell density.",
    tag: "Analysis",
  },
  {
    icon: Code2,
    title: "Automated Refactoring",
    description: "AI-generated refactoring suggestions with interactive before/after previews and one-click application.",
    tag: "AI-Powered",
  },
  {
    icon: GitFork,
    title: "Dependency Impact Analysis",
    description: "Graph-based dependency mapping shows exactly what breaks when a module changes, with blast radius visualization.",
    tag: "Graph Neural Net",
  },
  {
    icon: Route,
    title: "Safe Migration Planning",
    description: "Reinforcement-learning-driven step-by-step plans with automated validation checkpoints at every stage.",
    tag: "RL Planning",
  },
  {
    icon: RefreshCcw,
    title: "Legacy Modernization",
    description: "Systematically converts outdated patterns to modern equivalents — callbacks to async/await, class to functional, and more.",
    tag: "Transform",
  },
  {
    icon: TestTube,
    title: "Test Update Automation",
    description: "Automatically generates or updates corresponding tests after each refactoring operation to maintain coverage.",
    tag: "Testing",
  },
];

const FeaturesSection = () => {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 scroll-hidden ${headerVisible ? "scroll-visible" : ""}`}
        >
          <span className="font-mono text-sm text-primary mb-4 block">CAPABILITIES</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to
            <span className="text-gradient"> refactor safely</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Six integrated AI systems working together to detect, plan, execute, and validate code improvements.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group card-gradient rounded-xl border border-border p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-glow)] scroll-hidden ${gridVisible ? "scroll-visible" : ""}`}
              style={{ transitionDelay: gridVisible ? `${i * 100}ms` : "0ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
