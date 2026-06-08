import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "~/lib/auth";

export const Route = createFileRoute("/mon-espace")({
  component: MonEspacePage,
});

function MonEspacePage() {
  const { user, member, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (member) {
        // Redirect to the user's own profile
        navigate({ to: `/membre/${member.id}` });
      } else {
        // Not logged in, redirect to login
        navigate({ to: "/login" });
      }
    }
  }, [loading, member, navigate]);

  return (
    <main className="min-h-screen bg-bg-darker flex items-center justify-center">
      <div className="text-text-secondary font-body">Redirection...</div>
    </main>
  );
}
