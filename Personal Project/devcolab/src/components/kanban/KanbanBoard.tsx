import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignedTo?: { _id: string; name: string; avatar?: string };
  deadline?: string;
  order: number;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: string, newOrder: number) => void;
  onTaskClick?: (task: Task) => void;
}

export function KanbanBoard({ tasks, onTaskMove, onTaskClick }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;
    onTaskMove(taskId, newStatus, 0);
  };

  const columns = [
    { id: "todo", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
    { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
  ];

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={tasks.filter((t) => t.status === column.id)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
