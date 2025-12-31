#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get chunk identifier from chunk object
 * Uses chunk names if available, otherwise falls back to chunk id
 */
function getChunkIdentifier(chunk) {
  // Try to get meaningful name from chunk.names array
  if (chunk.names && chunk.names.length > 0) {
    // Filter out hash-based names and get meaningful names
    const meaningfulNames = chunk.names.filter(
      (name) => !/^[a-f0-9]{8,}$/i.test(name) && name !== "main"
    );
    if (meaningfulNames.length > 0) {
      return meaningfulNames[0];
    }
    // If only hash names, use the first one
    return chunk.names[0];
  }
  // Fallback to chunk id
  return `chunk-${chunk.id}`;
}

/**
 * Extract route information from chunk if available
 */
function getRouteFromChunk(chunk) {
  // Next.js chunks often have route information in names or modules
  if (chunk.names) {
    for (const name of chunk.names) {
      // Look for page routes (e.g., 'pages/_app', 'app/layout')
      if (
        name.includes("/") &&
        (name.includes("page") || name.includes("layout"))
      ) {
        return name;
      }
    }
  }
  return null;
}

/**
 * Parse stats.json and extract chunk information
 */
function parseStats(statsPath) {
  const statsContent = readFileSync(statsPath, "utf-8");
  const stats = JSON.parse(statsContent);

  const chunkMap = new Map();

  if (stats.chunks) {
    for (const chunk of stats.chunks) {
      // Only process client-side chunks (not server-side)
      if (chunk.initial || chunk.entry) {
        const identifier = getChunkIdentifier(chunk);
        const route = getRouteFromChunk(chunk);
        const displayName = route || identifier;

        // Use parsedSize if available, otherwise use size
        const size =
          chunk.parsedSize !== undefined ? chunk.parsedSize : chunk.size || 0;

        chunkMap.set(displayName, {
          identifier,
          route,
          size,
          parsedSize: chunk.parsedSize || chunk.size || 0,
          modules: chunk.modules?.length || 0,
        });
      }
    }
  }

  return chunkMap;
}

/**
 * Compare two stats.json files and generate markdown table
 */
function compareBundles(mainStatsPath, prStatsPath) {
  const mainStats = parseStats(mainStatsPath);
  const prStats = parseStats(prStatsPath);

  // Get all unique chunk names
  const allChunks = new Set([...mainStats.keys(), ...prStats.keys()]);
  const sortedChunks = Array.from(allChunks).sort();

  // Build comparison data
  const comparisons = [];
  let totalBefore = 0;
  let totalAfter = 0;

  for (const chunkName of sortedChunks) {
    const mainChunk = mainStats.get(chunkName);
    const prChunk = prStats.get(chunkName);

    const before = mainChunk?.parsedSize || 0;
    const after = prChunk?.parsedSize || 0;
    const diff = after - before;
    const diffPercent = before > 0 ? ((diff / before) * 100).toFixed(2) : "N/A";

    totalBefore += before;
    totalAfter += after;

    let trend = "➡️";
    if (diff > 0) {
      trend = "📈";
    } else if (diff < 0) {
      trend = "📉";
    }

    comparisons.push({
      name: chunkName,
      before,
      after,
      diff,
      diffPercent,
      trend,
    });
  }

  // Generate markdown table
  let markdown = "## 📦 Bundle Size Comparison\n\n";
  markdown += "| Route/Chunk | Before | After | Diff | Trend |\n";
  markdown += "|------------|--------|-------|------|-------|\n";

  for (const comp of comparisons) {
    const diffStr =
      comp.diffPercent !== "N/A"
        ? `${comp.diff > 0 ? "+" : ""}${formatBytes(comp.diff)} (${comp.diffPercent > 0 ? "+" : ""}${comp.diffPercent}%)`
        : "N/A";
    markdown += `| ${comp.name} | ${formatBytes(comp.before)} | ${formatBytes(comp.after)} | ${diffStr} | ${comp.trend} |\n`;
  }

  // Add total row
  const totalDiff = totalAfter - totalBefore;
  const totalDiffPercent =
    totalBefore > 0 ? ((totalDiff / totalBefore) * 100).toFixed(2) : "N/A";
  const totalTrend = totalDiff > 0 ? "📈" : totalDiff < 0 ? "📉" : "➡️";
  const totalDiffStr =
    totalDiffPercent !== "N/A"
      ? `${totalDiff > 0 ? "+" : ""}${formatBytes(totalDiff)} (${totalDiffPercent > 0 ? "+" : ""}${totalDiffPercent}%)`
      : "N/A";

  markdown += `| **Total** | **${formatBytes(totalBefore)}** | **${formatBytes(totalAfter)}** | **${totalDiffStr}** | **${totalTrend}** |\n`;

  return markdown;
}

// Main execution
const mainStatsPath = process.argv[2];
const prStatsPath = process.argv[3];

if (!mainStatsPath || !prStatsPath) {
  console.error(
    "Usage: node compare-bundles.js <main-stats.json> <pr-stats.json>"
  );
  process.exit(1);
}

try {
  const result = compareBundles(mainStatsPath, prStatsPath);
  console.log(result);
} catch (error) {
  console.error("Error comparing bundles:", error.message);
  process.exit(1);
}
