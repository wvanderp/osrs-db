#!/bin/bash
set -e

# Ensure Node.js and npm are installed
if ! command -v node >/dev/null 2>&1; then
	echo "Node.js is not installed. Please install Node.js." >&2
	exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
	echo "npm is not installed. Please install npm." >&2
	exit 1
fi

# Install npm dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
	echo "Installing npm dependencies..."
	npm ci || npm install
fi

# Ensure Java is installed
if ! command -v java >/dev/null 2>&1; then
	echo "Java is not installed. Please install Java." >&2
	exit 1
fi

# Download cache.jar if not present
if [ ! -f "cache.jar" ]; then
	echo "Downloading cache.jar..."
	./scripts/downloadCacheJar.sh
fi

# Download cache if not present
if [ ! -d "cache" ]; then
	echo "Downloading cache..."
	./scripts/buildRuneliteAndDownloadCache.sh
fi

mkdir -p data
java -jar cache.jar -c ./cache -items ./data/items
npx tsx scripts/concatenateJsonFiles.ts items
rm -fr ./data/items
