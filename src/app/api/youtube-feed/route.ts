import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    const channelId = "UCa3Zakmv2M7bp9vs8b7Lynw";
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ videos: [] });

    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    const videos = entries.slice(0, 6).map((m) => {
      const e = m[1];
      const videoId = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1] || "";
      const title = (e.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
      const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1] || "";
      return {
        id: videoId,
        title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        published: published ? new Date(published).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }) : "",
        thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}
