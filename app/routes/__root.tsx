import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";
import type { ReactNode } from "react";

const SITE_URL = "https://lance-ou-degage.fr";
const SITE_NAME = "LANCE OU DÉGAGE";
const SITE_TITLE = "LANCE OU DÉGAGE | tu sors un truc en 30 jours. ou tu dégages.";
const SITE_DESCRIPTION = "Le club de ceux qui livrent, pendant que les autres peaufinent leur logo. Rejoins une communauté de makers qui sortent un produit tous les 30 jours.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      // Base
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#0f0d0b" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: SITE_NAME },
      { name: "keywords", content: "makers, entrepreneuriat, lancer produit, 30 jours, challenge, communauté, startup, side project, indie hacker, france" },

      // Open Graph
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "LANCE OU DÉGAGE - Le club de ceux qui livrent" },
      { property: "og:locale", content: "fr_FR" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "LANCE OU DÉGAGE - Le club de ceux qui livrent" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": `${SITE_URL}/favicon.svg`,
          "description": SITE_DESCRIPTION,
          "sameAs": [],
        }),
      },
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
