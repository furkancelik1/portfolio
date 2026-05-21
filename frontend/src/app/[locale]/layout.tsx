import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import SpaceBackground from "@/components/background/SpaceBackground";
import Header from "@/components/layout/Header";
import CustomCursor from "@/components/ui/CustomCursor";
import AnimateWrapper from "@/components/providers/AnimateWrapper";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const ogLocale = locale === "tr" ? "tr_TR" : locale === "es" ? "es_ES" : "en_US";

  return {
    metadataBase: new URL("https://furkan-celik.vercel.app"),
    title: {
      default: "Furkan Çelik - Full-Stack Developer",
      template: "%s | Furkan Çelik - Full-Stack Developer",
    },
    description: t("subtitle"),
    openGraph: {
      title: "Furkan Çelik",
      description: t("subtitle"),
      siteName: "Furkan Çelik",
      locale: ogLocale,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Furkan Çelik - Full-Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Furkan Çelik",
      description: t("subtitle"),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr" | "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CustomCursor />
          <SpaceBackground />
          <Header />
          <AnimateWrapper>{children}</AnimateWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
