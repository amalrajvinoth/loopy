// The loopy guide: how to use loopy, for kids and grown-ups, in English and German.
// Built with Astro and Starlight. It is served at /loopy/guide/, next to the games.
// Build:   npm ci && npm run build      (then python3 ../tools/csp.py adds the security policy)
// See README.md in this folder.
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

const group = (label, de, directory, extra = {}) => ({ label, translations: { de }, items: [{ autogenerate: { directory } }], ...extra });

export default defineConfig({
  base: "/loopy/guide",
  trailingSlash: "always",
  // Everything goes in files, so the security policy only has to allow a few small inline scripts.
  build: { inlineStylesheets: "never", assets: "_assets" },
  vite: { build: { assetsInlineLimit: 0 } },
  // No telemetry, no fonts or anything else from other websites.
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: { en: "loopy guide", de: "loopy-Anleitung" },
      description: "How to use loopy: every game, setup, settings, the grown-ups page, backups and help. For kids and grown-ups.",
      favicon: "/favicon.svg",
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        de: { label: "Deutsch", lang: "de" },
      },
      customCss: ["./src/styles/loopy.css"],
      expressiveCode: false,
      pagination: true,
      lastUpdated: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      components: {
        SocialIcons: "./src/components/PlayLink.astro",
        SiteTitle: "./src/components/SiteTitle.astro",
      },
      head: [
        // tools/csp.py fills this in after the build, with a hash for each inline script.
        { tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: "pending" } },
        { tag: "meta", attrs: { name: "referrer", content: "strict-origin-when-cross-origin" } },
        { tag: "meta", attrs: { name: "theme-color", content: "#0a0a0c" } },
        { tag: "link", attrs: { rel: "preload", href: "/loopy/fonts/lexend-latin.woff2", as: "font", type: "font/woff2", crossorigin: "" } },
      ],
      sidebar: [
        group("Start here", "Los geht's", "start"),
        group("Set up", "Einrichten", "setup"),
        group("Playing", "Spielen", "playing"),
        {
          label: "Games", translations: { de: "Spiele" },
          items: [
            { slug: "games" },
            { slug: "games/todays-10" },
            group("Math", "Mathe", "games/math", { collapsed: true }),
            group("Languages", "Sprachen", "games/languages", { collapsed: true }),
            group("Science", "Naturwissenschaft", "games/science", { collapsed: true }),
            group("Geography", "Erdkunde", "games/geography", { collapsed: true }),
          ],
        },
        group("Settings", "Einstellungen", "settings"),
        group("Grown-ups page", "Seite für Eltern", "grown-ups"),
        group("Stars and backups", "Sterne und Sicherung", "stars"),
        group("Help and problems", "Hilfe und Probleme", "help"),
      ],
    }),
  ],
});
