const unavailableDatabase = {
  prepare() {
    throw new Error("D1 is only available in the Sites runtime.");
  },
} as unknown as D1Database;

export const env = {
  DB: unavailableDatabase,
};

// Build-time stand-ins required by the Cloudflare Vite plugin. Static Pages
// output never instantiates these classes.
export class WorkerEntrypoint {}
export class DurableObject {}
export class WorkflowEntrypoint {}
