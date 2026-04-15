import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const beforeCode = `// Legacy callback pattern
function fetchUserData(id, callback) {
  db.query('SELECT * FROM users', (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    const user = rows.find(r => r.id === id);
    callback(null, user);
  });
}`;

const afterCode = `// Modernized async/await pattern
async function fetchUserData(id: string): Promise<User> {
  const rows = await db.query('SELECT * FROM users');
  const user = rows.find(r => r.id === id);
  if (!user) throw new NotFoundError(\`User \${id}\`);
  return user;
}`;

const CodePreviewSection = () => {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>();
  const [beforeRef, beforeVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [afterRef, afterVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)", opacity: 0.5, transform: "rotate(180deg)" }} />
      <div className="container px-4 relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 scroll-hidden ${headerVisible ? "scroll-visible" : ""}`}
        >
          <span className="font-mono text-sm text-primary mb-4 block">LIVE PREVIEW</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            See the <span className="text-gradient">transformation</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Interactive before/after previews let you review every change before applying it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Before */}
          <div
            ref={beforeRef}
            className={`rounded-xl border border-danger/30 overflow-hidden scroll-hidden-left ${beforeVisible ? "scroll-visible" : ""}`}
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-danger/10 border-b border-danger/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="font-mono text-xs text-danger ml-2">BEFORE — Debt Score: 78/100</span>
            </div>
            <pre className="p-4 text-sm font-mono text-muted-foreground overflow-x-auto leading-relaxed bg-card">
              <code>{beforeCode}</code>
            </pre>
          </div>

          {/* After */}
          <div
            ref={afterRef}
            className={`rounded-xl border border-success/30 overflow-hidden scroll-hidden-right ${afterVisible ? "scroll-visible" : ""}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-success/10 border-b border-success/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="font-mono text-xs text-success ml-2">AFTER — Debt Score: 12/100</span>
            </div>
            <pre className="p-4 text-sm font-mono text-muted-foreground overflow-x-auto leading-relaxed bg-card">
              <code>{afterCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodePreviewSection;
