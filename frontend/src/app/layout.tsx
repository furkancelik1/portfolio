import type { Metadata } from "next";
import "./globals.css";
import AnimateWrapper from "@/components/providers/AnimateWrapper";
import DynamicCanvasProvider from "@/components/providers/DynamicCanvasProvider";

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
        <DynamicCanvasProvider />
        <AnimateWrapper>{children}</AnimateWrapper>
      </body>
    </html>
  );
}
