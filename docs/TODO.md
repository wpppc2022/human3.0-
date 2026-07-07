# TODO

说明：产品方向、功能状态和需求池以 `docs/PRD.md` 为准；本文件只记录下一步执行任务。

## 版本兼容前置门槛

- [x] 产品、内容、模型已共同审阅并签署 `docs/QUESTION_BANK_32_CONTENT_SPEC.md` 与 `docs/ASSESSMENT_32_SCORING_SPEC.md`：两份规格构念和题位一致，允许建立隔离并行 draft；签署不代表准确性验证、稳定版或默认切换批准。
- [x] 保持 48 题为生产默认，并用 manifest + SHA-256 冻结为 `h3-a48-v1`；32 题准确性研究已取消，`h3-a32-v1` 无限期 draft，不切换默认。
- [x] 建立只读版本 manifest，包含评估/结果版本、状态、题量、hash、评分模型、新会话和公开权限。
- [x] 冻结旧 `v1.<48 digits>` 的题目顺序和 `h3-result-v1` 绑定，增加永久 fixture；旧解码不再读取未来默认题库。
- [x] 为 questions/score/share API 增加显式版本契约和严格数量/ID 集校验；省略版本仍兼容 48 题正式调用，draft 公开访问返回 409。
- [x] 答案缺失、多余、非法值或跨版本统一返回 HTTP 422 `ASSESSMENT_ANSWER_MISMATCH`，并精确覆盖 expected/received count 和 missing/extra/invalid IDs。
- [ ] 完成 localStorage 全量迁移演练：版本化 helper、旧无版本识别和 48 双写能力已实现；正式页面暂未切换新 key，仍需补真实浏览器双读/回滚测试后再启用。
- [x] 现有正式结果重建已显式限制为 `h3-a48-v1 + h3-result-v1`；32 题 `h3-result-v2` builder 尚未实现，不允许退回当前模板伪造结果。
- [x] 冻结 `h3-result-v1` 的 stages/quadrants/result-templates/recommendations canonical hash，并增加固定 48 答案到 BuiltResult 核心快照 fixture。
- [x] 已补版本状态、默认控制、48/32 交叉提交、旧分享 fixture、严格输入和内部候选评分软件测试；这些是工程验证，不是产品准确性测验，也不授权进入 `calibrating`。
- [x] 32 题平衡版已作为独立 `draft / not-started` 工作稿创建；无公开入口、hash 未冻结，不能表述为已校准或可上线。
- [x] 已准备 32 题认知访谈主持手册、研究员题单和匿名记录模板，内容快照为 `h3-a32-v1-cog-r1`；用户已取消访谈前置要求，这些材料仅作为可选档案保留。
- [x] 用户已取消全部 32 题准确性研究；冻结、招募、访谈、配对、复测和晋级统计不再作为当前任务。
- [x] 已锁定 32 题结果解释边界：Spirit 不得由关系连接单题扩写为完整关系/共同体判断；Vocation 不得由资源准备单题扩写为财务能力或完整资源系统判断。当前无正式 32 题结果入口。
- [x] 48/32 配对、复测、角色分层和晋级统计已取消并无限期暂停；既有门槛仅作归档，不执行也不视为通过。
- [ ] 持续保证 `h3-a48-v1` 是唯一正式默认，`h3-a32-v1` 保持未验证 draft、禁止公开和默认切换。

## P0

- 让产品、内容或非技术评审成员阅读 `docs/QUESTION_BANK_SCORING_TABLE.md`，确认题库、反向题和公式解释是否清楚。
- 按 `docs/MOBILE_QA_CHECKLIST.md` 用真实 iPhone Safari 和 Android Chrome 检查答题页和结果页。
- 用真实 iPhone Safari 和 Android Chrome 复核首页移动菜单和共享导航移动菜单：打开、进入二级、返回、关闭、滚动锁定/解除。
- 用真实 iPhone Safari 和 Android Chrome 复核从测评页、结果页和移动菜单完整加载返回首页后的 Canvas 粒子、首屏、顶部滚动位置及 `/#why` 等锚点定位。
- 由用户/UI 窗口在 1440×900、1024×768、390×844、320×568 复核 `#levels` 与 `#false-transformation` 的卡片排版、同组单开、箭头索引、移动横滑、下一卡露出和两组视觉差异。
- 用真实 iPhone Safari/Android Chrome 确认 carousel 容器 reveal 后所有离屏卡始终可见、轨道仅横向滚动；不要重新给 `.insight-card` 添加逐卡 reveal。
- 根据真实用户反馈继续审校免费结果系统文案：Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics、Immediate Next Action。
- 审校分享卡片 PNG 的视觉层级、文案长度和移动端下载体验。
- 用真实手机浏览器复核分享卡片 PNG 和完整报告 PDF 下载体验，尤其是 iPhone Safari 与 Android Chrome。
- 打开 `/result?pdfPreview=1` 或 `/result/share?a=v1.444444444444444444444444444444444444444444444444&pdfPreview=1`，由用户确认所有小节标题前圆点已移除且左对齐、正文列表圆点仍保留、横线仍为恢复后的上一版，并继续复核 Page 1 不裁切。
- 优先按 `ui-prototypes/human-3-ui-v2.html` 原文件复核首页 `/`，确认当前实现是直接套用原 HTML，而不是 React 复刻或二次设计。
- 按 `ui-prototypes/` 另外两份静态 HTML 复核 `/assessment`、`/result`、`/result/share`，确认没有重新设计或偏离原型结构。
- 在总控确认后执行 GitHub/Vercel 同步，把已通过本地 `pnpm check` 的真实结果和 API 接入版本发布到公网。

## P1

- 在静态原型产品化验收通过后，再根据真实使用反馈微调移动端箭头提示、首页粒子动画性能、结果页四象限图可读性和分享卡片文案密度。
- 如需改 UI，优先更新或对照 `ui-prototypes/` 原型基准，不要重新抽象设计语言后重组页面。
- 等首页原 HTML 视觉验收稳定后，再按区块接入首页展示数据：`hero -> site-content`、`quadrants -> quadrants`、`levels -> stages`、`preview/final -> result-templates/site-content`。接入时只替换数据，不改原 DOM/class 结构。
- 实现 `POST /api/debug/validate-content`，把 `scripts/validate-data.mjs` 拆成可导入校验模块，让脚本和 Debug API 共用同一套规则。
- 实现 `POST /api/debug/preview-result`，用于本地预览 preset 或完整答案生成的结果页，不影响正式 `/result`。
- 建立 Metatype / Lifestyle Archetype 命名表，避免借名后自由漂移。
- 评估是否将 `Metatype` / `Lifestyle Archetype` 在 UI 或文档中低风险改名为“状态名 / 生活模式 / Human Pattern”。
- 32 题内容、评分和产品口径已共同签署，隔离 draft 已建立；后续准确性研究与晋级无限期暂停，不再进入 `calibrating`，不得覆盖 48 题基准。
- 32 题 `h3-result-v2` 内容扩展无限期暂停；没有新的明确授权时不继续，同时不得原地修改已冻结的 `h3-result-v1`。
- 把 Anti-vision、Writing Practice、Minimum Effective Development 转译成 1.1 行动建议库。
- 持续观察后续 GitHub Actions CI，确认评分模型升级后的远程构建和 E2E 仍稳定。
- 扩展 Playwright 端到端测试，覆盖更多 API 异常和分享链接边界，例如非 JSON 请求体、极短/极长分享码、评分 API 临时失败后的本地回退。
- 增强分享卡片文案和视觉，使其更适合朋友圈、小红书和社群传播。
- 让 `/result/[id]` 在接入数据库后支持数据库短链接，替代当前 URL 答案码方案。

## P2

- AI 高级报告加入 Problem hierarchy、Channels、Flow / attention / recovery 和 Digital Leverage Path。
- 研究是否建立完整 Archetype / Metatype 组合系统，避免继续只按阶段生成传播型状态名。
- Metacrisis、Level 4.0+、Channels、Flow、Digital Leverage 等只进入高级内容或 2.0 报告，不进入当前 1.0 基础评分。
- Supabase 持久化。
- 用户复测记录。
- 题库版本管理的可写后台与发布工作流；只读 manifest 和历史兼容属于前置门槛。
- 结果报告版本管理的可写后台与发布工作流；历史 `resultVersion` 冻结与读取属于前置门槛。
- AI 月度成长教练：深度追问、false transformation 检查、月度复盘和 30 天行动计划。
- 付费能力。
- 管理后台。

## 末级 Backlog

- 页面模板化已按最新需求暂停，不属于当前 P0/P1，也不进入本次 GitHub/Vercel 发布。
- 模板相关目录、组件、样式、Debug 路由、测试和演示资源保留在本地工作区，禁止与正式产品改动混合提交。
- 仅在 1.0 正式产品收口、真实手机验收完成且用户重新授权后，再评估模板 schema、Gallery、CMS/API、编辑器和版本管理。
