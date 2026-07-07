# 32 题候选校准数据模板

状态：`archive/optional`。产品已取消 32 题认知访谈、配对、复测、招募和准确性统计；模板保留但不得派发或用于当前项目收集数据。真实数据从未收集。

文件：

- `participants.csv`：匿名参与者和分层/顺序分配。
- `sessions.csv`：每次施测和派生评分。
- `item-responses.csv`：逐题答案，用于项目与角色偏差分析。
- `cognitive-interviews.csv`：认知访谈逐题记录。
- `paired-comparisons.csv`：48/32 配对指标。
- `retest-comparisons.csv`：两版各自复测指标。
- `ASSESSMENT_32_CALIBRATION_REPORT_TEMPLATE.md`：最终报告空白结构。

隐私和编码规则见 `docs/ASSESSMENT_32_RESEARCH_PLAN.md`。CSV 当前只有表头，不包含样例或伪造数据。

多值象限集合使用 `|` 分隔，顺序固定为 `mind|body|spirit|vocation`。布尔值使用 `true/false`，缺失值留空。
