#!/bin/bash
set -e

# This script builds the Runelite cache tools and copies the resulting jar file to the root directory as cache.jar.

# Ensure Java and git are installed
for cmd in java git curl node sha256sum; do
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
# Preserve RuneLite's distribution and matching checksum. Both Gradle hosts can
# redirect to a failing GitHub release page; the asset API bypasses that page.
PROPERTIES=gradle/wrapper/gradle-wrapper.properties
DIST_URL=$(sed -n 's/^distributionUrl=//p' "$PROPERTIES" | tr -d '\r' | sed 's/\\\\:/:/g')
DIST_NAME=${DIST_URL##*/}
DIST_VERSION=${DIST_NAME#gradle-}
DIST_VERSION=${DIST_VERSION%-*}
DIST_TAG=$DIST_VERSION
if [[ "$DIST_VERSION" =~ ^[0-9]+\.[0-9]+$ ]]; then
  DIST_TAG="$DIST_VERSION.0"
fi
DIST_SHA=$(sed -n 's/^distributionSha256Sum=//p' "$PROPERTIES" | tr -d '\r')
if [ -z "$DIST_SHA" ]; then
  echo "RuneLite must pin the Gradle distribution checksum." >&2
  exit 1
fi
DIST_FILE="$PWD/$DIST_NAME"
if ! curl --fail --location --retry 2 --connect-timeout 20 --max-time 300 "$DIST_URL" -o "$DIST_FILE"; then
  echo "Gradle distribution download failed; trying GitHub's release asset API."
  ASSET_URL=$(curl --fail --silent --show-error --retry 2 \
    "https://api.github.com/repos/gradle/gradle-distributions/releases/tags/v$DIST_TAG" \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const a=JSON.parse(s).assets.find(a=>a.name===process.argv[1]);if(!a)process.exit(1);console.log(a.url)})' "$DIST_NAME")
  curl --fail --location --retry 3 --connect-timeout 20 --max-time 300 \
    -H 'Accept: application/octet-stream' "$ASSET_URL" -o "$DIST_FILE"
fi
printf '%s  %s\n' "$DIST_SHA" "$DIST_FILE" | sha256sum --check
# Let the wrapper install the verified local archive normally.
sed -i "s|^distributionUrl=.*|distributionUrl=file\://$DIST_FILE|" "$PROPERTIES"
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
