import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { KanbanBoard, Task } from "@/components/kanban/KanbanBoard";
import { useProjectKanban } from "@/hooks/useProjectKanban";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const { moveTask, onTaskUpdated } = useProjectKanban(id || "");

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => (id ? projectService.getProject(id) : null),
    enabled: !!id,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["project-tasks", id],
    queryFn: () => (id ? taskService.getTasksByProject(id) : []),
    enabled: !!id,
  });

  const createTaskMutation = useMutation({
    mutationFn: () =>
      id ? taskService.createTask(id, taskTitle) : Promise.reject(),
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
      setTaskTitle("");
      setShowCreateTask(false);
    },
    onError: () => toast.error("Failed to create task"),
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, newStatus, newOrder }: any) =>
      taskService.reorderTask(taskId, newStatus, newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
    },
  });

  const handleTaskMove = (taskId: string, newStatus: string, newOrder: number) => {
    moveTaskMutation.mutate({ taskId, newStatus, newOrder });
    moveTask(taskId, newStatus, newOrder);
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project?.title}</h1>
          {project?.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
        </div>
        <Button onClick={() => setShowCreateTask(!showCreateTask)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Create Task Form */}
      {showCreateTask && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Input
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => createTaskMutation.mutate()}
                disabled={createTaskMutation.isPending || !taskTitle}
              >
                Create Task
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateTask(false);
                  setTaskTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div>
        {tasks.length > 0 ? (
          <KanbanBoard tasks={tasks as Task[]} onTaskMove={handleTaskMove} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No tasks yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
