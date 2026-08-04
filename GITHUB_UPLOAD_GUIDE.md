# GitHub upload guide

## Before upload

Open `docs/MAINTAINER_CHECKLIST.md` and complete the owner-action items. At a
minimum, confirm the copyright holder and review the repository owner in
`.github/CODEOWNERS`. Donations are off until you intentionally edit
`.github/FUNDING.yml`.

## Create the repository in a browser

1. On GitHub, create a new empty repository named `finish-forge-studio`.
2. Choose **Public**. Do not ask GitHub to add a README, license, or `.gitignore`
   because this package already includes them.
3. Extract this package locally and open a terminal in its root.
4. Run the commands GitHub displays for pushing an existing repository, or:

```bash
git init
git add .
git commit -m "Initial open-source release"
git branch -M main
git remote add origin https://github.com/carlosrojas1b-stack/finish-forge-studio.git
git push -u origin main
```

Replace the placeholder URL with your actual account. Review the staged file
list before committing and confirm no customer models, secrets, build outputs,
or private height maps are present.

## Recommended repository settings

1. Enable Issues and, if desired, Discussions.
2. Enable private vulnerability reporting.
3. Enable the dependency graph, Dependabot alerts and updates, secret scanning,
   push protection, and code scanning where available.
4. Protect `main`; require pull requests and the CI checks before merge.
5. Add topics such as `step`, `cad`, `3d-printing`, `resin-printing`, `threejs`,
   and `open-source`.
6. Add a short description without claiming certified texture equivalence.

Suggested description:

> Local-first STEP face texturing for realistic 3D-printed injection-molding prototypes.

## First release

Run the release checks, tag `v0.3.0`, and attach a verified Windows package plus
checksums. Include the legal files and `licenses/` directory in that download.
State clearly that it is experimental prototype software.

## Enabling donations later

Choose and verify a funding platform, review `DONATIONS.md` and `PRIVACY.md`, then
uncomment the matching entry in `.github/FUNDING.yml`. A GitHub Sponsors entry,
for example, should contain your real GitHub Sponsors-enabled username. Do not
collect payment-card or bank information through issues, discussions, or email.
