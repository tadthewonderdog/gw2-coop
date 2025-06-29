import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { describe, it, expect, afterAll } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, "../scripts/fetch-gw2-achievement-data.ts");
const outputDir = path.resolve(__dirname, "../../public/data");

const files = ["achievement-categories.json", "achievement-groups.json", "achievements.json"];

describe.skip("fetch-gw2-achievement-data integration", () => {
  it("should run the script and produce valid JSON files", async () => {
    // Run the script using node
    await new Promise((resolve, reject) => {
      exec(
        `node --loader ts-node/esm --require tsconfig-paths/register ${scriptPath}`,
        { env: { ...process.env, VITE_USE_GW2_CACHE: "false" } },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(stderr || stdout || error.message));
          } else {
            resolve(undefined);
          }
        }
      );
    });

    // Check that each file exists and contains valid JSON
    for (const file of files) {
      const filePath = path.join(outputDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
    }
  }, 120_000); // Allow up to 2 minutes for network

  afterAll(async () => {
    // Optionally clean up files after test
    for (const file of files) {
      const filePath = path.join(outputDir, file);
      try {
        await fs.unlink(filePath);
      } catch {
        // File may not exist, ignore
      }
    }
  });
});
