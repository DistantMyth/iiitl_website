import type { Metadata } from "next";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/newsreader/latin-400-italic.css";
import "@fontsource-variable/outfit";
import "./globals.css";
import { SiteProvider } from "@/components/provider";
export const metadata: Metadata = {
  title: {
    default: "IIIT Lucknow — Learn. Innovate. Build. Impact.",
    template: "%s | IIIT Lucknow",
  },
  description:
    "Explore academics, research, campus life and the unified campus portal at the Indian Institute of Information Technology, Lucknow.",
  icons: { icon: "/assets/logos/iiitl_favicon_150x150.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
