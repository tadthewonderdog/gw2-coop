# Cloudflare Workers Migration TODO

## Overview
Migrating from GitHub Pages to Cloudflare Workers for both preview and production deployments.

## ✅ Completed Tasks

### Phase 1: Worker Enhancement
- [x] **Enhanced worker to serve React app** - Updated `worker/index.ts` to serve the React application
- [x] **Added SPA routing support** - Configured fallback to index.html for client-side routing
- [x] **Added CORS support** - Enabled CORS for API routes
- [x] **Simplified worker approach** - Using wrangler's built-in static asset serving

### Phase 2: Wrangler Configuration
- [x] **Updated main wrangler config** - Configured `wrangler.jsonc` with proper asset handling
- [x] **Created preview config** - Added `wrangler.preview.jsonc` for PR deployments
- [x] **Created production config** - Added `wrangler.prod.jsonc` for main branch deployments
- [x] **Configured asset serving** - Set up proper static asset serving from `dist/client/`

### Phase 3: CI/CD Pipeline
- [x] **Updated preview deployment** - Replaced GitHub Pages with Cloudflare Workers deployment
- [x] **Updated production deployment** - Replaced placeholder with Cloudflare Workers deployment
- [x] **Added deployment scripts** - Added `deploy:preview` and `deploy:prod` npm scripts
- [x] **Configured wrangler action** - Used official `cloudflare/wrangler-action@v3`

## 🔄 In Progress Tasks

### Phase 3: CI/CD Pipeline (Continued)
- [ ] **Add Cloudflare secrets to GitHub** - Set up `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`
- [ ] **Test deployment pipeline** - Verify both preview and production deployments work
- [ ] **Add preview URL generation** - Generate and output preview URLs for PRs

## 📋 Remaining Tasks

### Phase 4: Advanced Features
- [x] **Add custom preview domains** - Configured PR-based subdomains (pr*.wonderdog.win)
- [ ] **Add preview cleanup** - Implement automatic cleanup of old preview deployments
- [ ] **Add health checks** - Implement deployment health verification
- [ ] **Add rollback capability** - Implement deployment rollback functionality
- [ ] **Optimize caching** - Configure proper caching strategies for static assets and API responses
- [ ] **Add environment variables** - Configure any needed env vars for different environments

### Phase 5: Testing & Validation
- [x] **Test local build** - Verified build process works with new configuration
- [x] **Test local deployment** - Verified `wrangler deploy` works with new configuration
- [x] **Test preview deployment** - Successfully deployed to preview environment
- [x] **Test production deployment** - Successfully deployed to production environment
- [x] **Test API endpoints** - Verified `/api/hello` endpoint works in deployed environment
- [x] **Test SPA routing** - Verified React app is being served correctly

### Phase 6: Documentation & Cleanup
- [ ] **Update README** - Document the new deployment process
- [ ] **Add deployment troubleshooting** - Document common issues and solutions
- [ ] **Remove GitHub Pages config** - Clean up any remaining GitHub Pages configuration
- [ ] **Update environment documentation** - Document the different environments and their purposes

## 🔧 Configuration Files

### Created/Modified Files:
- `worker/index.ts` - Enhanced worker with SPA routing and API support
- `wrangler.jsonc` - Main wrangler configuration
- `wrangler.preview.jsonc` - Preview environment configuration
- `wrangler.prod.jsonc` - Production environment configuration
- `.github/workflows/ci.yml` - Updated CI/CD pipeline
- `package.json` - Added deployment scripts

### Required GitHub Secrets:
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Workers permissions

## 🚀 Next Steps

1. **Set up GitHub secrets** - Add the required Cloudflare credentials to GitHub repository secrets
2. **Test local deployment** - Run `npm run deploy:preview` and `npm run deploy:prod` locally
3. **Create test PR** - Create a pull request to test the preview deployment
4. **Monitor deployment** - Check that the deployment pipeline works correctly
5. **Verify functionality** - Test the deployed application and API endpoints

## 📝 Notes

- The worker is configured to serve static assets from `dist/client/` directory
- SPA routing is handled by serving `index.html` for all non-asset routes
- API routes are handled by the worker and run before static asset serving
- Preview deployments use a separate worker name to avoid conflicts
- Production deployments use the main domain `www.wonderdog.win`
- Preview deployments configured to use custom subdomains: `pr{PR_NUMBER}.wonderdog.win`
- **Note**: Custom domain setup may require DNS configuration in Cloudflare dashboard 