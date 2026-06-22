"use client";

import type { BuiltResult } from "@/lib/types";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const CARD_PADDING = 86;

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

function drawPill(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  context.font =
    '28px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  const width = context.measureText(text).width + 42;
  drawRoundedRect(context, x, y, width, 54, 27);
  context.fillStyle = "#e8eee5";
  context.fill();
  context.fillStyle = "#24473f";
  context.fillText(text, x + 21, y + 36);
  return width;
}

export function buildShareCardImage(result: BuiltResult) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.fillStyle = "#f8f5ed";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  context.fillStyle = "#ffffff";
  drawRoundedRect(
    context,
    44,
    44,
    CARD_WIDTH - 88,
    CARD_HEIGHT - 88,
    40,
  );
  context.fill();

  context.strokeStyle = "#d8d2c4";
  context.lineWidth = 3;
  context.stroke();

  context.fillStyle = "#24473f";
  context.font =
    '34px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  context.fillText(result.shareCard.siteName, CARD_PADDING, 126);

  context.fillStyle = "#6b705c";
  context.font = '30px "SFMono-Regular", "SF Mono", Consolas, monospace';
  context.fillText(result.shareCard.stageCode, CARD_PADDING, 190);

  context.fillStyle = "#24473f";
  context.font = '42px "SFMono-Regular", "SF Mono", Consolas, monospace';
  context.fillText(result.shareCard.metatype, CARD_PADDING, 290);

  context.fillStyle = "#1f2d2a";
  context.font =
    '68px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  const titleEndY = drawWrappedText({
    context,
    text: result.shareCard.title,
    x: CARD_PADDING,
    y: 390,
    maxWidth: CARD_WIDTH - CARD_PADDING * 2,
    lineHeight: 88,
    maxLines: 3,
  });

  context.fillStyle = "#5f665f";
  context.font =
    '38px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  drawWrappedText({
    context,
    text: result.shareCard.oneLiner,
    x: CARD_PADDING,
    y: titleEndY + 60,
    maxWidth: CARD_WIDTH - CARD_PADDING * 2,
    lineHeight: 58,
    maxLines: 5,
  });

  context.fillStyle = "#24473f";
  context.font =
    '34px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  context.fillText(
    `主导象限：${result.shareCard.dominantQuadrant}`,
    CARD_PADDING,
    1038,
  );

  let pillX = CARD_PADDING;
  for (const keyword of result.shareCard.keywords) {
    const pillWidth = drawPill(context, keyword, pillX, 1102);
    pillX += pillWidth + 18;
  }

  context.strokeStyle = "#d8d2c4";
  context.beginPath();
  context.moveTo(CARD_PADDING, 1240);
  context.lineTo(CARD_WIDTH - CARD_PADDING, 1240);
  context.stroke();

  context.fillStyle = "#6b705c";
  context.font =
    '30px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  context.fillText("这不是人格标签，是一次当前人生系统状态快照。", CARD_PADDING, 1302);

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
    link.download = `human-3-result-${result.shareCard.stageCode}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}
