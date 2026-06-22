# Remote CI Status

## 2026-06-22 远程同步和 CI 首跑

目标：将本地 `main` 分支推送到 GitHub，触发 `.github/workflows/ci.yml` 的首次远程 CI。

结果：远程已同步；首次 CI 已触发并发现配置问题，修复后新的 CI 已通过。

## 当前状态

- 本地分支：`main`
- 远程分支：`origin/main`
- 远程仓库：`https://github.com/wpppc2022/human3.0-.git`
- GitHub CLI 账号：`wpppc2022`
- GitHub CLI scope：已包含 `workflow`
- 最近成功推送：`cd8895b`
- 首次 CI run：`27962391803`
- 首次 CI 结论：失败
- 修复后 CI run：`27962665991`
- 修复后 CI 结论：通过

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
- 修正并推送 `pnpm-workspace.yaml`，明确允许 `sharp` 和 `unrs-resolver` 运行构建脚本。
- 本地重新执行 `pnpm install --frozen-lockfile`，通过。
- 本地重新执行 `pnpm check`，通过：
  - 数据校验通过。
  - 26 个单元测试通过。
  - lint 通过。
  - 生产构建通过。
  - 9 个端到端测试通过。
- GitHub Actions 修复后远程 CI 通过，执行内容包括：
  - `pnpm install --frozen-lockfile`
  - Playwright Chromium 安装
  - `pnpm check`

## 下一步

1. 继续按 `docs/USER_FEEDBACK_PLAN.md` 完成 3 到 5 位真实用户反馈。
2. 继续按 `docs/MOBILE_QA_CHECKLIST.md` 完成真实 iPhone Safari 和 Android Chrome 验收。
3. 若后续 CI 因 GitHub runner 环境变化失败，优先查看 Actions 日志并本地运行 `pnpm check` 复现。
