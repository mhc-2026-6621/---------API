import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const appRoot = process.cwd();
const serviceRoot = join(appRoot, "..");

describe("template alignment", () => {
  it("keeps service entry documents and implementation roots", () => {
    [
      "README.md",
      "docs/00_サービス概要.md",
      "docs/09_将来拡張計画.md",
      "docs/adr/0001_テンプレート採用.md",
      "docs/design/README.md",
      "app/README.md",
      "app/AGENTS.md",
      "app/.env.example",
      "app/src/app/page.tsx",
      "app/src/app/api/assets/route.ts",
    ].forEach((relativePath) => {
      assert.equal(existsSync(join(serviceRoot, relativePath)), true, `${relativePath} should exist`);
    });
  });

  it("uses port 3001 for local execution scripts", () => {
    const packageJson = JSON.parse(readFileSync(join(appRoot, "package.json"), "utf8"));
    assert.match(packageJson.scripts.dev, /-p 3001/);
    assert.match(packageJson.scripts.start, /-p 3001/);
  });
});