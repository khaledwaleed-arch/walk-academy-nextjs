"use client";
import { useI18n } from "@/lib/i18n";

interface Props {
  content: {
    title_en?: string;
    title_ar?: string;
    body_en?: string;
    body_ar?: string;
  };
}

export default function CustomSection({ content }: Props) {
  const { lang } = useI18n();
  const title = lang === "ar" ? (content.title_ar || content.title_en) : content.title_en;
  const body  = lang === "ar" ? (content.body_ar  || content.body_en)  : content.body_en;

  if (!title && !body) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {title && (
          <h2 className="text-3xl font-bold text-[#0D3B5C] mb-6 text-center">{title}</h2>
        )}
        {body && (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </div>
    </section>
  );
}
