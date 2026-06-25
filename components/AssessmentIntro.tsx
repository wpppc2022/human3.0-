"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { SiteNav } from "@/components/SiteNav";
import type { QuadrantDefinition, SiteContent } from "@/lib/types";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  alpha: number;
};

const phrases = ["HUMAN 3.0", "看清自己", "设计自己", "成为更完整的人"];

function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = document.getElementById("hero");
    if (!canvas || !hero) return;
    const canvasElement = canvas;
    const heroElement = hero;

    const context = canvasElement.getContext("2d");
    if (!context) return;
    const drawingContext = context;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let phraseIndex = 0;
    let frame = 0;
    let raf = 0;
    const particles: Particle[] = [];

    function makeTargets(text: string, count: number) {
      const textCanvas = document.createElement("canvas");
      const textContext = textCanvas.getContext("2d", { willReadFrequently: true });
      if (!textContext) return [];

      textCanvas.width = Math.max(1, Math.floor(width * 0.88));
      textCanvas.height = Math.max(1, Math.floor(height * 0.52));
      const fontSize = Math.max(46, Math.min(width / 5.6, height * 0.18));
      textContext.fillStyle = "#fff";
      textContext.textAlign = "center";
      textContext.textBaseline = "middle";
      textContext.font = `800 ${fontSize}px ${getComputedStyle(document.body).fontFamily}`;
      textContext.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

      const image = textContext.getImageData(0, 0, textCanvas.width, textCanvas.height);
      const points: Array<{ x: number; y: number }> = [];
      const step = width < 520 ? 5 : 4;

      for (let y = 0; y < textCanvas.height; y += step) {
        for (let x = 0; x < textCanvas.width; x += step) {
          if (image.data[(y * textCanvas.width + x) * 4 + 3] > 80) {
            points.push({
              x: (width - textCanvas.width) / 2 + x,
              y: height * 0.12 + y,
            });
          }
        }
      }

      if (points.length === 0) return [];
      return Array.from({ length: count }, (_, index) => points[index % points.length]);
    }

    function rebuild() {
      const rect = heroElement.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.round(width * dpr);
      canvasElement.height = Math.round(height * dpr);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      drawingContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(width < 600 ? 2600 : 5200, Math.max(1800, Math.floor((width * height) / 150)));
      const targets = makeTargets(phrases[phraseIndex], count);
      particles.length = 0;

      for (let index = 0; index < count; index += 1) {
        const target = targets[index] ?? {
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
        };
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          targetX: target.x,
          targetY: target.y,
          alpha: 0.35 + Math.random() * 0.5,
        });
      }
    }

    function retarget() {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      const targets = makeTargets(phrases[phraseIndex], particles.length);
      particles.forEach((particle, index) => {
        const target = targets[index];
        if (!target) return;
        particle.targetX = target.x;
        particle.targetY = target.y;
      });
    }

    function draw() {
      frame += 1;
      if (frame % 240 === 0) retarget();
      drawingContext.fillStyle = "#000";
      drawingContext.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        particle.vx = particle.vx * 0.86 + dx * 0.018;
        particle.vy = particle.vy * 0.86 + dy * 0.018;
        particle.x += particle.vx;
        particle.y += particle.vy;
        drawingContext.globalAlpha = particle.alpha;
        drawingContext.fillStyle = "#f5f5f7";
        drawingContext.fillRect(particle.x, particle.y, 1.6, 1.6);
      }

      drawingContext.globalAlpha = 1;
      raf = window.requestAnimationFrame(draw);
    }

    rebuild();
    draw();
    window.addEventListener("resize", rebuild);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", rebuild);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-hero-canvas"
      id="particle-hero-canvas"
      aria-hidden="true"
    />
  );
}

export function AssessmentIntro({
  content,
  quadrants,
}: {
  content: SiteContent;
  quadrants: QuadrantDefinition[];
}) {
  const quadrantCopy = [
    "你如何思考，如何处理情绪，如何理解自己。",
    "你的身体，决定你能走多远。",
    "关系和意义感，决定你为什么继续。",
    "你如何把能力变成价值。",
  ];

  return (
    <div className="prototype-page home-prototype">
      <SiteNav current="overview" />
      <main>
        <section className="hero" id="hero">
          <ParticleHero />
          <div className="hero-mask" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">Personal Growth Assessment Framework</p>
            <h1 className="sr-only">Human 3.0 自我发展评估</h1>
            <p className="hero-body">{content.intro}</p>
            <div className="hero-actions">
              <Link className="button" href="/assessment">
                开始评估
              </Link>
              <a className="button secondary" href="#why">
                了解它如何工作
              </a>
            </div>
          </div>
        </section>

        <section className="story" id="why">
          <div className="section-inner">
            <div className="media-story-grid" id="media-carousel">
              {[
                ["01", "学了很多，但没有真正改变。", "你知道很多方法，但生活里的行为模式，还是反复回到原点。"],
                ["02", "想得很清楚，但身体跟不上。", "你有计划，有目标，但精力、睡眠和习惯无法支撑长期执行。"],
                ["03", "做了很多事，但方向仍然模糊。", "你在行动，但不确定这些行动是否真的指向你想要的生活。"],
              ].map(([index, title, copy], itemIndex) => (
                <article
                  className={`media-story reveal${itemIndex ? ` delay-${itemIndex}` : " featured"}`}
                  key={index}
                >
                  <div className="media-slot" data-slot={itemIndex === 2 ? "ANIMATION SLOT" : "IMAGE SLOT"} />
                  <div className="media-caption">
                    <span className="index">{index}</span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="media-carousel-controls" aria-label="媒体卡片控制">
              <button className="media-control" type="button" aria-label="上一张">
                ‹
              </button>
              <button className="media-control" type="button" aria-label="下一张">
                ›
              </button>
            </div>
          </div>
        </section>

        <section className="story tight" id="quadrants">
          <div className="section-inner">
            <div className="section-heading centered reveal">
              <h2>
                人不是单点成长的。
                <br />
                真正的变化，发生在四个系统之间。
              </h2>
              <p className="section-text">
                HUMAN 3.0 用四个象限观察生活系统：你如何理解、如何承载、为何继续，以及如何把能力变成价值。
              </p>
            </div>
            <div className="quadrant-layout" aria-label="四象限模型">
              <div className="quadrant-center" aria-hidden="true">
                HUMAN
                <br />
                SYSTEM
              </div>
              <span className="axis-label top" aria-hidden="true">个人</span>
              <span className="axis-label bottom" aria-hidden="true">集体</span>
              <span className="axis-label left" aria-hidden="true">内在</span>
              <span className="axis-label right" aria-hidden="true">外在</span>
              {quadrants.map((quadrant, index) => (
                <button
                  className={`quadrant-option reveal${index ? ` delay-${index}` : ""}`}
                  type="button"
                  aria-expanded="false"
                  key={quadrant.id}
                >
                  <div className="quadrant-top">
                    <div>
                      <div className="quadrant-name">{quadrant.englishName}</div>
                      <div className="quadrant-cn">{quadrant.name}系统</div>
                    </div>
                    <span className="index">0{index + 1}</span>
                  </div>
                  <p className="small-copy">{quadrantCopy[index]}</p>
                  <p className="quadrant-more small-copy">{quadrant.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="story" id="levels">
          <div className="section-inner">
            <div className="section-heading reveal">
              <h2>
                成长不是变得更忙。
                <br />
                而是变得更有意识。
              </h2>
              <p className="section-text">
                层级不是排行榜，也不是分数越高越好。它描述的是一个人如何从默认脚本，逐步走向更有意识的生活系统。
              </p>
            </div>
            <div className="levels">
              {[
                ["Level 1.0", "按照默认脚本生活。", "更多依赖外部规则、权威、惯性和他人的期待。"],
                ["Level 2.0", "开始自己选择。", "追求突破、成就和独立判断，但也可能太执着于自己的方式。"],
                ["Level 3.0", "有意识地设计生活系统。", "能整合复杂现实，理解不同视角，并建立适合自己的系统。"],
              ].map(([code, title, copy], index) => (
                <article className={`level reveal${index ? ` delay-${index}` : ""}`} key={code}>
                  <span className="level-code">{code}</span>
                  <h3>{title}</h3>
                  <p className="small-copy">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="turning-point" id="false-transformation">
          <div className="section-inner">
            <div className="turning-title reveal">
              <h2>你可能只是把“理解”误认为“改变”。</h2>
            </div>
            <div className="transformation-grid">
              {[
                ["01", "Knowledge", "你知道什么。你读过、听过、理解过，但它还没有进入你的行为。"],
                ["02", "Experience", "你做过什么。你尝试过，也经历过，但还不一定能稳定复现。"],
                ["03", "Skill", "你真正掌握什么。你能在现实压力下，持续、稳定、反复做到。"],
              ].map(([index, title, copy], itemIndex) => (
                <article className={`transformation reveal${itemIndex ? ` delay-${itemIndex}` : ""}`} key={index}>
                  <span className="index">{index}</span>
                  <h3>{title}</h3>
                  <p className="small-copy">{copy}</p>
                </article>
              ))}
            </div>
            <p className="emphasis-line reveal delay-3">
              HUMAN 3.0 关心的不是你知道多少。而是你是否真的变成了那样的人。
            </p>
          </div>
        </section>

        <section className="story" id="flow">
          <div className="section-inner">
            <div className="section-heading centered reveal">
              <h2>
                不是给你贴标签。
                <br />
                而是帮你找到真正的问题。
              </h2>
              <p className="section-text">
                评估流程把感觉拆成证据，把证据整理成结构，再回到你下一步真正能做的行动。
              </p>
            </div>
            <div className="process" id="process">
              <div className="process-line">
                {[
                  ["回答问题", "覆盖 Mind、Body、Spirit、Vocation 四个象限。"],
                  ["收集证据", "看具体经历，而不是只看感觉。"],
                  ["识别卡点", "找到限制其他象限的部分。"],
                  ["生成行动方向", "给出 7 天、30 天、90 天重点。"],
                ].map(([title, copy], index) => (
                  <article className={`process-step reveal${index ? ` delay-${index}` : ""}`} data-step={index + 1} key={title}>
                    <h3>{title}</h3>
                    <p className="small-copy">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story tight" id="preview">
          <div className="section-inner">
            <div className="report-preview">
              <div className="report-copy reveal">
                <h2>得到一张关于自己的行动地图。</h2>
                <p className="section-text">
                  你会看见：你现在在哪里。什么正在限制你。什么最值得先改变。以及下一步该怎么做。
                </p>
              </div>
              <div className="report-shell reveal delay-1">
                <div className="report-window">
                  <div className="report-top">
                    <div className="report-title">
                      <strong>Your Human 3.0 Report</strong>
                      <span>Current system map · No raw scores</span>
                    </div>
                    <span className="index">Preview</span>
                  </div>
                  <div className="report-modules">
                    {content.outcomes.items.map((item) => (
                      <div className="report-module" data-tip={item} key={item}>
                        <strong>{item}</strong>
                        <span>以当前状态为准，帮助你把洞察转成行动。</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final" id="final">
          <div className="section-inner">
            <div className="section-heading centered reveal">
              <h2>
                看见你现在在哪里。
                <br />
                看见什么正在限制你。
                <br />
                看见下一步该怎么做。
              </h2>
              <p className="section-text">不生成诊断。不贴标签。只给你清晰的行动方向。</p>
              <Link className="button" href="/assessment">
                开始 HUMAN 3.0 评估
              </Link>
              <div className="final-notes" aria-label="评估说明">
                <span>约 10–15 分钟完成</span>
                <span>{content.disclaimer}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
