import { supabase } from "@/integrations/supabase/client";

export interface AnalysisResult {
  totalScore: number;
  complexityScore: number;
  duplicationScore: number;
  codeSmellScore: number;
  modules: Array<{
    moduleName: string;
    filePath: string;
    debtScore: number;
    complexity: number;
    linesOfCode: number;
    codeSmells: Array<{ type: string; description: string; severity: string }>;
  }>;
  dependencies: Array<{
    source: string;
    target: string;
    type: string;
    weight: number;
  }>;
  refactoringTasks: Array<{
    title: string;
    description: string;
    moduleName: string;
    priority: string;
    estimatedEffort: string;
    riskLevel: number;
  }>;
}

export async function analyzeCode(code: string, language: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-code", {
    body: { code, language },
  });

  if (error) throw new Error(error.message || "Analysis failed");
  return data as AnalysisResult;
}

export async function saveAnalysis(projectName: string, result: AnalysisResult) {
  // Save scan
  const { data: scan, error: scanError } = await supabase
    .from("debt_scans")
    .insert({
      project_name: projectName,
      total_score: result.totalScore,
      complexity_score: result.complexityScore,
      duplication_score: result.duplicationScore,
      code_smell_score: result.codeSmellScore,
      files_analyzed: result.modules.length,
    })
    .select()
    .single();

  if (scanError) throw scanError;

  // Save modules
  if (result.modules.length > 0) {
    await supabase.from("debt_modules").insert(
      result.modules.map((m) => ({
        scan_id: scan.id,
        module_name: m.moduleName,
        file_path: m.filePath,
        debt_score: m.debtScore,
        complexity: m.complexity,
        lines_of_code: m.linesOfCode,
        code_smells: m.codeSmells,
      }))
    );
  }

  // Save dependencies
  if (result.dependencies.length > 0) {
    await supabase.from("dependencies").insert(
      result.dependencies.map((d) => ({
        scan_id: scan.id,
        source_module: d.source,
        target_module: d.target,
        dependency_type: d.type,
        weight: d.weight,
      }))
    );
  }

  // Save refactoring tasks
  if (result.refactoringTasks.length > 0) {
    await supabase.from("refactoring_tasks").insert(
      result.refactoringTasks.map((t) => ({
        scan_id: scan.id,
        title: t.title,
        description: t.description,
        module_name: t.moduleName,
        priority: t.priority,
        estimated_effort: t.estimatedEffort,
        risk_level: t.riskLevel,
      }))
    );
  }

  return scan;
}

export async function fetchScans() {
  const { data, error } = await supabase
    .from("debt_scans")
    .select("*")
    .order("scan_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchScanDetails(scanId: string) {
  const [modules, deps, tasks] = await Promise.all([
    supabase.from("debt_modules").select("*").eq("scan_id", scanId),
    supabase.from("dependencies").select("*").eq("scan_id", scanId),
    supabase.from("refactoring_tasks").select("*").eq("scan_id", scanId).order("priority"),
  ]);
  return {
    modules: modules.data || [],
    dependencies: deps.data || [],
    tasks: tasks.data || [],
  };
}

export async function updateTaskStatus(taskId: string, status: string) {
  const { error } = await supabase
    .from("refactoring_tasks")
    .update({ status })
    .eq("id", taskId);
  if (error) throw error;
}
