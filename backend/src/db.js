import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.resolve("./backend/data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "flipscout.db");
const db = new Database(dbPath);

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JSON from database.", { error, json });
    return fallback;
  }
}

db.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    input_text TEXT NOT NULL,
    normalized_json TEXT NOT NULL,
    output_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

export function insertAnalysis({ userId, inputText, normalized, output }) {
  const stmt = db.prepare(
    `INSERT INTO analyses (user_id, input_text, normalized_json, output_json, created_at)
     VALUES (@userId, @inputText, @normalized, @output, @createdAt)`
  );
  const result = stmt.run({
    userId,
    inputText,
    normalized: JSON.stringify(normalized),
    output: JSON.stringify(output),
    createdAt: new Date().toISOString()
  });
  return result.lastInsertRowid;
}

export function listAnalyses({ userId, limit }) {
  const stmt = db.prepare(
    `SELECT * FROM analyses WHERE user_id = ? ORDER BY id DESC LIMIT ?`
  );
  return stmt.all(userId, limit).reduce((accumulator, row) => {
    const normalized = safeParse(row.normalized_json, null);
    const output = safeParse(row.output_json, null);
    if (normalized === null || output === null) {
      return accumulator;
    }
    accumulator.push({
      id: row.id,
      userId: row.user_id,
      inputText: row.input_text,
      normalized,
      output,
      createdAt: row.created_at
    });
    return accumulator;
  }, []);
}

export function getAnalysis(id) {
  const stmt = db.prepare(`SELECT * FROM analyses WHERE id = ?`);
  const row = stmt.get(id);
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    userId: row.user_id,
    inputText: row.input_text,
    normalized: safeParse(row.normalized_json, null),
    output: safeParse(row.output_json, null),
    createdAt: row.created_at
  };
}

export default db;
