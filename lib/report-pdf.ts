"use client";

import type { BuiltResult } from "@/lib/types";

const PDF_COLOR_VARIABLES: Record<string, string> = {
  "--background": "#000000",
  "--foreground": "#f5f5f7",
  "--card": "#080808",
  "--card-foreground": "#f5f5f7",
  "--popover": "#080808",
  "--popover-foreground": "#f5f5f7",
  "--primary": "#f5f5f7",
  "--primary-foreground": "#000000",
  "--secondary": "#1f1f1f",
  "--secondary-foreground": "#f5f5f7",
  "--muted": "rgba(245, 245, 247, 0.82)",
  "--muted-foreground": "rgba(245, 245, 247, 0.82)",
  "--accent": "#242424",
  "--accent-foreground": "#f5f5f7",
  "--border": "rgba(245, 245, 247, 0.18)",
  "--input": "rgba(245, 245, 247, 0.18)",
  "--ring": "rgba(245, 245, 247, 0.8)",
  "--sidebar": "#080808",
  "--sidebar-foreground": "#f5f5f7",
  "--sidebar-primary": "#f5f5f7",
  "--sidebar-primary-foreground": "#000000",
  "--sidebar-accent": "#242424",
  "--sidebar-accent-foreground": "#f5f5f7",
  "--sidebar-border": "rgba(245, 245, 247, 0.18)",
  "--sidebar-ring": "rgba(245, 245, 247, 0.8)",
};

function applyPdfColorVariables(target: HTMLElement) {
  const previous = new Map<string, string>();

  for (const [name, value] of Object.entries(PDF_COLOR_VARIABLES)) {
    previous.set(name, target.style.getPropertyValue(name));
    target.style.setProperty(name, value, "important");
  }

  return () => {
    for (const [name, value] of previous) {
      if (value) {
        target.style.setProperty(name, value);
      } else {
        target.style.removeProperty(name);
      }
    }
  };
}

function injectPdfExportStyles(clonedDocument: Document) {
  applyPdfColorVariables(clonedDocument.documentElement);

  const style = clonedDocument.createElement("style");
  style.textContent = `
    :root {
      --background: #000000 !important;
      --foreground: #f5f5f7 !important;
      --card: #080808 !important;
      --card-foreground: #f5f5f7 !important;
      --primary: #f5f5f7 !important;
      --primary-foreground: #000000 !important;
      --secondary: #1f1f1f !important;
      --secondary-foreground: #f5f5f7 !important;
      --muted: rgba(245, 245, 247, 0.82) !important;
      --muted-foreground: rgba(245, 245, 247, 0.82) !important;
      --accent: #242424 !important;
      --accent-foreground: #f5f5f7 !important;
      --border: rgba(245, 245, 247, 0.18) !important;
      --input: rgba(245, 245, 247, 0.18) !important;
      --ring: rgba(245, 245, 247, 0.8) !important;
    }

    html,
    body,
    .pdf-report-sheet {
      background: #000000 !important;
      color: #f5f5f7 !important;
    }

    .pdf-report-sheet,
    .pdf-report-sheet * {
      box-shadow: none !important;
      text-decoration-color: currentColor !important;
    }
  `;
  clonedDocument.head.appendChild(style);
}

function getPdfSheets() {
  const report = document.querySelector<HTMLElement>("[data-pdf-report]");
  if (!report) {
    throw new Error("Cannot find printable PDF report.");
  }

  const sheets = Array.from(
    report.querySelectorAll<HTMLElement>("[data-pdf-sheet]"),
  );

  if (sheets.length === 0) {
    throw new Error("Cannot find printable PDF sheets.");
  }

  return { report, sheets };
}

export async function downloadFullReportPdf(result: BuiltResult) {
  const { report, sheets } = getPdfSheets();
  const restoreRootColors = applyPdfColorVariables(document.documentElement);
  const restoreReportColors = applyPdfColorVariables(report);

  report.classList.add("is-exporting-pdf-report");

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
      compress: true,
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let index = 0; index < sheets.length; index += 1) {
      const sheet = sheets[index];
      const canvas = await html2canvas(sheet, {
        backgroundColor: "#000000",
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        logging: false,
        width: sheet.offsetWidth,
        height: sheet.offsetHeight,
        windowWidth: sheet.scrollWidth,
        windowHeight: sheet.scrollHeight,
        onclone: injectPdfExportStyles,
      });

      if (index > 0) pdf.addPage();
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(
        canvas.toDataURL("image/png", 0.96),
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight,
      );
    }

    pdf.save(`human-3-full-report-${result.shareCard.stageCode}.pdf`);
  } finally {
    report.classList.remove("is-exporting-pdf-report");
    restoreReportColors();
    restoreRootColors();
  }
}
