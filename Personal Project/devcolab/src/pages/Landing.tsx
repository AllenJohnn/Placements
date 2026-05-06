import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-sidebar flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elegant">
            <Code2 className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Developer Collab
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Real-time collaboration for development teams. Manage projects, sync tasks, and communicate instantly.
        </p>

        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Real-Time Sync</h3>
            <p className="text-sm text-muted-foreground">
              See changes instantly across your team with Socket.io powered updates.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Kanban Boards</h3>
            <p className="text-sm text-muted-foreground">
              Organize tasks with drag-and-drop Kanban boards per project.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Team Chat</h3>
            <p className="text-sm text-muted-foreground">
              Built-in team chat for seamless project communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
