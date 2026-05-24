import { getPool } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Reserved slugs that must NOT be caught by this catch-all route
const RESERVED = new Set([
  'courses', 'blog', 'register', 'contact', 'consultation',
  'services', 'about', 'login', 'privacy', 'terms', 'admin', 'api',
  'academy', 'sitemap.xml', 'robots.txt', 'favicon.ico', 'icon.png'
]);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return { title: 'Walk Business' };

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      "SELECT title FROM pages WHERE slug=$1 AND status='published'",
      [slug]
    );
    if (!rows[0]) return { title: 'Walk Business' };
    return { title: `${rows[0].title} | Walk Business` };
  } catch (_e) {
    return { title: 'Walk Business' };
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;

  if (RESERVED.has(slug)) return notFound();

  const pool = getPool();
  let page: { title: string; content: string } | null = null;

  try {
    const { rows } = await pool.query(
      "SELECT title, content FROM pages WHERE slug=$1 AND status='published'",
      [slug]
    );
    page = rows[0] || null;
  } catch (_e) {
    notFound();
  }

  if (!page) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0D3B5C] mb-8">{page.title}</h1>
      <div
        className="prose prose-lg max-w-none prose-headings:text-[#0D3B5C] prose-a:text-[#F58220]"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}
