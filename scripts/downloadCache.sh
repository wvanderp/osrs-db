#!/bin/bash
# This script downloads the newest OSRS cache using the getNewestCache.ts script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

npx ts-node scripts/getNewestCache.ts
