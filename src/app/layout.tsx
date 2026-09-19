import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter, Khand, Outfit, Patrick_Hand } from "next/font/google";
import { BasketProvider } from "@/components/zine/BasketProvider";
import { Footer } from "@/components/zine/Footer";
import { Nav } from "@/components/zine/Nav";
import { Preloader } from "@/components/zine/Preloader";
import { site } from "@/data/site";
import "./globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});


const khand = Khand({ variable: "--font-khand", subsets: ["latin"], weight: ["600"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const hand = Patrick_Hand({ variable: "--font-hand", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Wood-Fired Neapolitan Pizza in Noida`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6efe1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${garamond.variable} ${outfit.variable} ${khand.variable} ${inter.variable} ${hand.variable}`}>
      <body className="relative flex min-h-dvh flex-col overflow-x-clip bg-paper font-ui text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary-container focus:px-4 focus:py-2 focus:text-basalt"
        >
          Skip to content
        </a>
        <BasketProvider>
          <Preloader />
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
