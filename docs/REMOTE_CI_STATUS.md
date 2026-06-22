# Remote CI Status

## 2026-06-22 远程同步和 CI 首跑

目标：将本地 `main` 分支推送到 GitHub，触发 `.github/workflows/ci.yml` 的首次远程 CI。

结果：远程已同步；首次 CI 已触发但失败，随后已提交修复并准备重跑。

## 当前状态

- 本地分支：`main`
- 远程分支：`origin/main`
- 远程仓库：`https://github.com/wpppc2022/human3.0-.git`
- GitHub CLI 账号：`wpppc2022`
- GitHub CLI scope：已包含 `workflow`
- 最近成功推送：`d6e872e`
- 首次 CI run：`27962391803`
- 首次 CI 结论：失败

## 首次 CI 失败原因

失败步骤：`Install dependencies`

GitHub Actions 日志显示：

```text
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: sharp@0.34.5, unrs-resolver@1.12.2
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

判断：这是 pnpm 11 构建脚本审批配置问题，不是业务代码、测试或 Next.js 构建失败。

## 已处理

- 重新授权 GitHub CLI，补齐 `workflow` scope。
- 成功执行 `git push origin main`，远程 `main` 已同步到 `d6e872e`。
- 修正 `pnpm-workspace.yaml`，明确允许 `sharp` 和 `unrs-resolver` 运行构建脚本。
- 本地重新执行 `pnpm install --frozen-lockfile`，通过。
- 本地重新执行 `pnpm check`，通过：
  - 数据校验通过。
  - 26 个单元测试通过。
  - lint 通过。
  - 生产构建通过。
  - 9 个端到端测试通过。

## 下一步

1. 提交并推送 `pnpm-workspace.yaml` 修复。
2. 观察新的 `CI` workflow run。
3. 如果通过，更新：
   - `docs/RELEASE_1_0.md`
   - `docs/HANDOFF.md`
   - `docs/DEVELOPMENT_LOG.md`
   - `docs/REMOTE_CI_STATUS.md`
4. 如果失败，按 Actions 日志继续修复后重新运行 `pnpm check`。
