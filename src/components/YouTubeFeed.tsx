import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";

interface YTVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

async function fetchYouTubeVideos(channelId: string): Promise<YTVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    return entries.slice(0, 6).map((m) => {
      const entry = m[1];
      const videoId = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1] || "";
      const title = (entry.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
      const published = (entry.match(/<published>([^<]+)<\/published>/) || [])[1] || "";
      return {
        id: videoId,
        title: decodeHtmlEntities(title),
        published: published ? new Date(published).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }) : "",
        thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch {
    return [];
  }
}

function decodeHtmlEntities(str: string) {
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export default async function YouTubeFeed() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || "UCa3Zakmv2M7bp9vs8b7Lynw";
  const videos = await fetchYouTubeVideos(channelId);

  return (
    <section id="youtube" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-semibold mb-4">
            <i className="fab fa-youtube" /> Walk Academy على يوتيوب
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            محتوى تعليمي مجاني
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            دروس وشروحات مجانية في المحاسبة، Odoo ERP، والتحليل المالي
          </p>
        </AnimatedSection>

        {videos.length === 0 ? (
          <AnimatedSection className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
              <i className="fab fa-youtube text-4xl text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#0D3B5C] mb-3">قادم قريباً</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              نعمل على تحضير محتوى تعليمي مميز. اشترك الآن لتصلك الإشعارات فور النشر.
            </p>
            <a
              href="https://www.youtube.com/@Walk-Academy?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-red-200"
            >
              <i className="fab fa-youtube text-2xl" />
              اشترك في القناة
            </a>
          </AnimatedSection>
        ) : (
          <>
            <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {videos.map((v) => (
                <StaggerItem key={v.id}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <i className="fas fa-play text-white text-lg ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-[#0D3B5C] font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#1a5a8a] transition-colors">
                        {v.title}
                      </h3>
                      {v.published && (
                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                          <i className="fas fa-calendar text-[#F58220]" /> {v.published}
                        </p>
                      )}
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <AnimatedSection className="text-center">
              <a
                href="https://www.youtube.com/@Walk-Academy?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-red-200"
              >
                <i className="fab fa-youtube text-2xl" />
                شاهد المزيد على يوتيوب
              </a>
            </AnimatedSection>
          </>
        )}
      </div>
    </section>
  );
}
