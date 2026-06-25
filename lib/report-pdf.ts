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

export async function downloadFullReportPdf(result: BuiltResult) {
  const report = document.querySelector<HTMLElement>(".result-prototype main");
  const shell = document.querySelector<HTMLElement>(".result-prototype");

  if (!report) {
    throw new Error("Cannot find result report content.");
  }

  shell?.classList.add("is-exporting-pdf");
  const restoreRootColors = applyPdfColorVariables(document.documentElement);
  const restoreShellColors = shell ? applyPdfColorVariables(shell) : () => {};

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(report, {
      backgroundColor: "#000000",
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      logging: false,
      windowWidth: report.scrollWidth,
      windowHeight: report.scrollHeight,
      onclone: (clonedDocument) => {
        applyPdfColorVariables(clonedDocument.documentElement);
        const clonedShell =
          clonedDocument.querySelector<HTMLElement>(".result-prototype");
        if (clonedShell) applyPdfColorVariables(clonedShell);

        const style = clonedDocument.createElement("style");
        style.textContent = `
          :root {
            --background: #000000 !important;
            --foreground: #f5f5f7 !important;
            --card: #080808 !important;
            --card-foreground: #f5f5f7 !important;
            --popover: #080808 !important;
            --popover-foreground: #f5f5f7 !important;
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

          .result-prototype,
          .result-prototype main {
            background: #000000 !important;
            color: #f5f5f7 !important;
          }

          .result-prototype main,
          .result-prototype main * {
            border-color: rgba(245, 245, 247, 0.24) !important;
            outline-color: #f5f5f7 !important;
            text-decoration-color: currentColor !important;
          }

          .result-prototype main p,
          .result-prototype main li,
          .result-prototype main small,
          .result-prototype .hero-copy,
          .result-prototype .dimension-copy,
          .result-prototype .share-copy,
          .result-prototype .footer-note {
            color: rgba(245, 245, 247, 0.84) !important;
          }

          .result-prototype .topbar,
          .result-prototype .back-link,
          .result-prototype .meta-actions,
          .result-prototype .hero-actions,
          .result-prototype .mobile-menu {
            display: none !important;
          }

          .result-prototype *,
          .result-prototype *::before,
          .result-prototype *::after {
            box-shadow: none !important;
          }
        `;
        clonedDocument.head.appendChild(style);
      },
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
      compress: true,
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 28;
    const imageWidth = pageWidth - margin * 2;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const imageData = canvas.toDataURL("image/png", 0.94);

    let y = margin;
    let remainingHeight = imageHeight;
    pdf.addImage(imageData, "PNG", margin, y, imageWidth, imageHeight);
    remainingHeight -= pageHeight - margin * 2;

    while (remainingHeight > 0) {
      pdf.addPage();
      y = margin - (imageHeight - remainingHeight);
      pdf.addImage(imageData, "PNG", margin, y, imageWidth, imageHeight);
      remainingHeight -= pageHeight - margin * 2;
    }

    pdf.save(`human-3-full-report-${result.shareCard.stageCode}.pdf`);
  } finally {
    shell?.classList.remove("is-exporting-pdf");
    restoreShellColors();
    restoreRootColors();
  }
}
