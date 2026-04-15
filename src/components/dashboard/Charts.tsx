import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tables } from "@/integrations/supabase/types";

type Scan = Tables<"debt_scans">;

const COLORS = {
  primary: "hsl(172, 66%, 50%)",
  warning: "hsl(38, 92%, 50%)",
  danger: "hsl(0, 72%, 55%)",
  info: "hsl(210, 100%, 60%)",
  success: "hsl(142, 70%, 45%)",
  muted: "hsl(215, 15%, 55%)",
};

const PIE_COLORS = [COLORS.primary, COLORS.warning, COLORS.danger, COLORS.info];

export function DebtTrendChart({ scans }: { scans: Scan[] }) {
  const data = [...scans]
    .reverse()
    .map((s) => ({
      date: new Date(s.scan_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      total: Number(s.total_score),
      complexity: Number(s.complexity_score),
      duplication: Number(s.duplication_score),
      codeSmells: Number(s.code_smell_score),
    }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
          <XAxis dataKey="date" stroke={COLORS.muted} fontSize={12} />
          <YAxis stroke={COLORS.muted} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 40%, 9%)",
              border: "1px solid hsl(222, 25%, 16%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
            }}
          />
          <Area type="monotone" dataKey="total" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
          <Area type="monotone" dataKey="complexity" stroke={COLORS.warning} fillOpacity={0} strokeWidth={1.5} strokeDasharray="4 4" />
          <Area type="monotone" dataKey="duplication" stroke={COLORS.danger} fillOpacity={0} strokeWidth={1.5} strokeDasharray="4 4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DebtBreakdownChart({ scan }: { scan: Scan }) {
  const data = [
    { name: "Complexity", value: Number(scan.complexity_score) },
    { name: "Duplication", value: Number(scan.duplication_score) },
    { name: "Code Smells", value: Number(scan.code_smell_score) },
    { name: "Other", value: Math.max(0, Number(scan.total_score) - Number(scan.complexity_score) - Number(scan.duplication_score) - Number(scan.code_smell_score)) },
  ].filter((d) => d.value > 0);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 40%, 9%)",
              border: "1px solid hsl(222, 25%, 16%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 -mt-4">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModuleDebtChart({ modules }: { modules: Array<{ module_name: string; debt_score: number; complexity: number }> }) {
  const data = modules.map((m) => ({
    name: m.module_name.length > 15 ? m.module_name.slice(0, 15) + "…" : m.module_name,
    debt: Number(m.debt_score),
    complexity: m.complexity,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
          <XAxis type="number" stroke={COLORS.muted} fontSize={12} />
          <YAxis type="category" dataKey="name" stroke={COLORS.muted} fontSize={11} width={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 40%, 9%)",
              border: "1px solid hsl(222, 25%, 16%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
            }}
          />
          <Bar dataKey="debt" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
