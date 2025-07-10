#!/bin/bash
mkdir -p data
java -jar cache.jar -c ./cache -objects ./data/objects
npx tsx scripts/concatenateJsonFiles.ts objects
rm -fr ./data/objects
