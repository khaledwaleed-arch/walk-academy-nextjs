import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPool } from "@/lib/db";
import CourseDetail from "@/components/CourseDetail";

export const dynamic = "force-dynamic";

async function getCourse(slug: string) {
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT * FROM courses WHERE slug=$1 AND status='published'",
    [slug]
  );
  return rows[0] || null;
}

async function getOthers(slug: string) {
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT * FROM courses WHERE slug!=$1 AND status='published' ORDER BY sort_order",
    [slug]
  );
  return rows;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.title_en} | Walk Academy`,
    description: course.description_en?.slice(0, 160),
    alternates: { canonical: `https://www.walk-business.com/courses/${slug}` },
    openGraph: {
      title: `${course.title_en} — Walk Academy`,
      description: course.description_en?.slice(0, 160),
      url: `https://www.walk-business.com/courses/${slug}`,
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, others] = await Promise.all([getCourse(slug), getOthers(slug)]);
  if (!course) notFound();
  return <CourseDetail course={course} others={others} />;
}
