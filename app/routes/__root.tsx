import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "~/components/Header";
import { supabase } from "~/lib/supabase";
import { linkAuthToMember } from "~/lib/auth";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();

  // Handle auth callback from any page (magic link might redirect to /)
  useEffect(() => {
    async function handleAuthHash() {
      const hash = window.location.hash;

      // Check if this looks like an auth callback
      if (hash && (hash.includes("access_token") || hash.includes("type=magiclink"))) {
        // Give Supabase time to process
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Link auth to member and redirect
          const { member } = await linkAuthToMember(session.user.id, session.user.email!);

          if (member) {
            // Clear the hash and redirect
            window.history.replaceState(null, "", window.location.pathname);
            navigate({ to: "/mon-espace" });
          }
        }
      }
    }

    handleAuthHash();
  }, [navigate]);

  return (
    <>
      <Header />
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />
      <Outlet />
    </>
  );
}
