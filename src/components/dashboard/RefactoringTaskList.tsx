import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { updateTaskStatus } from "@/lib/api";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string | null;
  module_name: string;
  priority: string;
  status: string;
  estimated_effort: string | null;
  risk_level: number | null;
}

const priorityConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  critical: { color: "bg-danger/20 text-danger border-danger/30", icon: <XCircle className="w-3.5 h-3.5" /> },
  high: { color: "bg-warning/20 text-warning border-warning/30", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  medium: { color: "bg-info/20 text-info border-info/30", icon: <Clock className="w-3.5 h-3.5" /> },
  low: { color: "bg-success/20 text-success border-success/30", icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

export function RefactoringTaskList({ tasks, onUpdate }: { tasks: Task[]; onUpdate: () => void }) {
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success("Task updated");
      onUpdate();
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 text-sm">
        No refactoring tasks yet. Run an analysis to generate suggestions.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
      {tasks.map((task) => {
        const config = priorityConfig[task.priority] || priorityConfig.medium;
        return (
          <div
            key={task.id}
            className={`rounded-lg border border-border p-4 card-gradient transition-all ${task.status === "completed" ? "opacity-50" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className={`text-xs ${config.color} gap-1`}>
                    {config.icon} {task.priority}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">{task.module_name}</span>
                </div>
                <h4 className="font-medium text-sm text-foreground truncate">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {task.estimated_effort && <span>Effort: {task.estimated_effort}</span>}
                  {task.risk_level != null && (
                    <span>Risk: {Math.round(Number(task.risk_level) * 100)}%</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {task.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => handleStatusChange(task.id, task.status === "pending" ? "in_progress" : "completed")}
                  >
                    {task.status === "pending" ? "Start" : "Done"}
                  </Button>
                )}
                {task.status !== "skipped" && task.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7 text-muted-foreground"
                    onClick={() => handleStatusChange(task.id, "skipped")}
                  >
                    Skip
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
