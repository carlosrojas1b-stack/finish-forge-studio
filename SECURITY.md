# Security policy

## Supported versions

Only the latest release and the current default branch may receive security
fixes. Support is best-effort, not guaranteed. No version should be treated as
certified for handling sensitive, classified, regulated, or export-controlled
CAD.

## Reporting a vulnerability

Use GitHub private vulnerability reporting after the repository owner enables
it under **Settings → Security → Code security and analysis**. If that feature is
not available, use a private contact address published by the repository owner.
Do not open a public issue for an unpatched vulnerability and do not include
third-party confidential files.

Include:

- affected version or commit;
- browser and operating system;
- concise reproduction steps using non-sensitive fixtures;
- impact and threat assumptions;
- suggested mitigation, if known.

Do not access other people's systems or data, degrade services, persist access,
exfiltrate files, demand payment, or publicly disclose before a reasonable
coordinated-resolution period. This policy is not a bug-bounty promise, safe
harbor, waiver of rights, or commitment to compensation.

## User precautions

- Process untrusted STEP and image files in an updated browser and isolated
  environment.
- Keep dependencies updated and review lockfile changes.
- Do not expose the included local static server beyond `127.0.0.1`.
- Do not commit secrets, customer CAD, or payment credentials.
- Review source and network behavior before using sensitive models.
- Retain backups; malformed files can exhaust memory or crash the application.

Security problems in a third-party dependency may need coordination with that
upstream project and remain subject to its disclosure process.

