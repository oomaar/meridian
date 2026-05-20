import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Newsreader } from "next/font/google";
import { getTheme } from "@/lib/theme";
import "./globals.css";
import "@/styles/utilities.css";
import "@/styles/shell.css";
import "@/styles/content.css";
import "@/styles/forms.css";
import "@/styles/overlays.css";
import "@/styles/landing.css";
import "@/styles/auth.css";
import "@/styles/responsive.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Meridian — The operating system for modern universities",
    template: "%s · Meridian",
  },
  description:
    "Meridian unifies enrollment, course delivery, grading, advising, and analytics in a single operational fabric — engineered for the registrars, deans, and faculty who keep an institution running.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  return (
    <html
      lang="en"
      data-theme={theme}
      data-density="comfortable"
      className={`${geistSans.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
