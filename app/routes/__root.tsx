import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "~/components/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />
      <Outlet />
    </>
  );
}
