import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const layers = [
  {
    label: "AI Layer",
    color: "bg-primary/20 border-primary/30",
    items: ["Transformer Models", "Graph Neural Networks", "Reinforcement Learning", "Probabilistic Risk Models"],
  },
  {
    label: "Analysis Engine",
    color: "bg-info/10 border-info/20",
    items: ["AST Parser", "Control Flow Graph", "Dependency Graph", "Complexity Analyzer"],
  },
  {
    label: "Language Support",
    color: "bg-warning/10 border-warning/20",
    items: ["TypeScript/JS", "Python", "Java", "C#", "Go"],
  },
  {
    label: "Integrations",
    color: "bg-success/10 border-success/20",
    items: ["VS Code", "IntelliJ IDEA", "GitHub Actions", "CI/CD Pipelines"],
  },
];

const ArchitectureSection = () => {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [stackRef, stackVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 scroll-hidden ${headerVisible ? "scroll-visible" : ""}`}
        >
          <span className="font-mono text-sm text-primary mb-4 block">ARCHITECTURE</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built on <span className="text-gradient">proven foundations</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A layered architecture combining state-of-the-art AI with battle-tested code analysis tools.
          </p>
        </div>

        <div ref={stackRef} className="max-w-3xl mx-auto space-y-4">
          {layers.map((layer, i) => (
            <div
              key={layer.label}
              className={`rounded-xl border p-6 ${layer.color} scroll-hidden-left ${stackVisible ? "scroll-visible" : ""}`}
              style={{ transitionDelay: stackVisible ? `${i * 150}ms` : "0ms" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-mono text-sm font-semibold text-foreground min-w-[140px]">
                  {layer.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-md bg-background/50 border border-border text-sm text-muted-foreground font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
