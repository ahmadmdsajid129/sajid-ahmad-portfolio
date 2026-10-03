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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
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
