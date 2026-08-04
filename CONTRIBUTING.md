# Contributing

Thank you for helping improve Finish Forge Studio. Small, focused changes with
tests and clear engineering assumptions are easiest to review.

## Before opening a change

1. Search existing issues and pull requests.
2. For a large feature, open a proposal before investing substantial work.
3. Never post customer CAD, personal data, confidential specifications,
   export-controlled information, proprietary texture scans or drawings,
   copyrighted standards text, or assets you are not authorized to license.
4. Report security vulnerabilities privately as described in `SECURITY.md`.

## Development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Test imported geometry with synthetic or redistributable fixtures. Avoid adding
binary CAD fixtures unless their provenance and license are documented.

## Pull-request expectations

- Explain the problem, solution, limitations, and validation performed.
- Add or update tests for behavior changes.
- Preserve millimetres as the internal physical unit unless an approved design
  explicitly changes the unit model.
- Label approximate texture data and do not imply official certification.
- Update documentation and third-party notices when dependencies or data change.
- Keep generated output, dependencies, private files, and real customer models
  out of commits.
- Make commits under an identity you are authorized to use.

## Rights and licensing

By submitting a contribution, you represent that you have the right to submit
it and that it does not knowingly violate copyright, patent, trademark, trade
secret, privacy, contract, employment, export-control, or other obligations. You
agree that your contribution is licensed under AGPL-3.0-or-later unless
a clearly identified third-party file carries compatible separate terms.

Do not submit work produced for an employer or client unless you have permission.
Maintainers may request provenance, authorship clarification, or removal of
material where rights are uncertain. No contributor license agreement is
currently required; that policy may change prospectively after public notice.

## Conduct

Participation is subject to `CODE_OF_CONDUCT.md`. Technical disagreement is
welcome; harassment, intimidation, and disclosure of private information are not.
