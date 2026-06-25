"use client";

import Link from "next/link";
import { useState } from "react";

import { SiteNav } from "@/components/SiteNav";
import siteContent from "@/data/site-content.json";
import { QUADRANT_ORDER } from "@/lib/constants";
import { downloadFullReportPdf } from "@/lib/report-pdf";
import { buildShareResultPath } from "@/lib/share-link";
import { downloadShareCardImage } from "@/lib/share-card-image";
import questionsData from "@/data/questions.json";
import type { BuiltResult, QuadrantId, Question } from "@/lib/types";

const stateWidths: Record<string, number> = {
  unstable: 42,
  forming: 58,
  grounded: 74,
  mature: 84,
};

const stageCopy: Record<string, string> = {
  "1": "失调期",
  "2": "不确定期",
  "3": "发现期",
};

function getQuadrantLabel(quadrantId: QuadrantId) {
  const map: Record<QuadrantId, string> = {
    mind: "label-mind",
    body: "label-body",
    spirit: "label-spirit",
    vocation: "label-vocation",
  };
  return map[quadrantId];
}

function buildRadarPoints(result: BuiltResult) {
  const center = { x: 160, y: 160 };
  const radiusByState: Record<string, number> = {
    unstable: 54,
    forming: 74,
    grounded: 94,
    mature: 112,
  };
  const axis: Record<QuadrantId, { x: number; y: number }> = {
    mind: { x: 0, y: -1 },
    body: { x: 1, y: 0 },
    spirit: { x: 0, y: 1 },
    vocation: { x: -1, y: 0 },
  };

  return QUADRANT_ORDER.map((quadrantId) => {
    const report = result.quadrantReports.find(
      (item) => item.quadrant.id === quadrantId,
    );
    const radius = radiusByState[report?.state ?? "forming"];
    return {
      id: quadrantId,
      x: center.x + axis[quadrantId].x * radius,
      y: center.y + axis[quadrantId].y * radius,
    };
  });
}

function TodoButton({ children }: { children: string }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className="todo-button"
      type="button"
      aria-pressed={isPressed}
      onClick={() => setIsPressed((value) => !value)}
    >
      <span>{children}</span>
      <i className="todo-dot" aria-hidden="true" />
    </button>
  );
}

function ShareActions({ result }: { result: BuiltResult }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  async function buildSharePath() {
    try {
      const response = await fetch("/api/share/encode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: result.answers }),
      });
      const body = (await response.json()) as {
        data?: { path?: string };
        error?: string;
      };

      if (!response.ok || !body.data?.path) {
        throw new Error(body.error ?? "Unable to encode share link.");
      }

      return body.data.path;
    } catch {
      return buildShareResultPath(questionsData as Question[], result.answers);
    }
  }

  async function copyShareLink() {
    const sharePath = await buildSharePath();
    const url = new URL(sharePath, window.location.origin).toString();
    try {
      await window.navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const didCopy = document.execCommand("copy");
      textarea.remove();
      setCopyState(didCopy ? "copied" : "failed");
    }

    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <div className="hero-actions">
      <button
        className="button primary"
        type="button"
        onClick={() => downloadShareCardImage(result)}
      >
        保存卡片
      </button>
      <button className="button" type="button" onClick={copyShareLink}>
        {copyState === "copied" ? "已复制链接" : "复制结果链接"}
      </button>
      {copyState === "failed" ? (
        <p className="share-copy" role="status">
          自动复制失败，请稍后再试。
        </p>
      ) : null}
    </div>
  );
}

export function ResultEmptyState({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="prototype-page result-prototype">
      <SiteNav current="result" />
      <main className="empty-state">
        <h1>{title}</h1>
        <p>{copy}</p>
        <div className="hero-actions">
          <Link className="button primary" href="/assessment">
            开始评估
          </Link>
          <Link className="button" href="/">
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}

export function ResultReport({
  result,
  shared = false,
}: {
  result: BuiltResult;
  shared?: boolean;
}) {
  const radarPoints = buildRadarPoints(result);
  const polygonPoints = radarPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const dominant = result.dominantQuadrant.englishName;
  const weak = result.weakQuadrant.englishName;
  const strengths = [
    result.summary,
    result.crossQuadrantDynamics,
    result.friendPerspective.impression,
  ];
  const blindspots = [
    result.coreProblem,
    result.primaryBlock,
    result.friendPerspective.misunderstoodAs,
  ];

  return (
    <div className="prototype-page result-prototype">
      <SiteNav current="result" />
      <main>
        <section className="report-hero" aria-labelledby="report-title">
          <div>
            <Link className="back-link" href="/assessment">
              ← 返回问卷
            </Link>
            <p className="eyebrow">Your Human Pattern Report</p>
            <h1 id="report-title">{result.shareCard.chineseName}</h1>
            <p className="hero-subtitle">
              {dominant} + {weak}
            </p>
            <div className="hero-tags" aria-label="状态关键词">
              {result.shareCard.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
            <p className="hero-copy">{result.summary}</p>
          </div>

          <aside className="metadata" aria-label="结果元信息">
            <div className="meta-actions">
              <button
                className="button"
                type="button"
                onClick={() => downloadFullReportPdf(result)}
              >
                ↓ 下载完整报告
              </button>
            </div>
            <dl className="meta-table">
              <div className="meta-row">
                <dt>Current Stage</dt>
                <dd>
                  {result.stage.code} · {result.stage.name}
                </dd>
              </div>
              <div className="meta-row">
                <dt>Phase</dt>
                <dd>
                  {result.stage.phaseName} / {stageCopy[result.stage.phase]}
                </dd>
              </div>
              <div className="meta-row">
                <dt>Dominant</dt>
                <dd>
                  {result.dominantQuadrant.englishName} / {result.dominantQuadrant.name}
                </dd>
              </div>
              <div className="meta-row">
                <dt>Limiting</dt>
                <dd>
                  {result.weakQuadrant.englishName} / {result.weakQuadrant.name}系统
                </dd>
              </div>
              <div className="meta-row">
                <dt>Report ID</dt>
                <dd>{shared ? "SHARED-RESULT" : result.id.toUpperCase()}</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="report-section" id="dimensions" aria-labelledby="dimensions-title">
          <div className="section-title">
            <h2 id="dimensions-title">1. 你的四象限状态</h2>
          </div>
          <div className="dimensions-layout">
            <div className="radar-wrap" aria-label="四象限发展图">
              <svg className="radar" viewBox="0 0 320 320" role="img" aria-label="四象限发展轮廓">
                <line x1="160" y1="28" x2="160" y2="292" stroke="rgba(245,245,247,.12)" />
                <line x1="28" y1="160" x2="292" y2="160" stroke="rgba(245,245,247,.12)" />
                <polygon
                  points={polygonPoints}
                  fill="rgba(245,245,247,.08)"
                  stroke="rgba(245,245,247,.88)"
                  strokeWidth="2"
                />
                {radarPoints.map((point) => (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="#f5f5f7"
                    key={point.id}
                    r="3"
                  />
                ))}
              </svg>
              {result.quadrantReports.map((report) => (
                <div
                  className={`radar-label ${getQuadrantLabel(report.quadrant.id)}`}
                  key={report.quadrant.id}
                >
                  {report.quadrant.englishName}
                  <span>
                    {report.development.stage} · {report.stateLabel}
                  </span>
                </div>
              ))}
            </div>

            <div className="dimension-list">
              {result.quadrantReports.map((report) => {
                const role =
                  report.quadrant.id === result.dominantQuadrant.id
                    ? "主导象限"
                    : report.quadrant.id === result.weakQuadrant.id
                      ? "限制象限"
                      : "协同象限";

                return (
                  <div className="dimension-row" key={report.quadrant.id}>
                    <div className="dimension-main">
                      <div className="dimension-name">
                        {report.quadrant.englishName}{" "}
                        <span>{report.development.stage}</span>
                      </div>
                      <div className="bar" aria-hidden="true">
                        <i style={{ width: `${stateWidths[report.state]}%` }} />
                      </div>
                      <div className="dimension-state">
                        {report.stateLabel} · {role}
                      </div>
                    </div>
                    <p className="dimension-copy">{report.impact}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="report-section two-column" id="state" aria-labelledby="state-title">
          <div>
            <div className="section-title">
              <h2 id="state-title">2. 当前状态</h2>
            </div>
            <dl className="data-list">
              <div className="data-row">
                <dt>整体阶段</dt>
                <dd>
                  {result.stage.code} · {result.stage.name}
                  <small>{result.headline}</small>
                </dd>
              </div>
              <div className="data-row">
                <dt>主要阶段</dt>
                <dd>
                  {result.stage.phaseName}
                  <small>{result.stage.description}</small>
                </dd>
              </div>
              <div className="data-row">
                <dt>发展方向</dt>
                <dd>
                  走向更稳定的系统协同
                  <small>{result.crossQuadrantDynamics}</small>
                </dd>
              </div>
            </dl>
          </div>

          <div id="pattern">
            <div className="section-title">
              <h2>3. 你的状态模式</h2>
            </div>
            <dl className="data-list">
              <div className="data-row">
                <dt>生活模式</dt>
                <dd>
                  {result.lifestyleArchetype}
                  <small>当前是本项目状态画像字段，不是固定人格标签。</small>
                </dd>
              </div>
              <div className="data-row">
                <dt>Metatype</dt>
                <dd>
                  {result.metatype}
                  <small>
                    {result.dominantQuadrant.englishName} 是当前最容易调动的系统。
                  </small>
                </dd>
              </div>
              <div className="data-row">
                <dt>核心问题</dt>
                <dd>{result.coreProblem}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="report-section" id="blindspots" aria-labelledby="blindspots-title">
          <div className="section-title">
            <h2 id="blindspots-title">4. 优势与盲点</h2>
          </div>
          <div className="split-list">
            <div>
              <p className="list-title">你的优势</p>
              <ul>
                {strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="list-title">当前盲点</p>
              <ul>
                {blindspots.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="report-section" id="next" aria-labelledby="next-title">
          <div className="section-title">
            <h2 id="next-title">5. 下一步行动</h2>
          </div>
          <div className="next-grid">
            {[
              ["01", "未来 7 天", result.recommendations.sevenDays],
              ["02", "未来 30 天", result.recommendations.thirtyDays],
              ["03", "未来 90 天", result.recommendations.ninetyDays],
            ].map(([index, title, items]) => (
              <div className="next-item" key={index as string}>
                <span className="step-index">{index as string}</span>
                <h3>{title as string}</h3>
                <div className="todo-list" aria-label={`${title}待办事项`}>
                  {(items as string[]).map((item) => (
                    <TodoButton key={item}>{item}</TodoButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="report-section" id="share" aria-labelledby="share-title">
          <div className="section-title">
            <h2 id="share-title">6. 分享卡片</h2>
          </div>
          <div className="share-layout">
            <div className="share-card" aria-label="分享卡片预览">
              <div>
                <div className="share-brand">
                  <span>HUMAN 3.0</span>
                  <span>{result.shareCard.stageCode}</span>
                </div>
                <h3>{result.shareCard.title}</h3>
                <p>{result.shareCard.insight}</p>
              </div>
              <div className="share-foot">
                <div>
                  <span>Dominant</span>
                  <strong>{result.shareCard.dominantQuadrant}</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>{result.shareCard.weakQuadrant} System</strong>
                </div>
              </div>
            </div>
            <div>
              <p className="share-copy">
                分享卡片适合截图、保存或转发。它只展示阶段、主导象限、当前重点和一句核心洞察，不展示原始分数，也不把结果包装成固定人格标签。
              </p>
              <ShareActions result={result} />
            </div>
          </div>
        </section>

        <p className="footer-note" id="limits">
          {siteContent.disclaimer}
        </p>
      </main>
    </div>
  );
}
