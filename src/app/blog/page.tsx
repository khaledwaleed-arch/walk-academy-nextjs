import { getPool } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Walk Business',
  description: 'Articles and insights from Walk Business on accounting, finance, and business consulting.',
};

export default async function BlogPage() {
  const pool = getPool();
  let posts: { id: number; title: string; slug: string; excerpt: string | null; created_at: Date }[] = [];

  try {
    const { rows } = await pool.query(
      `SELECT id, title, slug, excerpt, created_at FROM posts WHERE status='published' AND deleted_at IS NULL ORDER BY created_at DESC`
    );
    posts = rows;
  } catch (_e) {
    // DB not available — show empty state
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0D3B5C] mb-4">Blog</h1>
      <p className="text-gray-600 mb-10">Insights, guides and updates from Walk Business.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No posts published yet.</p>
          <p className="mt-2">Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-gray-200 pb-8">
              <Link
                href={`/blog/${post.slug}`}
                className="text-2xl font-semibold text-[#0D3B5C] hover:text-[#F58220] transition-colors"
              >
                {post.title}
              </Link>
              {post.excerpt && (
                <p className="text-gray-600 mt-2 leading-relaxed">{post.excerpt}</p>
              )}
              <p className="text-sm text-gray-400 mt-3">
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-3 text-[#F58220] font-medium hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
