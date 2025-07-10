#!/bin/bash
mkdir -p data
java -jar cache.jar -c ./cache -npcs ./data/npcs
npx tsx scripts/concatenateJsonFiles.ts npcs
rm -fr ./data/npcs
