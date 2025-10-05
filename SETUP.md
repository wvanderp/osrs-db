# Setup Instructions for NPM Publishing

This document provides step-by-step instructions to complete the npm publishing setup.

## 🔑 Required: Set up NPM Token

Before you can publish to npm, you need to create an npm access token and add it to GitHub:

### 1. Create NPM Access Token

1. Log in to [npmjs.com](https://www.npmjs.com)
2. Click on your profile icon → "Access Tokens"
3. Click "Generate New Token" → "Classic Token"
4. Select "Automation" as the token type
5. Copy the generated token (you won't be able to see it again!)

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm access token
6. Click "Add secret"

## 🚀 Publishing the Package

### First Time Setup

Before publishing for the first time, you may need to claim the package name:

1. Make sure you're logged in to npm: `npm login`
2. Run: `npm publish --access public` (from the repository root)
   - Or wait for the GitHub Action to do this automatically

### Automatic Publishing

After the initial setup, the package will be automatically published:

1. Create a new GitHub release (manually or via automation)
2. When the release is published, the "Publish to npm" workflow triggers
3. The workflow:
   - Updates the version based on the cache number
   - Checks if the version is already published
   - Creates a git tag
   - Publishes to npm (if new version)

### Manual Publishing

You can also trigger publishing manually:

1. Go to: **Actions** tab in GitHub
2. Select: "Publish to npm" workflow
3. Click: "Run workflow"
4. Select branch: `main`
5. Click: "Run workflow"

## 📋 Verification

After the first publish, verify it worked:

1. Check npm: https://www.npmjs.com/package/osrs-db
2. Test installation: `npm install osrs-db`
3. Test import in a Node.js project:
   ```javascript
   const items = require('osrs-db/items.g.json');
   console.log(`Items: ${items.length}`);
   ```

## 🔄 Updating the Code Version

The version format is `1.X.cacheNumber` where:
- `1` = Major version (for breaking changes)
- `X` = Code version (for feature updates)
- `cacheNumber` = Auto-updated from cache

To increment the code version (middle number):

1. Edit `package.json`
2. Change version from `1.0.2317` to `1.1.2317` (or whatever is appropriate)
3. Commit and push
4. The next publish will use the new code version with the latest cache number

## ⚠️ Troubleshooting

### "403 Forbidden" Error

- Verify `NPM_TOKEN` is set correctly in GitHub secrets
- Make sure the token hasn't expired
- Ensure you have publish permissions for the package

### "Version already exists" Error

- This is normal if the cache hasn't been updated
- The workflow will automatically skip publishing in this case
- Wait for the next cache update

### Git Tag Conflicts

If a tag already exists:
- The workflow will skip tag creation (this is normal)
- The publish will still proceed if the npm version doesn't exist

## 📞 Support

For issues with:
- NPM publishing: Check [npm documentation](https://docs.npmjs.com/)
- GitHub Actions: Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- This package setup: Review `PUBLISHING.md`
