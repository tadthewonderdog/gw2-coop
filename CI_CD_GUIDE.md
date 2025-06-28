# CI/CD Pipeline Guide

This guide explains how to use the CI/CD pipeline for the GW2 Coop project.

## Overview

The project uses GitHub Actions for continuous integration and deployment with the following workflows:

- **CI** (`ci.yml`): Main continuous integration pipeline
- **Deploy** (`deploy.yml`): GitHub Pages deployment
- **Performance** (`performance.yml`): Bundle size and performance monitoring
- **Dependency Review** (`dependency-review.yml`): Security vulnerability scanning
- **Release** (`release.yml`): Automated releases

## How It Works

### 1. **On Every Push/PR**

When you push code or create a pull request, the following happens automatically:

1. **Security Scan**: Checks for vulnerabilities in dependencies
2. **Linting**: Runs ESLint and Prettier checks
3. **Type Checking**: Validates TypeScript types
4. **Testing**: Runs unit tests with coverage reporting
5. **Build**: Creates production build artifacts
6. **Performance Analysis**: Analyzes bundle size and performance

### 2. **On Main Branch Push**

When code is merged to the main branch:

1. All CI checks run
2. If successful, the app is deployed to GitHub Pages
3. Performance metrics are recorded

### 3. **On Pull Requests**

For pull requests:

1. All CI checks run
2. A preview deployment is created (if enabled)
3. Performance analysis comments on the PR
4. Security review is performed

## Using the Pipeline

### For Developers

#### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to GitHub**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

#### What Happens Next

- ✅ **Automatic Checks**: The CI pipeline runs automatically
- 📊 **Performance Report**: Bundle size analysis is posted to your PR
- 🔒 **Security Review**: Dependencies are scanned for vulnerabilities
- 🚀 **Preview Deployment**: A live preview is created (if configured)

#### Review Process

1. **Check the Actions tab** to see all pipeline results
2. **Review performance comments** on your PR
3. **Address any issues** if checks fail
4. **Request review** from team members
5. **Merge when approved**

### For Maintainers

#### Managing Deployments

The pipeline automatically handles deployments:

- **Preview**: Available for every PR
- **Production**: Deployed from main branch to GitHub Pages

#### Monitoring

- **Actions Tab**: View all workflow runs
- **Environments**: Monitor deployment status
- **Security**: Review vulnerability reports

#### Manual Actions

You can manually trigger workflows:

1. Go to **Actions** tab
2. Select the workflow (e.g., "CI")
3. Click **"Run workflow"**
4. Choose branch and options

## Configuration

### Environment Variables

The following secrets can be configured in repository settings:

- `DEPLOY_API_KEY`: For external deployments
- `CODECOV_TOKEN`: For coverage reporting

### Branch Protection

Recommended branch protection rules:

- Require status checks to pass
- Require PR reviews
- Require up-to-date branches
- Restrict pushes to main branch

## Troubleshooting

### Common Issues

#### Build Failures

1. **Check the Actions log** for specific error messages
2. **Run locally** to reproduce: `npm run build`
3. **Check dependencies**: `npm ci` and `npm run build`

#### Test Failures

1. **Run tests locally**: `npm run test`
2. **Check coverage**: `npm run test:coverage`
3. **Update tests** if code changes require it

#### Performance Issues

1. **Check bundle size**: `npm run analyze:bundle`
2. **Review large dependencies**
3. **Consider code splitting**

### Getting Help

1. **Check the Actions logs** for detailed error information
2. **Review this guide** for common solutions
3. **Create an issue** if problems persist

## Best Practices

### Code Quality

- ✅ Write tests for new features
- ✅ Maintain good test coverage (>30%)
- ✅ Follow linting rules
- ✅ Use TypeScript properly

### Performance

- ✅ Monitor bundle size changes
- ✅ Use code splitting for large components
- ✅ Optimize images and assets
- ✅ Review performance reports

### Security

- ✅ Keep dependencies updated
- ✅ Review security alerts
- ✅ Don't commit secrets
- ✅ Use environment variables

### Deployment

- ✅ Test locally before pushing
- ✅ Review preview deployments
- ✅ Monitor production deployments
- ✅ Have rollback plans

## Advanced Usage

### Custom Workflows

You can create custom workflows for specific needs:

1. Create `.github/workflows/your-workflow.yml`
2. Define triggers and jobs
3. Use existing actions or create custom ones

### Local Development

To test the pipeline locally:

```bash
# Install act (GitHub Actions runner)
brew install act

# Run CI workflow locally
act push

# Run specific job
act push -j build
```

### Performance Monitoring

Monitor performance over time:

1. Check bundle size trends
2. Review performance comments on PRs
3. Set up alerts for significant changes
4. Use bundle analyzer for detailed analysis

## Support

For questions or issues with the CI/CD pipeline:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review workflow files in `.github/workflows/`
3. Create an issue with the `ci-cd` label 