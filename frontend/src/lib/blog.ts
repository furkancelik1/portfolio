import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  readingTime: number;
}

const DEFAULT_LOCALE = "tr";

function blogDir(locale: string): string {
  return path.join(process.cwd(), "content/blog", locale);
}

function slugify(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function readMdxFiles(dir: string): BlogPost[] {
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .reverse();

  return files.map((file) => {
    const slug = slugify(file);
    const source = fs.readFileSync(path.join(dir, file), "utf-8");
    const { content, data } = matter(source);
    const frontmatter = data as BlogFrontmatter;

    return {
      slug,
      frontmatter,
      readingTime: estimateReadingTime(content),
    };
  });
}

export function getAllPosts(locale: string = DEFAULT_LOCALE): BlogPost[] {
  const posts = readMdxFiles(blogDir(locale));
  if (posts.length > 0) return posts;
  return readMdxFiles(blogDir(DEFAULT_LOCALE));
}

export function getPostBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE
): {
  content: string;
  frontmatter: BlogFrontmatter;
} | null {
  const filePath = path.join(blogDir(locale), `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    const source = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(source);
    return { content, frontmatter: data as BlogFrontmatter };
  }

  const fallbackPath = path.join(blogDir(DEFAULT_LOCALE), `${slug}.mdx`);
  if (fs.existsSync(fallbackPath)) {
    const source = fs.readFileSync(fallbackPath, "utf-8");
    const { content, data } = matter(source);
    return { content, frontmatter: data as BlogFrontmatter };
  }

  return null;
}

export function getAllSlugs(locale: string = DEFAULT_LOCALE): string[] {
  const slugs = new Set<string>();

  for (const l of [locale, DEFAULT_LOCALE]) {
    const dir = blogDir(l);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".mdx")) slugs.add(slugify(f));
    }
  }

  return Array.from(slugs);
}

export function compileMdxSource(
  content: string,
  components?: Record<string, React.ComponentType>
) {
  return compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: true,
              defaultLang: "plaintext",
            },
          ],
        ],
      },
    },
    components,
  });
}
