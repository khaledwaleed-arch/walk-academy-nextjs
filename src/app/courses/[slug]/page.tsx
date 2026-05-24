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
  const url = `https://www.walk-business.com/courses/${slug}`;
  const ogImage = "https://www.walk-business.com/og-image.png";
  return {
    title: `${course.title_en} | Walk Academy`,
    description: course.description_en?.slice(0, 160),
    alternates: {
      canonical: url,
      languages: {
        "ar": url,
        "en": url,
        "x-default": url,
      },
    },
    openGraph: {
      title: `${course.title_en} — Walk Academy`,
      description: course.description_en?.slice(0, 160),
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: course.title_en }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title_en} — Walk Academy`,
      description: course.description_en?.slice(0, 160),
      images: [ogImage],
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

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title_en,
    description: course.description_en,
    url: `https://www.walk-business.com/courses/${slug}`,
    provider: {
      "@type": "Organization",
      name: "Walk Academy",
      url: "https://www.walk-business.com",
    },
    offers: {
      "@type": "Offer",
      price: course.price?.replace(/[^0-9.]/g, "") || "0",
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      url: `https://www.walk-business.com/register?course=${slug}`,
    },
    ...(course.instructor_name && {
      instructor: {
        "@type": "Person",
        name: course.instructor_name,
        jobTitle: course.instructor_title_en,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <CourseDetail course={course} others={others} />
    </>
  );
}
