# Pre-Commit Checklist

Before checking in code, always run and verify the following:

## Fresh Install
We need to:
- Remove the "node_modules" directory
- Install npm packages
- Install playwright to download browser binaries for Storybook tests
Just run the single command to do all of it:
`rm -rf node_modules && npm install && npx playwright install`

## Testing
- [ ] Run all unit tests: `npm run test`
- [ ] Ensure 100% pass rate
- [ ] Run test coverage: `npm run test:coverage`
- [ ] Ensure no unexpected failures

## Code Quality
- [ ] Run the linter: `npm run lint`
- [ ] Ensure 0 errors and 0 warnings
- [ ] If any errors or warnings are found, fix them before proceeding

## Final Check
[] Only check in code when all of the above are clean

## Notes
- Storybook tests require Playwright browser binaries
- All tests should pass before committing
- Linter should be completely clean (0 errors, 0 warnings) 