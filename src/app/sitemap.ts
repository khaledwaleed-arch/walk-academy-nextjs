import { MetadataRoute } from "next";
import { getPool } from "@/lib/db";

const BASE = "https://www.walk-business.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/consultation`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/register`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/courses`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/blog`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/privacy`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/refund`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Dynamic course pages from DB
  let course_pages: MetadataRoute.Sitemap = [];
  let blog_pages: MetadataRoute.Sitemap = [];
  try {
    const pool = getPool();
    const [courses, posts] = await Promise.all([
      pool.query(`SELECT slug, updated_at FROM courses WHERE deleted_at IS NULL ORDER BY id`),
      pool.query(`SELECT slug, updated_at FROM posts WHERE status='published' AND deleted_at IS NULL ORDER BY created_at DESC`),
    ]);
    course_pages = courses.rows.map((c: { slug: string; updated_at: Date }) => ({
      url: `${BASE}/courses/${c.slug}`,
      lastModified: c.updated_at ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
    blog_pages = posts.rows.map((p: { slug: string; updated_at: Date }) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updated_at ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch { /* DB unavailable — sitemap still works with static pages */ }

  return [...static_pages, ...course_pages, ...blog_pages];
}
