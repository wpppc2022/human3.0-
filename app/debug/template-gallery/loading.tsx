export default function TemplateGalleryLoading() {
  return (
    <main className="h3-gallery-page">
      <div className="h3-gallery-shell" aria-busy="true">
        <header className="h3-gallery-header">
          <div><p>DEVELOPMENT TOOL · NOINDEX</p><h1>Template Gallery</h1></div>
        </header>
        <div className="h3-gallery-loading" role="status">Loading template metadata…</div>
      </div>
    </main>
  );
}
