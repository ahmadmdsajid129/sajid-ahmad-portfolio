import { researchNotesList } from "@/data/antiportfolio";
import { siteConfig } from "@/data/site";

export async function GET() {
  const siteUrl = "https://github.com/ahmadmdsajid129/sajid-ahmad-portfolio";

  const rssItems = researchNotesList
    .map(
      (note) => `
    <item>
      <title><![CDATA[${note.title}]]></title>
      <link>${siteUrl}/content/notes/${note.slug}</link>
      <guid>${siteUrl}/content/notes/${note.slug}</guid>
      <pubDate>${new Date(note.date).toUTCString()}</pubDate>
      <description><![CDATA[${note.summary}]]></description>
    </item>
  `
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteUrl}</link>
    <description>${siteConfig.pitch}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
