import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/context/SocketContext";
import { messageService } from "@/services/messageService";
import { Send } from "lucide-react";

interface ChatPanelProps {
  teamId: string;
}

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  teamId: string;
}

export function ChatPanel({ teamId }: ChatPanelProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: initialMessages } = useQuery({
    queryKey: ["messages", teamId],
    queryFn: () => messageService.getMessages(teamId),
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    const handleReceive = (data: Message) => {
      if (data.teamId === teamId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket?.on("chat:receive", handleReceive);
    return () => socket?.off("chat:receive", handleReceive);
  }, [socket, teamId]);

  const handleSend = () => {
    if (!input.trim()) return;

    setIsLoading(true);
    socket?.emit("chat:send", { teamId, content: input });
    setInput("");
    setIsLoading(false);
  };

  return (
    <Card className="flex flex-col h-96 bg-sidebar">
      {/* Header */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <h3 className="font-semibold">Team Chat</h3>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No messages yet
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender.avatar && (
                    <img
                      src={msg.sender.avatar}
                      alt={msg.sender.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="font-medium">{msg.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-muted-foreground ml-7">{msg.content}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
