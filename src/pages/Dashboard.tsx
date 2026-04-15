import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BarChart3, GitFork, ListTodo, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { analyzeCode, saveAnalysis, fetchScans, fetchScanDetails, type AnalysisResult } from "@/lib/api";
import { CodeInputPanel } from "@/components/dashboard/CodeInputPanel";
import { DebtTrendChart, DebtBreakdownChart, ModuleDebtChart } from "@/components/dashboard/Charts";
import { DependencyGraph } from "@/components/dashboard/DependencyGraph";
import { RefactoringTaskList } from "@/components/dashboard/RefactoringTaskList";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  const { data: scans = [] } = useQuery({
    queryKey: ["debt-scans"],
    queryFn: fetchScans,
  });

  const latestScan = scans[0] || null;
  const activeScanId = selectedScanId || latestScan?.id;

  const { data: scanDetails } = useQuery({
    queryKey: ["scan-details", activeScanId],
    queryFn: () => fetchScanDetails(activeScanId!),
    enabled: !!activeScanId,
  });

  const activeScan = selectedScanId
    ? scans.find((s) => s.id === selectedScanId) || latestScan
    : latestScan;

  const handleAnalyze = useCallback(async (code: string, language: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCode(code, language);
      await saveAnalysis("My Project", result);
      queryClient.invalidateQueries({ queryKey: ["debt-scans"] });
      toast.success("Analysis complete! Results saved.");
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [queryClient]);

  const refreshTasks = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["scan-details", activeScanId] });
  }, [queryClient, activeScanId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center h-14 px-4 gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="font-bold text-lg">
            Technical Debt <span className="text-primary">Dashboard</span>
          </h1>
          {scans.length > 1 && (
            <select
              className="ml-auto bg-secondary border border-border rounded-md px-3 py-1.5 text-sm font-mono text-foreground"
              value={activeScanId || ""}
              onChange={(e) => setSelectedScanId(e.target.value)}
            >
              {scans.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Date(s.scan_date).toLocaleString()} — Score: {Number(s.total_score)}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: Input + Scores */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border p-5 card-gradient">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Analyze Code
              </h2>
              <CodeInputPanel onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
            </div>

            {activeScan && (
              <div className="rounded-xl border border-border p-5 card-gradient">
                <h2 className="text-sm font-semibold mb-4">Debt Scores</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { score: Number(activeScan.total_score), label: "Total Debt" },
                    { score: Number(activeScan.complexity_score), label: "Complexity" },
                    { score: Number(activeScan.duplication_score), label: "Duplication" },
                    { score: Number(activeScan.code_smell_score), label: "Code Smells" },
                  ].map((g) => (
                    <div key={g.label} className="relative flex justify-center">
                      <ScoreGauge score={g.score} label={g.label} size={100} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle + Right columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trend + Breakdown */}
            {scans.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border p-5 card-gradient">
                  <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Debt Trend
                  </h2>
                  <DebtTrendChart scans={scans} />
                </div>
                {activeScan && (
                  <div className="rounded-xl border border-border p-5 card-gradient">
                    <h2 className="text-sm font-semibold mb-4">Debt Breakdown</h2>
                    <DebtBreakdownChart scan={activeScan} />
                  </div>
                )}
              </div>
            )}

            {/* Module debt + Dependency graph */}
            {scanDetails && (
              <div className="grid md:grid-cols-2 gap-6">
                {scanDetails.modules.length > 0 && (
                  <div className="rounded-xl border border-border p-5 card-gradient">
                    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Module Debt
                    </h2>
                    <ModuleDebtChart modules={scanDetails.modules} />
                  </div>
                )}
                <div className="rounded-xl border border-border p-5 card-gradient">
                  <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-primary" /> Dependency Graph
                  </h2>
                  <DependencyGraph dependencies={scanDetails.dependencies} />
                </div>
              </div>
            )}

            {/* Refactoring tasks */}
            {scanDetails && (
              <div className="rounded-xl border border-border p-5 card-gradient">
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-primary" /> Refactoring Tasks
                  {scanDetails.tasks.length > 0 && (
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {scanDetails.tasks.filter((t) => t.status === "completed").length}/{scanDetails.tasks.length} done
                    </span>
                  )}
                </h2>
                <RefactoringTaskList tasks={scanDetails.tasks} onUpdate={refreshTasks} />
              </div>
            )}

            {/* Empty state */}
            {scans.length === 0 && (
              <div className="rounded-xl border border-border border-dashed p-12 text-center">
                <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
                <p className="text-sm text-muted-foreground">
                  Paste some code in the panel and hit "Analyze" to get your first technical debt report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
