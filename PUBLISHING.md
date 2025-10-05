# Publishing Guide

This document explains how the osrs-db package is published to npm.

## Overview

The package is automatically published to npm when a new GitHub release is created. The publishing process is handled by a GitHub Actions workflow.

## Versioning

The package uses a semantic versioning scheme: `1.X.cacheNumber`

- `1` - Major version (for breaking API changes)
- `X` - Code version (incremented manually for feature changes)
- `cacheNumber` - Automatically set from the current OSRS cache ID

### Updating the Code Version

To increment the code version (the middle number), manually update the second number in the `version` field in `package.json`. For example:

- Change `1.0.2317` to `1.1.2317` for a minor feature update
- The next publish will use the new code version with the latest cache number

## Automatic Publishing

The publishing workflow is triggered automatically when a new GitHub release is published. It:

1. Checks out the latest code
2. Runs `scripts/update-version.mjs` to update the version based on the current cache number
3. Creates a git tag with the new version (e.g., `v1.0.2317`)
4. Publishes the package to npm
5. Pushes the git tag to the repository

## Manual Publishing

You can also manually trigger the publish workflow:

1. Go to the GitHub Actions tab
2. Select the "Publish to npm" workflow
3. Click "Run workflow"
4. Confirm by clicking "Run workflow" again

## Prerequisites

For the workflow to succeed, you need:

1. An npm account with publish permissions for the `osrs-db` package
2. An npm access token stored as a GitHub secret named `NPM_TOKEN`
   - Go to: Repository Settings → Secrets and variables → Actions → New repository secret
   - Name: `NPM_TOKEN`
   - Value: Your npm access token (from npmjs.com → Access Tokens)

## What Gets Published

Only the following files are included in the npm package:

- `README.md` - Package documentation
- `package.json` - Package metadata
- `data/*.json` - All JSON data files

Source code, tools, and build scripts are excluded from the published package.

## Package Contents

The published package provides wildcard exports for all files in the data directory:

- `osrs-db/items.g.json` - Items data
- `osrs-db/npcs.g.json` - NPCs data
- `osrs-db/objects.g.json` - Objects data
- `osrs-db/quests.g.json` - Quests data
- `osrs-db/slotStats.g.json` - Slot statistics data
- `osrs-db/cache-number.json` - Cache version information

Any file in the `data/` directory can be imported using `osrs-db/[filename]`.

## Testing Before Publishing

To see what would be included in the package:

```bash
npm pack --dry-run
```

To test the version update script:

```bash
npm run update-version
```

## Troubleshooting

### Publishing Fails with "403 Forbidden"

- Check that the `NPM_TOKEN` secret is set correctly
- Verify that the token has publish permissions
- Ensure the npm account has access to publish the package

### Git Tag Already Exists

If a tag already exists for the current version, the workflow will fail. This can happen if:

- The cache number hasn't changed since the last publish
- A previous publish partially completed

To resolve:
1. Either wait for a new cache update
2. Or manually delete the existing tag and re-run the workflow

### Version Not Updating

- Verify that `data/cache-number.json` exists and contains a valid `cacheID`
- Check that the `scripts/update-version.mjs` script runs without errors
