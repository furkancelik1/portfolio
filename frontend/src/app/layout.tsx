import type { Metadata } from "next";
// @ts-ignore: CSS module declaration not found in this environment
import "./globals.css";
import AnimateWrapper from "@/components/providers/AnimateWrapper";
import SpaceBackground from "@/components/background/SpaceBackground";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Furkan Çelik",
  description:
    "Full-Stack Developer & Designer — Geleceğin Dijital Deneyimlerini İnşa Ediyorum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <SpaceBackground />
        <Header />
        <AnimateWrapper>{children}</AnimateWrapper>
      </body>
    </html>
  );
}
