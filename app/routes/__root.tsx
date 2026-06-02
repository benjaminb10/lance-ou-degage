import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LANCE OU DÉGAGE | tu sors un truc en 30 jours. ou tu dégages." },
      {
        name: "description",
        content:
          "Le club de ceux qui livrent, pendant que les autres peaufinent leur logo. Rejoins une communauté de makers qui sortent un produit tous les 30 jours.",
      },
      { name: "theme-color", content: "#0f0d0b" },
      { property: "og:title", content: "LANCE OU DÉGAGE | tu sors un truc en 30 jours. ou tu dégages." },
      { property: "og:description", content: "Le club de ceux qui livrent. Sors un produit tous les 30 jours ou tu dégages." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <Meta />
      </head>
      <body>
        {/* Grain overlay */}
        <div className="grain" aria-hidden="true" />

        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
