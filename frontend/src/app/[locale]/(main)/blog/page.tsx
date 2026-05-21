import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import BlogList from "./blog-list";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: `${t("title")} | Furkan Çelik`,
      description: t("description"),
    },
    twitter: {
      title: `${t("title")} | Furkan Çelik`,
      description: t("description"),
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  return <BlogList posts={posts} locale={locale} />;
}
