import { useMemo } from "react";

interface Dep {
  source_module: string;
  target_module: string;
  dependency_type: string;
  weight: number;
}

export function DependencyGraph({ dependencies }: { dependencies: Dep[] }) {
  const { nodes, links } = useMemo(() => {
    const nodeSet = new Set<string>();
    dependencies.forEach((d) => {
      nodeSet.add(d.source_module);
      nodeSet.add(d.target_module);
    });
    const nodeArray = Array.from(nodeSet);
    const cx = 250, cy = 200, r = 150;
    const nodePositions = nodeArray.map((name, i) => {
      const angle = (2 * Math.PI * i) / nodeArray.length - Math.PI / 2;
      return { name, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    const posMap = Object.fromEntries(nodePositions.map((n) => [n.name, n]));
    return {
      nodes: nodePositions,
      links: dependencies.map((d) => ({
        source: posMap[d.source_module],
        target: posMap[d.target_module],
        type: d.dependency_type,
        weight: d.weight,
      })),
    };
  }, [dependencies]);

  if (nodes.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        No dependencies found
      </div>
    );
  }

  const typeColor: Record<string, string> = {
    import: "hsl(172, 66%, 50%)",
    inheritance: "hsl(38, 92%, 50%)",
    composition: "hsl(210, 100%, 60%)",
  };

  return (
    <div className="overflow-auto">
      <svg viewBox="0 0 500 400" className="w-full h-80">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(172, 66%, 50%)" opacity={0.6} />
          </marker>
        </defs>
        {links.map((l, i) => (
          <line
            key={i}
            x1={l.source.x}
            y1={l.source.y}
            x2={l.target.x}
            y2={l.target.y}
            stroke={typeColor[l.type] || typeColor.import}
            strokeWidth={Math.min(l.weight * 1.5, 4)}
            strokeOpacity={0.4}
            markerEnd="url(#arrow)"
          />
        ))}
        {nodes.map((n) => (
          <g key={n.name}>
            <circle cx={n.x} cy={n.y} r={18} fill="hsl(222, 40%, 12%)" stroke="hsl(172, 66%, 50%)" strokeWidth={1.5} />
            <text
              x={n.x}
              y={n.y + 32}
              textAnchor="middle"
              fill="hsl(210, 20%, 75%)"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
            >
              {n.name.length > 12 ? n.name.slice(0, 12) + "…" : n.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-center gap-6 mt-2">
        {Object.entries(typeColor).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-6 h-0.5" style={{ backgroundColor: color }} />
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}
