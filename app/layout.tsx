import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { TerminalShell } from "@/components/terminal-shell";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmad Sajid // Quantitative Research & Systems",
  description:
    "Systematic trading research, limit order book simulation, Monte Carlo derivatives pricing, and real-time fraud engines.",
  keywords: [
    "Quantitative Research",
    "Quant Trading",
    "Limit Order Book",
    "Market Microstructure",
    "Monte Carlo",
    "Derivatives Pricing",
    "Machine Learning",
    "XGBoost",
  ],
  authors: [{ name: "Ahmad Sajid" }],
  openGraph: {
    title: "Ahmad Sajid // Quantitative Research & Systems",
    description:
      "Turning noisy data into testable edges. Limit order book simulator, Monte Carlo pricer, real-time risk engine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sajid Ahmad",
    alternateName: "Ahmad Sajid",
    url: "https://github.com/ahmadmdsajid129/sajid-ahmad-portfolio",
    jobTitle: "Quantitative Researcher & Systems Engineer",
    sameAs: ["https://github.com/ahmadmdsajid129"],
    knowsAbout: [
      "Quantitative Research",
      "Market Microstructure",
      "Limit Order Books",
      "Monte Carlo Simulation",
      "Derivatives Pricing",
      "Machine Learning",
      "High-Throughput Systems",
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-bg text-text">
        <ThemeProvider>
          <ToastProvider>
            <TerminalShell>
              {children}
            </TerminalShell>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
