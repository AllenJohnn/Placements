import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Task } from "./KanbanBoard";
import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task._id,
  });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>

      <div className="space-y-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          {task.assignedTo && (
            <div className="flex items-center gap-2">
              {task.assignedTo.avatar && (
                <img
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="text-xs text-muted-foreground">{task.assignedTo.name}</span>
            </div>
          )}

          {task.deadline && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(task.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
