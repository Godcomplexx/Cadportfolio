import { env } from "cloudflare:workers";
import {
  PROJECT_KEYS,
  isProjectKey,
  type ProjectKey,
} from "@/lib/projects";

export const dynamic = "force-dynamic";

async function ensureTable() {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS project_likes (
      project_key TEXT PRIMARY KEY NOT NULL,
      likes INTEGER DEFAULT 0 NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`,
  ).run();
}

async function getCounts() {
  await ensureTable();
  const placeholders = PROJECT_KEYS.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `SELECT project_key AS projectKey, likes
     FROM project_likes
     WHERE project_key IN (${placeholders})`,
  )
    .bind(...PROJECT_KEYS)
    .all<{ projectKey: ProjectKey; likes: number }>();

  const counts = Object.fromEntries(
    PROJECT_KEYS.map((key) => [key, 0]),
  ) as Record<ProjectKey, number>;
  result.results.forEach((row) => {
    if (isProjectKey(row.projectKey)) counts[row.projectKey] = row.likes;
  });
  return counts;
}

async function readProject(request: Request) {
  const body = (await request.json()) as { project?: unknown };
  return isProjectKey(body.project) ? body.project : null;
}

export async function GET() {
  try {
    return Response.json(
      { counts: await getCounts() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    const counts = Object.fromEntries(
      PROJECT_KEYS.map((key) => [key, 0]),
    ) as Record<ProjectKey, number>;
    return Response.json(
      { counts, storage: "temporarily-unavailable" },
      { headers: { "cache-control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  const project = await readProject(request);
  if (!project) {
    return Response.json({ error: "Unknown project." }, { status: 400 });
  }

  try {
    await ensureTable();
    const row = await env.DB.prepare(
      `INSERT INTO project_likes (project_key, likes, updated_at)
       VALUES (?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(project_key) DO UPDATE SET
         likes = project_likes.likes + 1,
         updated_at = CURRENT_TIMESTAMP
       RETURNING likes`,
    )
      .bind(project)
      .first<{ likes: number }>();
    return Response.json({ project, count: row?.likes ?? 1 });
  } catch {
    return Response.json({ error: "Like storage unavailable." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const project = await readProject(request);
  if (!project) {
    return Response.json({ error: "Unknown project." }, { status: 400 });
  }

  try {
    await ensureTable();
    const row = await env.DB.prepare(
      `INSERT INTO project_likes (project_key, likes, updated_at)
       VALUES (?, 0, CURRENT_TIMESTAMP)
       ON CONFLICT(project_key) DO UPDATE SET
         likes = CASE WHEN project_likes.likes > 0 THEN project_likes.likes - 1 ELSE 0 END,
         updated_at = CURRENT_TIMESTAMP
       RETURNING likes`,
    )
      .bind(project)
      .first<{ likes: number }>();
    return Response.json({ project, count: row?.likes ?? 0 });
  } catch {
    return Response.json({ error: "Like storage unavailable." }, { status: 503 });
  }
}
