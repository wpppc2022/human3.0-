# Mobile QA Report

## 2026-06-22 本机移动端自动验收

本报告记录 1.0 候选版在本机生产构建下的移动端浏览器验收结果。它不能替代 iPhone Safari 和 Android Chrome 的真实设备验收，但可以作为发布前的本地证据，证明当前代码在移动视口下核心流程可用。

## 环境

- 服务：`pnpm build` 后使用 `pnpm start --hostname 127.0.0.1 --port 3000`。
- 浏览器：Chromium headless。
- 视口：390 x 844。
- 输入：移动端上下文，touch enabled。
- 证据文件：`output/playwright/mobile-qa/`。
- 最近刷新时间：2026-06-22 23:44，本轮已覆盖 1.0 候选体验打磨后的首页信任提示、答题提示、结果速览和分享入口。

## 覆盖路径

1. 首页 `/`。
2. 答题页 `/assessment`。
3. 选择答案后进入下一题。
4. 返回上一题，确认答案仍被选中。
5. 刷新页面，确认答题进度和答案恢复。
6. 完成 48 道题。
7. 进入结果页 `/result`。
8. 确认结果页不展示原始分数。
9. 确认结果页顶部展示“主导象限”“主要限制”“先做这一步”。
10. 确认分享区域展示“保存或分享结果”。
11. 点击下载 PNG，确认生成 `human-3-result-3.3.png`。
12. 打开静态分享链接 `/result/share?a=...`，确认可重建结果页。

## 布局结果

| 页面 | 截图 | 视口宽度 | scrollWidth | 横向溢出 |
| --- | --- | --- | --- | --- |
| 首页 | `output/playwright/mobile-qa/01-home-mobile.png` | 390 | 390 | 0 |
| 答题页 | `output/playwright/mobile-qa/02-assessment-mobile-selected.png` | 390 | 390 | 0 |
| 结果页 | `output/playwright/mobile-qa/03-result-mobile.png` | 390 | 390 | 0 |
| 分享结果页 | `output/playwright/mobile-qa/04-share-mobile.png` | 390 | 390 | 0 |

## 结论

- 本机移动端 Chromium 验收通过。
- 首页、答题页、结果页和分享结果页没有横向溢出。
- 上一题和刷新恢复均正常。
- 完整 48 题流程可完成。
- 结果页不展示原始分数。
- 结果页顶部速览可见。
- 分享入口标题和按钮可见。
- PNG 分享卡片可生成下载。
- 静态分享链接可重建结果。

## 仍需确认

1. 真实 iPhone Safari。
2. 真实 Android Chrome。
3. 移动端浏览器下载 PNG 的实际系统行为。
4. 分享卡片在微信、朋友圈、小红书或社群中的实际展示效果。
