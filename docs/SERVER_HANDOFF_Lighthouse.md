# Lighthouse Server Handoff

Last checked: 2026-08-05

This document is the first-read map for any agent operating the shared Tencent Cloud Lighthouse server. Read it before changing a process, Docker service, Caddy configuration or DNS record.

## Server

- Provider: Tencent Cloud Lighthouse
- Region: Guangzhou
- Public IPv4: `43.138.157.105`
- Existing domains: `wpppc.cn`, `www.wpppc.cn`, `orbit.wpppc.cn`
- HUMAN domain: `human.wpppc.cn` is publicly active and remains isolated from Orbit.

The host is shared. Resource pressure or a proxy mistake can affect Orbit, so all changes must be scoped to the named service or the `human.wpppc.cn` virtual host.

## Service Map

| Service | State after 2026-08-05 handoff | Role | Protection |
| --- | --- | --- | --- |
| `caddy` | running | Existing HTTPS reverse proxy for Orbit | Do not replace the global config or Orbit site blocks |
| `portainer` | running | Docker administration UI | Do not remove or reconfigure without a separate task |
| `luminghu-platform-browser` | paused, restart policy `no` | 鹿鸣湖 browser automation asset | Do not start automatically; preserve profile and volume |
| `luminghu-listener` | stopped, restart policy `no` | 鹿鸣湖 listener, previously read-only preflight | Do not start or connect to external platforms |
| `human3` | running, enabled | HUMAN 3.0 Next.js service | Independent directory, private gateway port and dedicated Caddy site block |

The browser container was the largest resource consumer. It was paused to make room for HUMAN deployment; its container, image, volume, profile and data were not deleted. The listener was already stopped and remains paused.

## Important Paths

- Orbit/Caddy infrastructure: `/opt/infrastructure/caddy/`
- HUMAN deployment root: `/home/ubuntu/human-3-deployment/`
- HUMAN release directories: `/home/ubuntu/human-3-deployment/releases/`
- Server handoff copies: `/home/ubuntu/SERVER_HANDOFF.md` and `/home/ubuntu/SERVER_HANDOFF.history/`
- 鹿鸣湖 listener readme: `/home/ubuntu/luminghu-listener/README.md`
- 鹿鸣湖 browser compose: `/home/ubuntu/luminghu-browser/`

Do not store repository credentials, API keys or certificates in these handoff files. Use the server's normal secret store or an explicitly approved environment mechanism.

## HUMAN Isolation Contract

HUMAN must use:

- a versioned release directory;
- a separate `human3` process;
- private bind `172.18.0.1:3100` on the Docker proxy gateway only;
- only the `human.wpppc.cn` Caddy site block;
- a separate access/error log and health/smoke checklist;
- a reversible `current` release pointer.

Never bind HUMAN directly to ports 80 or 443. Caddy owns those ports.

## Safe Checks

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker stats --no-stream
sudo ss -ltnp
sudo docker run --rm -v /opt/infrastructure/caddy/Caddyfile:/etc/caddy/Caddyfile:ro caddy:2.10-alpine caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
curl -I https://wpppc.cn
curl -I https://www.wpppc.cn
curl -I https://orbit.wpppc.cn
curl -I https://human.wpppc.cn
```

Before and after any HUMAN change, record the status of Caddy, Orbit domains, the `human3` process, memory, swap and disk. If an Orbit check changes from healthy to unhealthy, stop the HUMAN change and restore the previous HUMAN release.

## Forbidden Actions

- Do not stop, recreate or upgrade `caddy`, `portainer` or Orbit services for a HUMAN release unless an explicitly authorized, validated Caddy configuration change requires recreating only `caddy`.
- Do not start the paused 鹿鸣湖 browser or listener as part of a HUMAN deployment.
- Do not deploy from a dirty local worktree or from an unreviewed branch.
- Do not alter `@`, `www` or `orbit` DNS records while adding `human`.
- Do not edit DNS or certificates without an explicit deployment task.
- Do not delete Docker volumes, browser profiles, release directories or handoff history.
- Do not expose server tokens, SSH material or Supabase service keys in logs or documents.

## Active HUMAN Release

- Branch and commit: `release/human-production-20260805` at `456c7be`.
- Release root: `/home/ubuntu/human-3-deployment/releases/456c7be`; active pointer: `/home/ubuntu/human-3-deployment/current`.
- Service: `human3.service`, enabled in systemd.
- Public route: `https://human.wpppc.cn`, Caddy automatic HTTPS, Let's Encrypt certificate valid through 2026-11-03.
- Publicly verified routes: `/`, `/assessment`, `/result`, and `/api/content/version` all returned HTTP 200.
- Server-side release metadata: `/home/ubuntu/human-3-deployment/RELEASE.md`; continuously maintained operational handoff: `/home/ubuntu/SERVER_HANDOFF.md`.
