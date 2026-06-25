"use client";

import type { BuiltResult } from "@/lib/types";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
const CARD_PADDING = 84;
const CARD_RADIUS = 26;
const CARD_INSET = 44;

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let currentLine = "";

  for (const char of text) {
    const testLine = `${currentLine}${char}`;
    if (context.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawWrappedText(params: {
  context: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
  maxLines?: number;
}) {
  const { context, text, x, y, maxWidth, lineHeight, maxLines } = params;
  const lines = wrapText(context, text, maxWidth);
  const visibleLines = maxLines ? lines.slice(0, maxLines) : lines;

  visibleLines.forEach((line, index) => {
    const suffix = maxLines && index === maxLines - 1 && lines.length > maxLines ? "..." : "";
    context.fillText(`${line}${suffix}`, x, y + index * lineHeight);
  });

  return y + visibleLines.length * lineHeight;
}

function font(size: number, weight = 500) {
  return `${weight} ${size}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`;
}

function mono(size: number, weight = 500) {
  return `${weight} ${size}px "SFMono-Regular", "SF Mono", Consolas, ui-monospace, monospace`;
}

export function buildShareCardImage(result: BuiltResult) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.fillStyle = "#000";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  drawRoundedRect(
    context,
    CARD_INSET,
    CARD_INSET,
    CARD_WIDTH - CARD_INSET * 2,
    CARD_HEIGHT - CARD_INSET * 2,
    CARD_RADIUS,
  );
  context.fillStyle = "#080808";
  context.fill();
  context.strokeStyle = "rgba(245, 245, 247, 0.36)";
  context.lineWidth = 2;
  context.stroke();

  const left = CARD_PADDING;
  const right = CARD_WIDTH - CARD_PADDING;
  const contentWidth = right - left;

  context.fillStyle = "rgba(245, 245, 247, 0.78)";
  context.font = mono(28, 500);
  context.fillText("HUMAN 3.0", left, 118);
  const stage = result.shareCard.stageCode;
  const stageWidth = context.measureText(stage).width;
  context.fillText(stage, right - stageWidth, 118);

  context.fillStyle = "#f5f5f7";
  context.font = font(92, 760);
  const titleEndY = drawWrappedText({
    context,
    text: result.shareCard.title,
    x: left,
    y: 292,
    maxWidth: contentWidth,
    lineHeight: 112,
    maxLines: 5,
  });

  context.fillStyle = "rgba(245, 245, 247, 0.82)";
  context.font = font(32, 420);
  drawWrappedText({
    context,
    text: result.shareCard.insight,
    x: left,
    y: titleEndY + 62,
    maxWidth: contentWidth,
    lineHeight: 48,
    maxLines: 3,
  });

  const footerY = CARD_HEIGHT - 172;
  context.fillStyle = "rgba(245, 245, 247, 0.68)";
  context.font = mono(24, 500);
  context.fillText("Dominant", left, footerY);
  context.fillText("Focus", left + contentWidth * 0.48, footerY);

  context.fillStyle = "#f5f5f7";
  context.font = font(34, 620);
  context.fillText(result.shareCard.dominantQuadrant, left, footerY + 62);
  context.fillText(
    `${result.shareCard.weakQuadrant} System`,
    left + contentWidth * 0.48,
    footerY + 62,
  );

  return canvas;
}

export function downloadShareCardImage(result: BuiltResult) {
  const canvas = buildShareCardImage(result);

  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error("Unable to create share card image.");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `human-3-share-card-${result.shareCard.stageCode}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}
