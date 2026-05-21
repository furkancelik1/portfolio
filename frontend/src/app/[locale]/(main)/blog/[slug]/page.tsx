import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getAllSlugs, getPostBySlug, compileMdxSource } from "@/lib/blog";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  es: "es-ES",
};

export async function generateStaticParams() {
  const allSlugs = new Set<string>();
  for (const locale of ["tr", "en", "es"]) {
    for (const slug of getAllSlugs(locale)) {
      allSlugs.add(slug);
    }
  }
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      locale: LOCALE_MAP[locale] || "tr-TR",
    },
    twitter: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
    },
  };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(LOCALE_MAP[locale] || "tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) notFound();

  const mdxComponents = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold text-white mt-10 mb-4 tracking-tight leading-tight" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-bold text-white mt-8 mb-3 tracking-tight" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-xl font-semibold text-white mt-6 mb-2" {...props} />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-zinc-300 leading-relaxed mb-5 text-[15px]" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="space-y-2 mb-5 list-disc pl-5 text-zinc-300 text-[15px]" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="space-y-2 mb-5 list-decimal pl-5 text-zinc-300 text-[15px]" {...props} />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="text-zinc-300 leading-relaxed" {...props} />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
      <strong className="text-white font-semibold" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors" {...props} />
    ),
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-l-2 border-violet-500/50 pl-5 italic text-zinc-400 my-6" {...props} />
    ),
    hr: () => <hr className="border-zinc-800 my-8" />,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm text-zinc-300 border-collapse" {...props} />
      </div>
    ),
    th: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th className="border border-zinc-800 px-4 py-2 bg-zinc-900/50 text-left font-semibold text-white" {...props} />
    ),
    td: (props: React.HTMLAttributes<HTMLTableDataCellElement>) => (
      <td className="border border-zinc-800 px-4 py-2" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => {
      const isInline = (props as { node?: { tagName?: string } })?.node?.tagName !== "pre";
      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-violet-300 text-sm font-mono" {...props} />
        );
      }
      return <code {...props} />;
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5 my-6 text-sm leading-relaxed"
        {...props}
      />
    ),
  };

  const { content } = await compileMdxSource(post.content, mdxComponents);

  return (
    <article className="min-h-screen pt-28 pb-24 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-white/30 mb-8">
          <Link href="/blog" className="hover:text-violet-400 transition-colors">
            ← Blog
          </Link>
        </div>

        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] border border-violet-500/20 bg-violet-500/5 text-violet-300 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-white sm:text-5xl tracking-tight leading-tight">
            {post.frontmatter.title}
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed">
            {post.frontmatter.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs font-mono text-white/30">
            <span>{formatDate(post.frontmatter.date, locale)}</span>
          </div>
        </header>

        <div className="prose-custom">{content}</div>
      </div>
    </article>
  );
}
