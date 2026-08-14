import { env } from "cloudflare:workers";
import { CURATED_TRACKS, type Track } from "@/lib/tracks";

export const dynamic = "force-dynamic";

/**
 * Serves the track list for the player widget.
 *
 * When LASTFM_API_KEY and LASTFM_USER are configured, this returns real
 * recently-scrobbled tracks. Otherwise — or if Last.fm errors, rate-limits, or
 * returns nothing usable — it falls back to the curated list so the widget is
 * never empty.
 */

type LastfmImage = { "#text"?: string; size?: string };
type LastfmTrack = {
  name?: string;
  url?: string;
  artist?: { "#text"?: string; name?: string };
  image?: LastfmImage[];
  "@attr"?: { nowplaying?: string };
};

const LASTFM_ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const TRACK_LIMIT = 5;

function pickCover(images?: LastfmImage[]) {
  if (!Array.isArray(images)) return undefined;
  // Prefer the largest artwork Last.fm offers, skipping its blank placeholder.
  const preferred = ["extralarge", "large", "medium"];
  for (const size of preferred) {
    const hit = images.find((image) => image.size === size)?.["#text"];
    if (hit) return hit;
  }
  return undefined;
}

function normalise(raw: LastfmTrack[]): Track[] {
  const tracks: Track[] = [];
  for (const item of raw) {
    const title = item.name?.trim();
    const artist = (item.artist?.["#text"] ?? item.artist?.name)?.trim();
    if (!title || !artist) continue;
    tracks.push({
      title,
      artist,
      cover: pickCover(item.image),
      url: item.url,
    });
    if (tracks.length >= TRACK_LIMIT) break;
  }
  return tracks;
}

async function fetchLastfm(key: string, user: string) {
  const url = new URL(LASTFM_ENDPOINT);
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", user);
  url.searchParams.set("api_key", key);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(TRACK_LIMIT));

  // Never let a slow third party hang the request.
  const response = await fetch(url, {
    signal: AbortSignal.timeout(4000),
    headers: { "user-agent": "daria-cad-portfolio" },
  });
  if (!response.ok) throw new Error(`Last.fm responded ${response.status}`);

  const payload = (await response.json()) as {
    recenttracks?: { track?: LastfmTrack | LastfmTrack[] };
  };
  const raw = payload.recenttracks?.track;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const tracks = normalise(list);
  if (!tracks.length) throw new Error("Last.fm returned no usable tracks");

  const nowPlaying = list[0]?.["@attr"]?.nowplaying === "true";
  return { tracks, nowPlaying };
}

export async function GET() {
  const headers = { "cache-control": "public, max-age=60" };
  // These bindings are optional, so they are not part of the generated Env type.
  const config = env as unknown as Record<string, unknown>;
  const key = config.LASTFM_API_KEY;
  const user = config.LASTFM_USER;

  if (typeof key === "string" && key && typeof user === "string" && user) {
    try {
      const { tracks, nowPlaying } = await fetchLastfm(key, user);
      return Response.json({ tracks, source: "lastfm", nowPlaying }, { headers });
    } catch {
      // Fall through to the curated list below.
    }
  }

  return Response.json(
    { tracks: CURATED_TRACKS, source: "curated", nowPlaying: false },
    { headers },
  );
}
