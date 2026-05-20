import { MetadataRoute } from "next";
import { getAllCourseSlugs } from "@/data/courses";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.walk-business.com";
  const courseUrls = getAllCourseSlugs().map((slug) => ({
    url: `${base}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#services`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#academy`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#blog`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/#contact`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${base}/privacy`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/consultation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...courseUrls,
  ];
}
