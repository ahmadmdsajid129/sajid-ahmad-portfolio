import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const username = "ahmadmdsajid129";
  const fallbackCommits = 156;

  try {
    const res = await fetch(
      `https://api.github.com/search/commits?q=author:${username}`,
      {
        headers: {
          Accept: "application/vnd.github.cloak-preview+json",
          "User-Agent": "sajid-ahmad-portfolio",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({
        commits: fallbackCommits,
        source: "fallback",
        status: res.status,
      });
    }

    const data = await res.json();
    const count = typeof data.total_count === "number" ? data.total_count : fallbackCommits;

    return NextResponse.json({
      commits: count,
      source: "github-api",
      username,
    });
  } catch (error) {
    return NextResponse.json({
      commits: fallbackCommits,
      source: "fallback",
    });
  }
}
