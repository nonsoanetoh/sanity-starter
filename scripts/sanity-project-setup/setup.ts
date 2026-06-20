#!/usr/bin/env tsx
import { execSync } from "node:child_process";
/**
 * Project setup helper — validates env, optionally imports seed, prints next steps.
 * Usage: pnpm sanity:project-setup [--import-seed]
 */
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const EXAMPLE_PATH = path.join(ROOT, ".env.example");

const REQUIRED_PUBLIC = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "NEXT_PUBLIC_URL",
] as const;

const RECOMMENDED = [
  "SANITY_API_VIEW_TOKEN",
  "SANITY_API_EDIT_TOKEN",
  "SANITY_REVALIDATE_SECRET",
] as const;

function loadEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};
  const lines = readFileSync(filePath, "utf8").split("\n");
  const env: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function resolveEnv(key: string, env: Record<string, string | undefined>): string | undefined {
  if (env[key]) return env[key];
  const fallbacks: Record<string, string> = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: "SANITY_STUDIO_PROJECT_ID",
    NEXT_PUBLIC_SANITY_DATASET: "SANITY_STUDIO_DATASET",
    SANITY_API_VIEW_TOKEN: "SANITY_API_READ_TOKEN",
  };
  const fallback = fallbacks[key];
  return fallback ? env[fallback] : undefined;
}

function printSection(title: string) {
  console.log(`\n${title}`);
  console.log("─".repeat(title.length));
}

async function main() {
  console.log("ACTTA Studio Sanity Starter — project setup\n");

  if (!existsSync(ENV_PATH)) {
    if (existsSync(EXAMPLE_PATH)) {
      copyFileSync(EXAMPLE_PATH, ENV_PATH);
      console.log("✓ Created .env.local from .env.example");
    } else {
      console.error("✗ No .env.local or .env.example found");
      process.exit(1);
    }
  }

  const env = { ...loadEnvFile(ENV_PATH), ...process.env };

  printSection("Environment check");

  const missingRequired = REQUIRED_PUBLIC.filter((key) => !resolveEnv(key, env));
  if (missingRequired.length) {
    console.log("Missing required variables in .env.local:");
    for (const k of missingRequired) console.log(`  • ${k}`);
    console.log("\nGet your project ID at https://sanity.io/manage");
  } else {
    console.log(`✓ Project: ${resolveEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", env)}`);
    console.log(`✓ Dataset: ${resolveEnv("NEXT_PUBLIC_SANITY_DATASET", env) ?? "production"}`);
    console.log(`✓ URL:     ${resolveEnv("NEXT_PUBLIC_URL", env) ?? "http://localhost:3000"}`);
  }

  const missingRecommended = RECOMMENDED.filter((key) => !resolveEnv(key, env));
  if (missingRecommended.length) {
    console.log("\nRecommended (not set yet):");
    for (const k of missingRecommended) console.log(`  • ${k}`);
  }

  if (process.argv.includes("--import-seed")) {
    printSection("Importing seed data");
    execSync("pnpm sanity:dataset-import", { stdio: "inherit", env: process.env, cwd: ROOT });
  }

  printSection("Next steps");
  console.log("1. Fill in .env.local (see .env.example)");
  console.log("2. pnpm dev          → site at / and Studio at /studio");
  console.log("3. pnpm sanity:dataset-import  → load homepage + sample content");
  console.log("4. Create API token (Viewer) → SANITY_API_VIEW_TOKEN for draft preview");
  console.log("5. Create API token (Editor) → SANITY_API_EDIT_TOKEN for contact forms");
  console.log("6. Add webhook → POST /api/revalidate with SANITY_REVALIDATE_SECRET");
  console.log("\nDocs: docs/getting-started.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
