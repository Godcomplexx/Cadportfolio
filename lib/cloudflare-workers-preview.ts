const unavailableDatabase = {
  prepare() {
    throw new Error("D1 is only available in the Sites runtime.");
  },
} as unknown as D1Database;

export const env = {
  DB: unavailableDatabase,
};
