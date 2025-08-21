#!/bin/bash
set -e

# Script to backup LFS files before running collect
# This is used to generate diff reports for the collect GitHub action

BACKUP_DIR="${1:-/tmp/lfs-backup-before}"
DATA_DIR="./data"

echo "🔍 [lfs-backup] Backing up LFS files to: $BACKUP_DIR"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# List of LFS files to backup
LFS_FILES=(
  "items.g.json"
  "npcs.g.json"
  "objects.g.json"
  "quests.g.json"
  "slotStats.g.json"
)

# Backup each file if it exists
for file in "${LFS_FILES[@]}"; do
  if [ -f "$DATA_DIR/$file" ]; then
    echo "📁 [lfs-backup] Backing up: $file"
    cp "$DATA_DIR/$file" "$BACKUP_DIR/$file"
  else
    echo "⚠️  [lfs-backup] File not found: $file (will be treated as new file)"
  fi
done

echo "✅ [lfs-backup] Backup complete"