#!/bin/bash
set -e

# This script builds the Runelite cache tools and copies the resulting jar file to the root directory as cache.jar.

# Ensure Java and git are installed
for cmd in java git; do
  if ! command -v $cmd >/dev/null 2>&1; then
    echo "$cmd is not installed. Please install $cmd." >&2
    exit 1
  fi
done

# Clone Runelite if not present
if [ ! -d "runelite" ]; then
  echo "Cloning Runelite repository..."
  git clone https://github.com/runelite/runelite.git runelite
fi

# Copy build.gradle.kts.patch and apply it
cp build.gradle.kts.patch runelite/cache
cd runelite/cache
if git apply --check build.gradle.kts.patch; then
  git apply build.gradle.kts.patch
else
  echo "build.gradle.kts.patch already applied or cannot be applied. Continuing..."
fi

# Build with Gradle
cd ..
./gradlew :cache:shadowJar -x test --dependency-verification=off

# Copy jar to root directory
cd ..
JAR_PATH=$(find runelite/cache/build/libs -name "*-all.jar" | head -n 1)
if [ -z "$JAR_PATH" ]; then
  echo "Could not find built jar file." >&2
  exit 1
fi
cp "$JAR_PATH" ./cache.jar

echo "Runelite built and cache.jar copied to root directory."
