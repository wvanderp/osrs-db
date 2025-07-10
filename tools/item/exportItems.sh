#!/bin/bash
mkdir -p data
java -jar cache.jar -c ./cache -items ./data/items
npx tsx scripts/concatenateJsonFiles.ts items
rm -fr ./data/items
