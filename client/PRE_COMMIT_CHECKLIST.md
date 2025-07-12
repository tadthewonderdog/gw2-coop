# Pre-Commit Checklist

Before checking in code, always run and verify the following:

## [ ] Fresh Install
- [ ] Remove the `node_modules` directory: `rm -rf node_modules`
- [ ] Run `npm install` in the client directory
- [ ] Run `npx playwright install` to download browser binaries for Storybook tests

## [ ] Testing
- [ ] Run all unit tests: `npm run test`
- [ ] Ensure 100% pass rate
- [ ] Run test coverage: `npm run test:coverage`
- [ ] Ensure no unexpected failures (unit tests only, for now)

## [ ] Code Quality
- [ ] Run the linter: `npm run lint`
- [ ] Ensure 0 errors and 0 warnings
- [ ] If any errors or warnings are found, fix them before proceeding

## [ ] Final Check
- [ ] Only check in code when all of the above are clean

## Notes
- The project uses Vite with Tailwind CSS v4 (no PostCSS needed)
- Storybook tests require Playwright browser binaries
- All tests should pass before committing
- Linter should be completely clean (0 errors, 0 warnings) 