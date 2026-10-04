import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req: Request) {
  const username = "ahmadmdsajid129";
  const fallbackCommits = "1,286";
  const { searchParams } = new URL(req.url);
  const isForceRefresh = searchParams.get("refresh") === "true";

  try {
    // Fetch user contributions card which includes private repository contributions
    // when "Private contributions" is enabled on the GitHub profile.
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
        ...(isForceRefresh ? { "Cache-Control": "no-cache" } : {}),
      },
      cache: isForceRefresh ? "no-store" : "default",
      next: isForceRefresh ? { revalidate: 0 } : { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({
        commits: fallbackCommits,
        source: "fallback",
        status: res.status,
      });
    }

    const html = await res.text();
    // GitHub contribution card header format: "1,286 contributions in the last year"
    const match = html.match(/([0-9,]+)\s+contributions\s+in\s+the\s+last\s+year/i);

    if (match && match[1]) {
      return NextResponse.json({
        commits: match[1].trim(),
        source: "github-api",
        username,
      });
    }

    return NextResponse.json({
      commits: fallbackCommits,
      source: "fallback",
    });
  } catch (error) {
    return NextResponse.json({
      commits: fallbackCommits,
      source: "fallback",
    });
  }
}

