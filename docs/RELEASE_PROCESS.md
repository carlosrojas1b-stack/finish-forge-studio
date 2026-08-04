# Release process

1. Freeze intended changes and update the version and changelog.
2. Install from the committed lockfile, then test and build in a clean checkout.
3. Complete the automated, manual, physical-assumption, security, and license
   checks in `VALIDATION_AND_TESTING.md`.
4. Build the Windows package from `dist/` plus the packaging launchers.
5. Add root legal files and the complete `licenses/` directory to the package.
6. Verify the archive on a separate Windows account or machine.
7. Create a signed or clearly attributable Git tag where practical.
8. Publish checksums with the GitHub release and retain the source for that tag.
9. Describe known limitations and breaking changes in release notes.
10. Monitor reports and withdraw or supersede a release if a serious defect is
    confirmed.

Do not label a release production-ready, certified, or standards-compliant
without evidence supporting that exact claim.

