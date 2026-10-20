import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Frame } from "@/components/layout/Frame";
import { Header } from "@/components/layout/Header";
import { MenuOverlay } from "@/components/layout/menu/MenuOverlay";
import { MenuProvider } from "@/components/layout/menu/MenuProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CurtainProvider } from "@/components/transition/CurtainProvider";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}, ${site.location.city}`,
    template: `%s — ${site.name}`,
  },
  description: `${site.name} is a full-stack developer in ${site.location.city} building web apps and AI-powered products with React, Next.js and Node.js.`,
  authors: [{ name: site.name, url: site.url }],
  openGraph: { type: "website", siteName: site.name, locale: "en_IN" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

// Runs before first paint: marks JS as available (scroll reveals start hidden) and applies the
// visitor's saved "reduce motion" choice so nothing animates for a frame first.
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{if(localStorage.getItem("nd:motion")==="reduce")d.dataset.motion="reduce"}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <MotionProvider>
            <CurtainProvider>
              <MenuProvider>
                {/* Everything behind the menu: made inert while the menu is open */}
                <div id="site-root">
                  <a
                    href="#main"
                    className="fixed top-3 left-3 z-50 -translate-y-20 bg-accent px-3 py-2 type-label text-accent-ink focus:translate-y-0"
                  >
                    Skip to content
                  </a>
                  <Header />
                  <Frame>
                    <main id="main" tabIndex={-1} className="flex-1 pt-header outline-none">
                      {children}
                    </main>
                    <Footer />
                  </Frame>
                </div>
                <MenuOverlay />
              </MenuProvider>
            </CurtainProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
