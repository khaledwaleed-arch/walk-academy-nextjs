import { getPool } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pool = getPool();
  try {
    const { rows } = await pool.query(
      "SELECT title, excerpt, meta_title, meta_description FROM posts WHERE slug=$1 AND status='published' AND deleted_at IS NULL",
      [slug]
    );
    if (!rows[0]) return { title: 'Post Not Found | Walk Business' };
    return {
      title: `${rows[0].meta_title || rows[0].title} | Walk Business Blog`,
      description: rows[0].meta_description || rows[0].excerpt || '',
    };
  } catch (_e) {
    return { title: 'Blog | Walk Business' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const pool = getPool();

  let post: {
    id: number;
    title: string;
    content: string;
    excerpt: string | null;
    author_name: string;
    created_at: Date;
    featured_image_url: string | null;
  } | null = null;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM posts WHERE slug=$1 AND status='published' AND deleted_at IS NULL",
      [slug]
    );
    post = rows[0] || null;
  } catch (_e) {
    notFound();
  }

  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-[#F58220] hover:underline text-sm mb-6 inline-block">
        ← Back to Blog
      </Link>

      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="text-3xl font-bold text-[#0D3B5C] mb-3">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-8">
        By {post.author_name} &bull;{' '}
        {new Date(post.created_at).toLocaleDateString('en-GB', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}
      </p>

      <div
        className="prose prose-lg max-w-none prose-headings:text-[#0D3B5C] prose-a:text-[#F58220]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
