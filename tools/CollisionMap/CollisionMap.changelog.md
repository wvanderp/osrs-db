# Changelog for CollisionMap Tool

## Unreleased

### 2025-01-04 — @wvanderp — Changed: Switch from Maven to Gradle build system

- Updated `common/buildRunelite.sh` to use Gradle's `shadowJar` task instead of Maven
- Replaced `pom.patch` with `build.gradle.kts.patch` for Runelite's new build configuration
- The patch adds the Shadow plugin for creating fat JARs and sets the main class

## 2025-08-13

- Initial creation of CollisionMap tool, linter, schema, and documentation.
