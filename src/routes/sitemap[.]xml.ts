import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { COUNTRIES } from "@/data/countries";

const BASE_URL = "https://roamio-explorer.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const SERVICES = ["stays", "experiences", "flights", "attractions", "food", "transport"] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/trip-builder", changefreq: "weekly", priority: "0.9" },
          { path: "/rewards", changefreq: "monthly", priority: "0.8" },
        ];

        for (const country of COUNTRIES) {
          entries.push({ path: `/${country.slug}`, changefreq: "weekly", priority: "0.8" });
          for (const service of SERVICES) {
            const items = country.services?.[service] ?? [];
            if (items.length === 0) continue;
            entries.push({ path: `/${country.slug}/${service}`, changefreq: "weekly", priority: "0.7" });
            for (const listing of items) {
              entries.push({
                path: `/${country.slug}/${service}/${listing.id}`,
                changefreq: "monthly",
                priority: "0.6",
              });
            }
          }
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
