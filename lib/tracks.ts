/**
 * Curated fallback playlist.
 *
 * This list renders whenever live Last.fm data is unavailable — either because
 * LASTFM_API_KEY / LASTFM_USER are not configured, or because the API call
 * failed. Edit it freely: it is plain data, no build step involved.
 *
 * `url` should point wherever you want listeners to go — YouTube Music,
 * Spotify, Bandcamp. It opens in a new tab.
 */

export type Track = {
  title: string;
  artist: string;
  /** YouTube video ID when the row comes from the embedded playlist. */
  videoId?: string;
  /** Optional cover image URL. Falls back to a generated initial when absent. */
  cover?: string;
  /** Where clicking the track sends the visitor. */
  url?: string;
};

export type MixCue = Track & {
  /** Start of the lead track in the 30:03 megamix, in seconds. */
  startSeconds: number;
};

/** Shown under the track list, like a playlist name. */
export const PLAYLIST_NAME = "ON REPEAT";
export const PLAYLIST_OWNER = "daria";

/**
 * A single long-form mix drives the player: one continuous piece of audio the
 * visitor can play, pause and scrub, rather than a queue of separate tracks.
 */
export const YOUTUBE_MIX_ID = "UKsnz_hDFRY";
export const YOUTUBE_MIX_TITLE = "namitape megamix";
export const YOUTUBE_MIX_AUTHOR = "namitape";
export const YOUTUBE_MIX_URL = `https://youtu.be/${YOUTUBE_MIX_ID}`;
/** Video thumbnail, used as the player's artwork. */
export const YOUTUBE_MIX_COVER = `https://i.ytimg.com/vi/${YOUTUBE_MIX_ID}/maxresdefault.jpg`;

/** Playlist artwork, used whenever a track has no cover of its own. */
export const PLAYLIST_COVER = publicPath("/media/music-player-frog.webp");

/**
 * Each entry carries a verified YouTube video id, so the embedded player can
 * actually load it. Ids were checked against the oEmbed endpoint — a track
 * without one would silently fail to play.
 */
/** Lead-track cues taken from the published timestamp list for this mix. */
export const MIX_CUES: MixCue[] = [
  { title: "The Room", artist: "namitape", startSeconds: 0 },
  { title: "nawatobi drive", artist: "namitape", startSeconds: 23 },
  { title: "Shumatsu Chromatic", artist: "namitape", startSeconds: 126 },
  { title: "Rhythm Disc", artist: "namitape", startSeconds: 150 },
  { title: "Full Color", artist: "namitape", startSeconds: 260 },
  { title: "Shining Home", artist: "namitape", startSeconds: 331 },
  { title: "Sorry Memories", artist: "namitape", startSeconds: 439 },
  { title: "Black Hole", artist: "namitape", startSeconds: 485 },
  { title: "Overfeel", artist: "namitape", startSeconds: 597 },
  { title: "darekano mall", artist: "namitape", startSeconds: 789 },
  { title: "Cloud Telepathy", artist: "namitape", startSeconds: 826 },
  { title: "darekano mall", artist: "namitape", startSeconds: 1019 },
  { title: "My Dear", artist: "namitape", startSeconds: 1035 },
  { title: "repercussion", artist: "namitape", startSeconds: 1051 },
  { title: "Mirareru Mirror", artist: "namitape", startSeconds: 1070 },
  { title: "hetoheto room", artist: "namitape", startSeconds: 1220 },
  { title: "Liminal Houmon", artist: "namitape", startSeconds: 1235 },
  { title: "Going Somewhere", artist: "namitape", startSeconds: 1418 },
  { title: "Intermission", artist: "namitape", startSeconds: 1645 },
  { title: "Goodbye", artist: "namitape", startSeconds: 1674 },
];

/** Kept as the API fallback used elsewhere in the site. */
export const CURATED_TRACKS: Track[] = MIX_CUES.slice(0, 4);
import { publicPath } from "@/lib/public-path";
