import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />
      <Outlet />
    </>
  );
}
