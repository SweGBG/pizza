import type { Metadata, Viewport } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/800.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/fraunces/600-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pizzeria-dellanima.vercel.app"),
  title: "Pizzeria dell'Anima – Pizza av själen | Göteborg",
  description:
    "Napolitansk pizza från vedeldad stenugn i Göteborg. 48 timmars deg, San Marzano DOP och fior di latte. Pizzeria dell'Anima – pizza av själen, sedan 2024.",
  openGraph: {
    title: "Pizzeria dell'Anima – Pizza av själen",
    description: "Napolitansk pizza från vedeldad stenugn i Göteborg.",
    images: ["/img/pizza-end.webp"],
    locale: "sv_SE",
    type: "website",
  },
  icons: { icon: "/img/emblem-sm.webp" },
};

export const viewport: Viewport = { themeColor: "#0e0c0b", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Pizzeria dell'Anima",
  alternateName: "Pizza av själen",
  servesCuisine: ["Italian", "Neapolitan pizza"],
  address: { "@type": "PostalAddress", streetAddress: "Storgatan 1", postalCode: "411 01", addressLocality: "Göteborg", addressCountry: "SE" },
  priceRange: "$$",
  foundingDate: "2024",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className="crintro-wait" suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`.crintro-loader{display:none!important}html.crintro-wait{overflow:auto}html.crintro-wait [data-crintro-hold],html.crintro-wait [data-crintro-hold] *{animation-play-state:running!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
