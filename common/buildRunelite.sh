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
elif git apply --reverse --check build.gradle.kts.patch; then
  echo "build.gradle.kts.patch already applied."
else
  echo "build.gradle.kts.patch cannot be applied." >&2
  exit 1
fi

# Build with Gradle
cd ..
# Use Gradle's distribution host directly to avoid the services redirect.
sed -i 's/services.gradle.org/downloads.gradle.org/g' gradle/wrapper/gradle-wrapper.properties
# Cache compilation does not need Gradle's bundled sources and documentation.
sed -i 's/-all\.zip/-bin.zip/g' gradle/wrapper/gradle-wrapper.properties
# The wrapper reads this property from its file, not a Gradle JVM system property.
sed -i '/^networkTimeout=/d' gradle/wrapper/gradle-wrapper.properties
printf '\nnetworkTimeout=120000\n' >> gradle/wrapper/gradle-wrapper.properties

# Allow slow distribution downloads and retry transient download/build failures.
for attempt in 1 2 3; do
  if ./gradlew :cache:shadowJar -x test --dependency-verification=off; then
    break
  fi
  if [ "$attempt" -eq 3 ]; then
    echo "RuneLite build failed after 3 attempts." >&2
    exit 1
  fi
  echo "RuneLite build failed; retrying in $((attempt * 5)) seconds..." >&2
  sleep "$((attempt * 5))"
done

# Copy jar to root directory
cd ..
JAR_PATH=$(find runelite/cache/build/libs -name "*-all.jar" | head -n 1)
if [ -z "$JAR_PATH" ]; then
  echo "Could not find built jar file." >&2
  exit 1
fi
cp "$JAR_PATH" ./cache.jar

echo "Runelite built and cache.jar copied to root directory."
