#!/usr/bin/env node

const { readFileSync } = require("fs");
const { resolve } = require("path");

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
 * Extract hash from chunk name or id
 */
function extractHash(chunk) {
  if (chunk.hash) {
    return chunk.hash.substring(0, 8); // Use first 8 chars of hash
  }
  // Try to extract hash from names
  if (chunk.names && chunk.names.length > 0) {
    for (const name of chunk.names) {
      const hashMatch = name.match(/-([a-f0-9]{8,})/i);
      if (hashMatch) {
        return hashMatch[1].substring(0, 8);
      }
    }
  }
  return null;
}

/**
 * Get chunk identifier for comparison (hash-agnostic)
 * This is used as the key for matching chunks between builds
 */
function getChunkComparisonKey(chunk) {
  // Check for special chunks first
  if (chunk.names) {
    for (const name of chunk.names) {
      // Framework chunk
      if (name === "framework" || name.includes("framework")) {
        return "framework";
      }
      // Main chunk
      if (name === "main" || name === "main-app") {
        return "main";
      }
      // _app chunk
      if (name.includes("_app") || name.includes("pages/_app")) {
        return "pages/_app";
      }
      // Route-based chunks (app/page, app/layout, etc.)
      if (
        name.includes("/") &&
        (name.includes("page") || name.includes("layout"))
      ) {
        return name;
      }
    }
  }

  // For hash-based chunks, use a normalized identifier
  // Extract meaningful part before hash
  if (chunk.names && chunk.names.length > 0) {
    for (const name of chunk.names) {
      // Remove hash from name (e.g., "3089687a-03731747c5ce8eee" -> "3089687a")
      const withoutHash = name.replace(/-[a-f0-9]{8,}$/i, "");
      if (withoutHash && !/^[a-f0-9]{8,}$/i.test(withoutHash)) {
        return withoutHash;
      }
      // If it's just a hash, use the first part
      const hashMatch = name.match(/^([a-f0-9]{8})/i);
      if (hashMatch) {
        return hashMatch[1];
      }
    }
  }

  // Fallback to chunk id
  return `chunk-${chunk.id}`;
}

/**
 * Get display name with hash for chunk
 */
function getChunkDisplayName(chunk) {
  const comparisonKey = getChunkComparisonKey(chunk);
  const hash = extractHash(chunk);

  // For special chunks, keep the name as is
  if (
    comparisonKey === "framework" ||
    comparisonKey === "main" ||
    comparisonKey.startsWith("pages/") ||
    comparisonKey.startsWith("app/")
  ) {
    return comparisonKey;
  }

  // For hash-based chunks, append hash
  if (hash) {
    return `${comparisonKey}-${hash}`;
  }

  return comparisonKey;
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
        // Use comparison key (hash-agnostic) for matching chunks
        const comparisonKey = getChunkComparisonKey(chunk);
        // Use display name (with hash) for showing in results
        const displayName = getChunkDisplayName(chunk);
        const route = getRouteFromChunk(chunk);

        // Use parsedSize if available, otherwise use size
        const size =
          chunk.parsedSize !== undefined ? chunk.parsedSize : chunk.size || 0;

        chunkMap.set(comparisonKey, {
          comparisonKey,
          displayName,
          route,
          size,
          parsedSize: chunk.parsedSize || chunk.size || 0,
          modules: chunk.modules?.length || 0,
          hash: extractHash(chunk),
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

  for (const chunkKey of sortedChunks) {
    const mainChunk = mainStats.get(chunkKey);
    const prChunk = prStats.get(chunkKey);

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

    // Determine display name: prefer route, then displayName with hash, then comparisonKey
    let displayName = chunkKey;

    // For special chunks (framework, main, pages/_app), use the key as-is
    if (
      chunkKey === "framework" ||
      chunkKey === "main" ||
      chunkKey.startsWith("pages/")
    ) {
      displayName = chunkKey;
    } else {
      // For other chunks, prefer route, then displayName with hash
      if (mainChunk) {
        displayName = mainChunk.route || mainChunk.displayName || chunkKey;
      } else if (prChunk) {
        displayName = prChunk.route || prChunk.displayName || chunkKey;
      }

      // For hash-based chunks, show hash from both if different
      if (mainChunk?.hash && prChunk?.hash && mainChunk.hash !== prChunk.hash) {
        displayName = `${chunkKey}-${mainChunk.hash}→${prChunk.hash}`;
      } else if (mainChunk?.hash) {
        displayName = `${chunkKey}-${mainChunk.hash}`;
      } else if (prChunk?.hash) {
        displayName = `${chunkKey}-${prChunk.hash}`;
      }
    }

    comparisons.push({
      name: displayName,
      before,
      after,
      diff,
      diffPercent,
      trend,
    });
  }

  // Separate chunks by category
  const frameworkChunks = [];
  const appChunks = [];
  const pageChunks = [];
  const otherChunks = [];
  const newChunks = [];
  const removedChunks = [];

  for (const comp of comparisons) {
    const name = comp.name.toLowerCase();
    if (name === "framework" || name.includes("framework")) {
      frameworkChunks.push(comp);
    } else if (name === "main" || name === "main-app" || name.startsWith("pages/_app")) {
      appChunks.push(comp);
    } else if (name.startsWith("app/") || name.startsWith("pages/")) {
      pageChunks.push(comp);
    } else if (comp.before === 0 && comp.after > 0) {
      newChunks.push(comp);
    } else if (comp.before > 0 && comp.after === 0) {
      removedChunks.push(comp);
    } else {
      otherChunks.push(comp);
    }
  }

  // Generate markdown with better structure
  let markdown = "## 📦 Bundle Size Comparison\n\n";

  // Summary section
  const totalDiff = totalAfter - totalBefore;
  const totalDiffPercent =
    totalBefore > 0 ? ((totalDiff / totalBefore) * 100).toFixed(2) : "N/A";
  const totalTrend = totalDiff > 0 ? "📈" : totalDiff < 0 ? "📉" : "➡️";
  const totalDiffStr =
    totalDiffPercent !== "N/A"
      ? `${totalDiff > 0 ? "+" : ""}${formatBytes(totalDiff)} (${totalDiffPercent > 0 ? "+" : ""}${totalDiffPercent}%)`
      : "N/A";

  markdown += "### 📊 Summary\n\n";
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| **Total Size** | ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} |\n`;
  markdown += `| **Change** | ${totalDiffStr} ${totalTrend} |\n`;
  if (newChunks.length > 0) {
    markdown += `| **New Chunks** | ${newChunks.length} added |\n`;
  }
  if (removedChunks.length > 0) {
    markdown += `| **Removed Chunks** | ${removedChunks.length} removed |\n`;
  }
  markdown += "\n";

  // Helper function to format diff
  function formatDiff(comp) {
    if (comp.diffPercent === "N/A") {
      if (comp.before === 0 && comp.after > 0) {
        return `**+${formatBytes(comp.diff)}** 🆕`;
      } else if (comp.before > 0 && comp.after === 0) {
        return `**${formatBytes(comp.diff)}** 🗑️`;
      }
      return "N/A";
    }
    const sign = comp.diff > 0 ? "+" : "";
    const percentSign = comp.diffPercent > 0 ? "+" : "";
    return `${sign}${formatBytes(comp.diff)} (${percentSign}${comp.diffPercent}%)`;
  }

  // Core chunks section
  if (frameworkChunks.length > 0 || appChunks.length > 0) {
    markdown += "### 🔧 Core Chunks\n\n";
    markdown += "| Chunk | Before | After | Change |\n";
    markdown += "|-------|--------|-------|--------|\n";
    
    for (const comp of [...frameworkChunks, ...appChunks]) {
      const diffStr = formatDiff(comp);
      markdown += `| **${comp.name}** | ${formatBytes(comp.before)} | ${formatBytes(comp.after)} | ${diffStr} ${comp.trend} |\n`;
    }
    markdown += "\n";
  }

  // Page chunks section
  if (pageChunks.length > 0) {
    markdown += "### 📄 Page Chunks\n\n";
    markdown += "| Route | Before | After | Change |\n";
    markdown += "|-------|--------|-------|--------|\n";
    
    for (const comp of pageChunks) {
      const diffStr = formatDiff(comp);
      markdown += `| \`${comp.name}\` | ${formatBytes(comp.before)} | ${formatBytes(comp.after)} | ${diffStr} ${comp.trend} |\n`;
    }
    markdown += "\n";
  }

  // New chunks section
  if (newChunks.length > 0) {
    markdown += "### 🆕 New Chunks\n\n";
    markdown += "| Chunk | Size |\n";
    markdown += "|-------|------|\n";
    
    for (const comp of newChunks) {
      markdown += `| \`${comp.name}\` | ${formatBytes(comp.after)} |\n`;
    }
    markdown += "\n";
  }

  // Removed chunks section
  if (removedChunks.length > 0) {
    markdown += "### 🗑️ Removed Chunks\n\n";
    markdown += "| Chunk | Previous Size |\n";
    markdown += "|-------|---------------|\n";
    
    for (const comp of removedChunks) {
      markdown += `| \`${comp.name}\` | ${formatBytes(comp.before)} |\n`;
    }
    markdown += "\n";
  }

  // Other chunks section (only if there are significant changes)
  const significantOtherChunks = otherChunks.filter(
    (comp) => comp.diff !== 0 || Math.abs(comp.diffPercent) > 1
  );
  if (significantOtherChunks.length > 0) {
    markdown += "### 📦 Other Chunks\n\n";
    markdown += "| Chunk | Before | After | Change |\n";
    markdown += "|-------|--------|-------|--------|\n";
    
    // Sort by absolute diff (largest changes first)
    significantOtherChunks.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    
    for (const comp of significantOtherChunks) {
      const diffStr = formatDiff(comp);
      markdown += `| \`${comp.name}\` | ${formatBytes(comp.before)} | ${formatBytes(comp.after)} | ${diffStr} ${comp.trend} |\n`;
    }
    markdown += "\n";
  }

  // Total row
  markdown += "---\n\n";
  markdown += `**Total Bundle Size:** ${formatBytes(totalBefore)} → **${formatBytes(totalAfter)}** (${totalDiffStr}) ${totalTrend}\n`;

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
