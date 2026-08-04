# Maintainer publishing checklist

Complete this before making the repository public. Items marked **owner action**
require information or judgment that cannot safely be guessed.

## Identity and legal review

- [ ] **Owner action:** Confirm `Carlos Rojas` is the correct copyright holder in
  `LICENSE`, `NOTICE`, and `CITATION.cff`; consider employer/client ownership.
- [ ] **Owner action:** Perform a trademark and domain search for “Finish Forge
  Studio”; this package does not claim name clearance or registration.
- [ ] Review `DISCLAIMER.md` with an IP/product-liability lawyer before commercial
  promotion or safety-sensitive use.
- [ ] Verify every included fixture, image, icon, font, preset, and data source is
  redistributable. Do not assume public availability equals permission.
- [ ] Review exact resolved dependency licenses and export-control obligations.

## GitHub settings

- [ ] Create the public repository and upload the package contents at its root.
- [x] Set `.github/CODEOWNERS` to `@carlosrojas1b-stack`.
- [ ] Add a private security contact and enable private vulnerability reporting.
- [ ] Enable branch protection, required CI, dependency graph, Dependabot alerts,
  secret scanning, push protection, and code scanning where available.
- [ ] Add repository description, topics, license detection, and a release URL.
- [ ] Decide whether to enable Discussions and update `SUPPORT.md` accordingly.
- [ ] Review issue forms and moderation contact details.

## Release checks

- [ ] Run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm build`.
- [ ] Complete `docs/VALIDATION_AND_TESTING.md` manual checks.
- [ ] Include `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `DISCLAIMER.md`, and
  the complete `licenses/` directory in every downloadable binary package.
- [ ] Tag the release and update `CHANGELOG.md` and `CITATION.cff`.
- [ ] Confirm the Windows launcher binds only to loopback.

## Donations, later

- [ ] Choose a platform and verify tax, accounting, identity, privacy, refund,
  sanctions, and regional requirements.
- [ ] Uncomment only the appropriate entry in `.github/FUNDING.yml` and replace
  its placeholder with the verified account name.
- [ ] Re-read `DONATIONS.md` and `PRIVACY.md`; disclose sponsorships and update
  README language before accepting funds.
