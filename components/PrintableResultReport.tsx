import siteContent from "@/data/site-content.json";
import { QUADRANT_ORDER } from "@/lib/constants";
import { formatPhaseLabel } from "@/lib/stage-format";
import type { BuiltResult, QuadrantId } from "@/lib/types";

const quadrantStateWidths: Record<string, number> = {
  unstable: 42,
  forming: 58,
  grounded: 74,
  mature: 84,
};

const radiusByState: Record<string, number> = {
  unstable: 42,
  forming: 58,
  grounded: 74,
  mature: 88,
};

const axis: Record<QuadrantId, { x: number; y: number }> = {
  mind: { x: 0, y: -1 },
  body: { x: 1, y: 0 },
  spirit: { x: 0, y: 1 },
  vocation: { x: -1, y: 0 },
};

function getOrderedReports(result: BuiltResult) {
  return QUADRANT_ORDER.map((quadrantId) =>
    result.quadrantReports.find((report) => report.quadrant.id === quadrantId),
  ).filter((report): report is BuiltResult["quadrantReports"][number] =>
    Boolean(report),
  );
}

function getRole(result: BuiltResult, quadrantId: QuadrantId) {
  if (quadrantId === result.dominantQuadrant.id) return "主导象限";
  if (quadrantId === result.weakQuadrant.id) return "限制象限";
  return "协同象限";
}

function trimText(value: string, limit: number) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1)}…`;
}

function buildPdfRadarPoints(result: BuiltResult) {
  const center = { x: 112, y: 112 };

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

export function PrintableResultReport({
  result,
  shared = false,
}: {
  result: BuiltResult;
  shared?: boolean;
}) {
  const reports = getOrderedReports(result);
  const radarPoints = buildPdfRadarPoints(result);
  const polygonPoints = radarPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const reportId = shared ? "SHARED-RESULT" : result.id.toUpperCase();
  const reportDate = new Date().toISOString().slice(0, 10);
  const stagePhase = formatPhaseLabel(result.stage);
  const actions = [
    ["7 天", result.recommendations.sevenDays],
    ["30 天", result.recommendations.thirtyDays],
    ["90 天", result.recommendations.ninetyDays],
  ] as const;

  return (
    <div className="pdf-report-shell" data-pdf-report>
      <section className="pdf-report-sheet" data-pdf-sheet>
        <header className="pdf-header">
          <div>
            <p className="pdf-kicker">
              HUMAN 3.0 / {reportId} / {reportDate}
            </p>
            <h1>{result.shareCard.chineseName}</h1>
          </div>
        </header>

        <p className="pdf-insight">{result.shareInsight}</p>

        <dl className="pdf-meta-grid" aria-label="结果元信息">
          <div>
            <dt>Current Stage</dt>
            <dd>
              {result.stage.code} · {result.stage.name}
            </dd>
          </div>
          <div>
            <dt>Phase</dt>
            <dd>{stagePhase}</dd>
          </div>
          <div>
            <dt>Dominant</dt>
            <dd>
              {result.dominantQuadrant.englishName} / {result.dominantQuadrant.name}
            </dd>
          </div>
          <div>
            <dt>Limiting</dt>
            <dd>
              {result.weakQuadrant.englishName} / {result.weakQuadrant.name}
            </dd>
          </div>
        </dl>

        <section className="pdf-block">
          <div className="pdf-section-title">
            <span>01</span>
            <h2>四象限状态摘要</h2>
          </div>
          <div className="pdf-overview">
            <div className="pdf-radar-card" aria-label="四象限发展轮廓图">
              <svg viewBox="0 0 224 224" role="img" aria-label="四象限轴线与轮廓">
                <line x1="112" y1="20" x2="112" y2="204" />
                <line x1="20" y1="112" x2="204" y2="112" />
                <polygon points={polygonPoints} />
                {radarPoints.map((point) => (
                  <circle cx={point.x} cy={point.y} key={point.id} r="3.5" />
                ))}
              </svg>
              <span className="pdf-radar-label top">Mind</span>
              <span className="pdf-radar-label right">Body</span>
              <span className="pdf-radar-label bottom">Spirit</span>
              <span className="pdf-radar-label left">Vocation</span>
            </div>

            <div className="pdf-quadrants">
              {reports.map((report) => (
                <article className="pdf-quadrant" key={report.quadrant.id}>
                  <div className="pdf-quadrant-head">
                    <h3>{report.quadrant.englishName}</h3>
                    <span>{report.quadrant.name}</span>
                  </div>
                  <div className="pdf-bar" aria-hidden="true">
                    <i style={{ width: `${quadrantStateWidths[report.state]}%` }} />
                  </div>
                  <p>
                    {report.development.stage} · {report.stateLabel} ·{" "}
                    {getRole(result, report.quadrant.id)}
                  </p>
                  <small>{trimText(report.impact, 56)}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="pdf-footer">
          <span>{reportId}</span>
          <span>Page 1 / 2</span>
        </footer>
      </section>

      <section className="pdf-report-sheet" data-pdf-sheet>
        <header className="pdf-header compact">
          <div>
            <p className="pdf-kicker">ACTION SYSTEM</p>
            <h1>下一步行动</h1>
          </div>
        </header>

        <section className="pdf-block pdf-two">
          <div>
            <div className="pdf-section-title">
              <span>02</span>
              <h2>当前模式</h2>
            </div>
            <p className="pdf-body-copy">{result.summary}</p>
            <p className="pdf-note">
              {result.stage.code} · {result.stage.name} · {stagePhase}
            </p>
            <p className="pdf-note">
              {result.lifestyleArchetype} · {result.metatype}
            </p>
          </div>
          <div>
            <div className="pdf-section-title">
              <span>03</span>
              <h2>核心卡点</h2>
            </div>
            <p className="pdf-body-copy">{result.coreProblem}</p>
            <p className="pdf-note">{result.primaryBlock}</p>
          </div>
        </section>

        <section className="pdf-block pdf-two">
          <div>
            <div className="pdf-section-title">
              <span>04</span>
              <h2>优势</h2>
            </div>
            <ul className="pdf-list">
              <li>{result.summary}</li>
              <li>{result.crossQuadrantDynamics}</li>
              <li>{result.friendPerspective.impression}</li>
            </ul>
          </div>
          <div>
            <div className="pdf-section-title">
              <span>05</span>
              <h2>盲点</h2>
            </div>
            <ul className="pdf-list">
              <li>{result.coreProblem}</li>
              <li>{result.primaryBlock}</li>
              <li>{result.friendPerspective.misunderstoodAs}</li>
            </ul>
          </div>
        </section>

        <section className="pdf-block">
          <div className="pdf-section-title">
            <span>06</span>
            <h2>7 / 30 / 90 天建议</h2>
          </div>
          <div className="pdf-actions">
            {actions.map(([title, items]) => (
              <article key={title}>
                <h3>{title}</h3>
                <ul>
                  {items.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="pdf-block pdf-final">
          <div>
            <p className="pdf-kicker">Immediate Next Action</p>
            <p>{result.recommendations.immediateAction}</p>
          </div>
          <div>
            <p className="pdf-kicker">Boundary</p>
            <p>{siteContent.disclaimer}</p>
          </div>
        </section>

        <footer className="pdf-footer">
          <span>{reportId}</span>
          <span>Page 2 / 2</span>
        </footer>
      </section>
    </div>
  );
}
