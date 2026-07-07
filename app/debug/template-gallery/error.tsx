"use client";

export default function TemplateGalleryError({ reset }: { reset: () => void }) {
  return (
    <main className="h3-gallery-page">
      <div className="h3-gallery-shell">
        <header className="h3-gallery-header"><div><p>DEVELOPMENT TOOL · NOINDEX</p><h1>Template Gallery</h1></div></header>
        <div className="h3-gallery-empty" role="alert">
          <h2>Template metadata could not be loaded.</h2>
          <p>筛选工具保持可恢复；重试不会写入数据。</p>
          <button onClick={reset} type="button">Retry</button>
        </div>
      </div>
    </main>
  );
}
