import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import fetch from "node-fetch";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let AchievementGroupSchema: z.ZodTypeAny,
  AchievementCategorySchema: z.ZodTypeAny,
  AchievementSchema: z.ZodTypeAny;
try {
  ({ AchievementGroupSchema, AchievementCategorySchema, AchievementSchema } = await import(
    "../services/gw2-api.ts"
  ));
} catch (importErr) {
  console.error("[SCRIPT] Failed to import schemas:", importErr);
  process.exit(1);
}

const GW2_API_BASE = "https://api.guildwars2.com/v2";
const VERSION_PARAM = "&v=2024-07-20T01:00:00.000Z";
const BATCH_SIZE = 200;
const OUTPUT_DIR = path.resolve(__dirname, "../../public/data");

const stringArray = z.array(z.string());
const numberArray = z.array(z.number());

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`[SCRIPT] Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function batchFetch(endpoint: string, ids: (string | number)[], schema: z.ZodTypeAny) {
  const results: unknown[] = [];
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const url = `${endpoint}?ids=${batch.join(",")}${VERSION_PARAM}`;
    const data = await fetchJson(url);
    results.push(...(schema.array().parse(data) as unknown[]));
  }
  return results;
}

async function main() {
  try {
    console.log("Fetching achievement group IDs...");
    const groupIds = stringArray.parse(
      await fetchJson(`${GW2_API_BASE}/achievements/groups?v=2024-07-20T01:00:00.000Z`)
    );
    const groups = await batchFetch(
      `${GW2_API_BASE}/achievements/groups`,
      groupIds,
      AchievementGroupSchema
    );
    await fs.writeFile(
      path.join(OUTPUT_DIR, "achievement-groups.json"),
      JSON.stringify(groups, null, 2)
    );
    console.log("Saved achievement-groups.json");

    console.log("Fetching achievement category IDs...");
    const categoryIds = numberArray.parse(
      await fetchJson(`${GW2_API_BASE}/achievements/categories?v=2024-07-20T01:00:00.000Z`)
    );
    const categories = await batchFetch(
      `${GW2_API_BASE}/achievements/categories`,
      categoryIds,
      AchievementCategorySchema
    );
    await fs.writeFile(
      path.join(OUTPUT_DIR, "achievement-categories.json"),
      JSON.stringify(categories, null, 2)
    );
    console.log("Saved achievement-categories.json");

    console.log("Fetching achievement IDs...");
    const achievementIds = numberArray.parse(
      await fetchJson(`${GW2_API_BASE}/achievements?v=2024-07-20T01:00:00.000Z`)
    );
    const achievements = await batchFetch(
      `${GW2_API_BASE}/achievements`,
      achievementIds,
      AchievementSchema
    );
    await fs.writeFile(
      path.join(OUTPUT_DIR, "achievements.json"),
      JSON.stringify(achievements, null, 2)
    );
    console.log("Saved achievements.json");

    console.log("All achievement data fetched and saved successfully.");
  } catch (err) {
    console.error("[SCRIPT] ERROR CAUGHT");
    if (err instanceof Error) {
      console.error("Type:", err.constructor.name);
      console.error("Message:", err.message);
      if (err.stack) console.error("Stack:", err.stack);
    } else {
      try {
        console.error("Raw:", JSON.stringify(err, null, 2));
      } catch {
        console.error("Raw:", err);
      }
    }
    process.exit(1);
  }
}

void main();
