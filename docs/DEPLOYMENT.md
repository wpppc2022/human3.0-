# HUMAN 3.0 Deployment

## Current Release

- Source branch: `release/human-production-20260805`
- Base: `origin/main` at `9a7f3c7dece73c7ad40b164b1fa1146113d8057c`
- Public assessment baseline: `h3-a48-v1`
- Current state: deployed and publicly verified on 2026-08-05.

This branch contains the formal homepage, `/assessment`, `/result`, existing public API routes and the three previously accepted homepage P1 fixes. It does not contain the paused template system or its Debug routes.

## Tencent Cloud Target

The target is the existing Guangzhou Lighthouse server, behind the existing Caddy instance:

- Host: `43.138.157.105`
- Domain: `human.wpppc.cn`
- Active app directory: `/home/ubuntu/human-3-deployment/releases/456c7be`
- Active private app port: `172.18.0.1:3100` on the Docker proxy gateway only
- Active process: independent `human3` systemd service
- Active proxy: a separate Caddy `human.wpppc.cn` site block
- TLS: Caddy automatic HTTPS with a Let's Encrypt certificate for `human.wpppc.cn`, currently valid through 2026-11-03

The existing `wpppc.cn`, `www.wpppc.cn` and `orbit.wpppc.cn` routes remain owned by Orbit. Their Caddy configuration and service must not be replaced or edited as part of HUMAN deployment.

## Verified Deployment Procedure

1. Build only from the pushed release commit, never from a dirty local worktree.
2. Create a versioned release directory under `/home/ubuntu/human-3-deployment/releases/`.
3. Install the locked pnpm dependencies and run `pnpm build` in that directory.
4. Point the independent `human3` service at the release directory and bind Next.js only to the Docker proxy gateway, currently `172.18.0.1:3100`.
5. Add or update only the `human.wpppc.cn` Caddy site block.
6. Configure the certificate for `human.wpppc.cn` without changing Orbit certificates or routes.
7. Add the DNS record for `human` only after the local service and Caddy route pass smoke tests; it currently resolves to `43.138.157.105`.
8. Verify `/`, `/assessment`, `/result`, the public content APIs, 48-question scoring, share encode/decode and PNG/PDF behavior.

Recommended build and start commands:

```bash
corepack enable
corepack prepare pnpm@11.5.3 --activate
pnpm install --frozen-lockfile
pnpm validate:data
pnpm build
pnpm exec next start -H 172.18.0.1 -p 3100
```

`/opt/infrastructure/caddy/Caddyfile` is mounted into the Caddy container read-only. If a change replaces the host file atomically, validate the new file and retain a dated backup before recreating only the `caddy` container; otherwise it may retain the old file inode. This is a short public-traffic reconnection and requires explicit authorization plus Orbit regression checks.

## Production Verification

The following public endpoints returned HTTP 200 after release:

- `https://human.wpppc.cn/`
- `https://human.wpppc.cn/assessment`
- `https://human.wpppc.cn/result`
- `https://human.wpppc.cn/api/content/version`

`https://wpppc.cn/`, `https://www.wpppc.cn/`, and `https://orbit.wpppc.cn/` also returned HTTP 200 after the Caddy update.

## Rollback

1. Stop the `human3` service.
2. Restore the previous `current` release symlink or service working directory.
3. Start the previous release and check it on the private port.
4. Reload only the Caddy configuration after syntax validation.
5. Keep Orbit running and verify `wpppc.cn`, `www.wpppc.cn` and `orbit.wpppc.cn`.

Do not roll back by deleting release directories, Docker volumes or Orbit configuration. Preserve each release directory until the next release is verified.

## Explicit Exclusions

- `app/debug`, `templates`, `components/human3`, `styles/human3-*`
- Template tests, template demo images, `TEMPLATE_GUIDE.md` and `docs/UI_DESIGN_SYSTEM.md`
- `lib/report-pdf 2.ts`
- Dirty Supabase/result-short-link changes, question-bank/P3 changes and unapproved 32-question product routes
- Any change to `data/questions.json`, scoring rules or frozen `h3-result-v1` resources
- Any change to Orbit Caddy routes, Orbit data, 鹿鸣湖 data or server credentials

No secret, token or private key belongs in this repository or this document.
