import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useTeamChat } from "@/hooks/useTeamChat";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Copy, Plus, Trash2, RotateCw } from "lucide-react";
import { teamService } from "@/services/teamService";
import { projectService } from "@/services/projectService";
import api from "@/services/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { joinTeam } = useTeamChat(id || "");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => (id ? teamService.getTeam(id) : null),
    enabled: !!id,
  });

  const { data: projects } = useQuery({
    queryKey: ["team-projects", id],
    queryFn: () => (id ? projectService.getProjectsByTeam(id) : []),
    enabled: !!id,
  });

  const isAdmin = team?.members?.some(
    (m: any) => m.userId._id === user?.id && m.role === "admin"
  );

  const createProjectMutation = useMutation({
    mutationFn: () =>
      id ? projectService.createProject(id, projectName, projectDesc) : Promise.reject(),
    onSuccess: () => {
      toast.success("Project created!");
      queryClient.invalidateQueries({ queryKey: ["team-projects", id] });
      setProjectName("");
      setProjectDesc("");
      setShowCreateProject(false);
    },
    onError: () => toast.error("Failed to create project"),
  });

  const regenerateInviteMutation = useMutation({
    mutationFn: () => (id ? teamService.regenerateInvite(id) : Promise.reject()),
    onSuccess: () => {
      toast.success("Invite code regenerated!");
      queryClient.invalidateQueries({ queryKey: ["team", id] });
    },
  });

  const copyInviteCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      toast.success("Invite code copied!");
    }
  };

  if (teamLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{team?.name}</h1>
        <p className="text-muted-foreground">Team collaboration hub</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Projects */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Projects</h2>
              {isAdmin && (
                <Button size="sm" onClick={() => setShowCreateProject(!showCreateProject)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              )}
            </div>

            {showCreateProject && isAdmin && (
              <Card className="mb-4">
                <CardContent className="pt-6 space-y-4">
                  <Input
                    placeholder="Project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => createProjectMutation.mutate()}
                      disabled={createProjectMutation.isPending || !projectName}
                    >
                      Create
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateProject(false);
                        setProjectName("");
                        setProjectDesc("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {projects && projects.length > 0 ? (
                projects.map((project: any) => (
                  <Card
                    key={project._id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => (window.location.href = `/project/${project._id}`)}
                  >
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {project.description && (
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No projects yet. Create one to get started!
                </div>
              )}
            </div>
          </div>

          {/* Members */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Members</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {team?.members && team.members.length > 0 ? (
                    team.members.map((member: any) => (
                      <div
                        key={member.userId._id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{member.userId.name}</p>
                          <p className="text-sm text-muted-foreground">{member.userId.email}</p>
                        </div>
                        <div className="text-sm font-semibold text-primary capitalize">
                          {member.role}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No members</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          {/* Invite Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invite Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="font-mono text-lg font-bold text-center p-3 bg-muted rounded">
                {team?.inviteCode}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={copyInviteCode}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              {isAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => regenerateInviteMutation.mutate()}
                  disabled={regenerateInviteMutation.isPending}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              )}
              {team?.inviteCodeExpiresAt && (
                <p className="text-xs text-muted-foreground text-center">
                  Expires: {new Date(team.inviteCodeExpiresAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Chat */}
          <ChatPanel teamId={id || ""} />
        </div>
      </div>
    </div>
  );
}
