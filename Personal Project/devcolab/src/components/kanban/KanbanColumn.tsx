import { useDroppable } from "@dnd-kit/core";
import { Task } from "./KanbanBoard";
import { TaskCard } from "./TaskCard";
import { Card } from "@/components/ui/card";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function KanbanColumn({ id, title, color, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded">{tasks.length}</span>
      </div>

      <Card
        ref={setNodeRef}
        className={`min-h-96 p-3 space-y-2 ${color}`}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        ) : (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            No tasks
          </div>
        )}
      </Card>
    </div>
  );
}
