import fs from 'fs';
import path from 'path';
import { cyan, red, green, yellow } from './colors';

/**
 * Generates a diff report for LFS files by comparing file states before and after collection.
 * This helps reviewers understand what changed in large files that are stored in Git LFS.
 */

interface FileInfo {
  path: string;
  size: number;
  exists: boolean;
  lastModified?: Date;
  checksum?: string;
}

interface DiffReport {
  timestamp: string;
  summary: {
    totalFiles: number;
    changedFiles: number;
    newFiles: number;
    deletedFiles: number;
    totalSizeChange: number;
  };
  files: Array<{
    path: string;
    status: 'added' | 'modified' | 'deleted' | 'unchanged';
    sizeBefore?: number;
    sizeAfter?: number;
    sizeChange?: number;
    preview?: {
      before?: string;
      after?: string;
      sampleChanges?: string;
    };
  }>;
}

function getFileInfo(filePath: string): FileInfo {
  try {
    const stats = fs.statSync(filePath);
    return {
      path: filePath,
      size: stats.size,
      exists: true,
      lastModified: stats.mtime,
    };
  } catch {
    return {
      path: filePath,
      size: 0,
      exists: false,
    };
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getJsonPreview(filePath: string, maxLines: number = 10): string {
  try {
    if (!fs.existsSync(filePath)) return '';
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    if (lines.length <= maxLines) {
      return content;
    }
    
    return lines.slice(0, maxLines).join('\n') + `\n... (truncated, ${lines.length - maxLines} more lines)`;
  } catch {
    return '[Error reading file]';
  }
}

function compareJsonFiles(beforePath: string, afterPath: string): string {
  try {
    if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) {
      return 'File comparison not available';
    }

    const beforeSize = fs.statSync(beforePath).size;
    const afterSize = fs.statSync(afterPath).size;
    
    // For very large files, just show size comparison
    if (beforeSize > 10 * 1024 * 1024 || afterSize > 10 * 1024 * 1024) { // > 10MB
      return `Size changed from ${formatBytes(beforeSize)} to ${formatBytes(afterSize)}`;
    }

    // For smaller files, show a preview
    const beforePreview = getJsonPreview(beforePath, 5);
    const afterPreview = getJsonPreview(afterPath, 5);
    
    return `Before (first 5 lines):\n${beforePreview}\n\nAfter (first 5 lines):\n${afterPreview}`;
  } catch (error) {
    return `Error comparing files: ${error}`;
  }
}

async function generateDiffReport(beforeDir: string, afterDir: string, outputPath: string) {
  console.log(`${cyan('[lfs-diff]')} Generating LFS diff report...`);
  
  const dataDir = path.join(process.cwd(), 'data');
  const lfsFiles = ['items.g.json', 'npcs.g.json', 'objects.g.json', 'quests.g.json', 'slotStats.g.json'];
  
  const beforeFiles = new Map<string, FileInfo>();
  const afterFiles = new Map<string, FileInfo>();
  
  // Collect file info from before state
  for (const file of lfsFiles) {
    const beforePath = path.join(beforeDir, file);
    beforeFiles.set(file, getFileInfo(beforePath));
  }
  
  // Collect file info from after state (current data directory)
  for (const file of lfsFiles) {
    const afterPath = path.join(dataDir, file);
    afterFiles.set(file, getFileInfo(afterPath));
  }
  
  const report: DiffReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: lfsFiles.length,
      changedFiles: 0,
      newFiles: 0,
      deletedFiles: 0,
      totalSizeChange: 0,
    },
    files: [],
  };
  
  for (const file of lfsFiles) {
    const before = beforeFiles.get(file)!;
    const after = afterFiles.get(file)!;
    
    let status: 'added' | 'modified' | 'deleted' | 'unchanged';
    let sizeChange = 0;
    
    if (!before.exists && after.exists) {
      status = 'added';
      report.summary.newFiles++;
      sizeChange = after.size;
    } else if (before.exists && !after.exists) {
      status = 'deleted';
      report.summary.deletedFiles++;
      sizeChange = -before.size;
    } else if (before.exists && after.exists) {
      sizeChange = after.size - before.size;
      if (sizeChange !== 0) {
        status = 'modified';
        report.summary.changedFiles++;
      } else {
        status = 'unchanged';
      }
    } else {
      status = 'unchanged';
    }
    
    report.summary.totalSizeChange += sizeChange;
    
    const fileReport: any = {
      path: file,
      status,
      sizeBefore: before.exists ? before.size : undefined,
      sizeAfter: after.exists ? after.size : undefined,
      sizeChange: sizeChange !== 0 ? sizeChange : undefined,
    };
    
    // Add preview for changed files
    if (status === 'modified') {
      const beforePath = path.join(beforeDir, file);
      const afterPath = path.join(dataDir, file);
      fileReport.preview = {
        sampleChanges: compareJsonFiles(beforePath, afterPath),
      };
    }
    
    report.files.push(fileReport);
  }
  
  // Write the report
  const reportJson = JSON.stringify(report, null, 2);
  fs.writeFileSync(outputPath, reportJson);
  
  // Also create a human-readable summary
  const summaryPath = outputPath.replace('.json', '.md');
  const summary = generateMarkdownSummary(report);
  fs.writeFileSync(summaryPath, summary);
  
  console.log(`${green('[lfs-diff]')} Generated diff report:`);
  console.log(`${cyan('  JSON:')} ${outputPath}`);
  console.log(`${cyan('  Summary:')} ${summaryPath}`);
  console.log(`${cyan('  Changed files:')} ${report.summary.changedFiles}/${report.summary.totalFiles}`);
  
  if (report.summary.totalSizeChange !== 0) {
    const sign = report.summary.totalSizeChange >= 0 ? '+' : '';
    console.log(`${cyan('  Total size change:')} ${sign}${formatBytes(Math.abs(report.summary.totalSizeChange))}`);
  } else {
    console.log(`${cyan('  Total size change:')} No changes`);
  }
  
  return report;
}

function generateMarkdownSummary(report: DiffReport): string {
  const { summary } = report;
  
  let md = `# LFS Files Diff Report\n\n`;
  md += `**Generated:** ${report.timestamp}\n\n`;
  
  md += `## Summary\n\n`;
  md += `- **Total files:** ${summary.totalFiles}\n`;
  md += `- **Changed files:** ${summary.changedFiles}\n`;
  md += `- **New files:** ${summary.newFiles}\n`;
  md += `- **Deleted files:** ${summary.deletedFiles}\n`;
  md += `- **Total size change:** ${summary.totalSizeChange >= 0 ? '+' : ''}${formatBytes(Math.abs(summary.totalSizeChange))}\n\n`;
  
  md += `## File Changes\n\n`;
  
  for (const file of report.files) {
    if (file.status === 'unchanged') continue;
    
    const statusEmoji = {
      added: '🆕',
      modified: '📝',
      deleted: '🗑️',
      unchanged: '✅'
    }[file.status];
    
    md += `### ${statusEmoji} ${file.path} (${file.status})\n\n`;
    
    if (file.sizeBefore !== undefined) {
      md += `- **Size before:** ${formatBytes(file.sizeBefore)}\n`;
    }
    if (file.sizeAfter !== undefined) {
      md += `- **Size after:** ${formatBytes(file.sizeAfter)}\n`;
    }
    if (file.sizeChange !== undefined) {
      const sign = file.sizeChange >= 0 ? '+' : '';
      md += `- **Size change:** ${sign}${formatBytes(Math.abs(file.sizeChange))}\n`;
    }
    
    if (file.preview?.sampleChanges) {
      md += `\n**Sample changes:**\n\n`;
      md += '```\n';
      md += file.preview.sampleChanges;
      md += '\n```\n';
    }
    
    md += '\n';
  }
  
  if (report.files.every(f => f.status === 'unchanged')) {
    md += '*No files were changed.*\n';
  }
  
  return md;
}

// CLI interface
if (require.main === module) {
  const beforeDir = process.argv[2];
  const outputPath = process.argv[3] || 'lfs-diff-report.json';
  
  if (!beforeDir) {
    console.error(`${red('[lfs-diff]')} Usage: tsx generateLfsDiffReport.ts <before-dir> [output-path]`);
    process.exit(1);
  }
  
  if (!fs.existsSync(beforeDir)) {
    console.error(`${red('[lfs-diff]')} Before directory does not exist: ${beforeDir}`);
    process.exit(1);
  }
  
  generateDiffReport(beforeDir, '', outputPath)
    .then(() => {
      console.log(`${green('[lfs-diff]')} ✅ Diff report generated successfully`);
    })
    .catch((error) => {
      console.error(`${red('[lfs-diff]')} ❌ Error generating diff report:`, error);
      process.exit(1);
    });
}

export { generateDiffReport, type DiffReport };