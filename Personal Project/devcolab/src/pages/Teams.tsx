import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import api from "@/services/api";
import { teamService } from "@/services/teamService";

export default function Teams() {
  const queryClient = useQueryClient();
  const [inviteCode, setInviteCode] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["user-teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => teamService.createTeam(name),
    onSuccess: () => {
      toast.success("Team created!");
      queryClient.invalidateQueries({ queryKey: ["user-teams"] });
      setNewTeamName("");
      setShowCreate(false);
    },
    onError: () => toast.error("Failed to create team"),
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) => teamService.joinTeam(code),
    onSuccess: () => {
      toast.success("Joined team!");
      queryClient.invalidateQueries({ queryKey: ["user-teams"] });
      setInviteCode("");
    },
    onError: () => toast.error("Invalid invite code"),
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage and join teams</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4 mr-2" />
          New Team
        </Button>
      </div>

      {/* Create Team Form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create Team</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(newTeamName);
              }}
              className="space-y-4"
            >
              <Input
                placeholder="Team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                disabled={createMutation.isPending}
              />
              <Button type="submit" disabled={createMutation.isPending || !newTeamName}>
                {createMutation.isPending ? "Creating..." : "Create Team"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Join Team Form */}
      <Card>
        <CardHeader>
          <CardTitle>Join Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              joinMutation.mutate(inviteCode);
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Invite code (e.g., ABCD1234)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              disabled={joinMutation.isPending}
            />
            <Button type="submit" disabled={joinMutation.isPending || !inviteCode}>
              {joinMutation.isPending ? "Joining..." : "Join Team"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Teams</h2>
        {teams && teams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team: any) => (
              <Card
                key={team._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/team/${team._id}`}
              >
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {team.members?.length || 0} members
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Code: <span className="font-mono font-semibold">{team.inviteCode}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No teams yet. Create or join one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
