"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MenuKey = "overview" | "assessment" | "result" | "support";

const menuGroups: Array<{
  key: MenuKey;
  label: string;
  labelEn: string;
  kicker: string;
  title: string;
  columns: Array<{
    title: string;
    links: Array<{ label: string; href: string; tag?: string }>;
  }>;
}> = [
  {
    key: "overview",
    label: "概览",
    labelEn: "Overview",
    kicker: "Overview",
    title: "理解 HUMAN 3.0 的四象限模型。",
    columns: [
      {
        title: "模型",
        links: [
          { label: "为什么需要", href: "/#why", tag: "模型" },
          { label: "四象限", href: "/#quadrants", tag: "系统" },
        ],
      },
      {
        title: "层级",
        links: [
          { label: "发展层级", href: "/#levels", tag: "层级" },
          { label: "假性改变", href: "/#false-transformation", tag: "辨识" },
        ],
      },
      {
        title: "入口",
        links: [
          { label: "首页", href: "/", tag: "首页" },
          { label: "报告预览", href: "/#preview", tag: "结果" },
        ],
      },
    ],
  },
  {
    key: "assessment",
    label: "测试",
    labelEn: "Assessment",
    kicker: "Assessment",
    title: "完成 48 题，生成当前状态。",
    columns: [
      {
        title: "当前",
        links: [
          { label: "继续答题", href: "/assessment", tag: "当前" },
          { label: "查看进度", href: "/assessment", tag: "进度" },
        ],
      },
      {
        title: "说明",
        links: [
          { label: "评估流程", href: "/#flow", tag: "说明" },
          { label: "测量象限", href: "/#quadrants", tag: "象限" },
        ],
      },
      {
        title: "状态",
        links: [
          { label: "自动保存", href: "/assessment", tag: "保存" },
          { label: "重新开始", href: "/assessment", tag: "重测" },
        ],
      },
    ],
  },
  {
    key: "result",
    label: "结果",
    labelEn: "Result",
    kicker: "Result",
    title: "查看阶段、卡点和下一步行动。",
    columns: [
      {
        title: "报告",
        links: [
          { label: "查看结果", href: "/result", tag: "报告" },
          { label: "四象限状态", href: "/result#dimensions", tag: "象限" },
        ],
      },
      {
        title: "分析",
        links: [
          { label: "整体阶段", href: "/result#state", tag: "阶段" },
          { label: "状态模式", href: "/result#pattern", tag: "模式" },
        ],
      },
      {
        title: "行动",
        links: [
          { label: "下一步行动", href: "/result#next", tag: "行动" },
          { label: "分享卡片", href: "/result#share", tag: "分享" },
        ],
      },
    ],
  },
  {
    key: "support",
    label: "支持",
    labelEn: "Support",
    kicker: "Support",
    title: "边界、帮助和产品说明。",
    columns: [
      {
        title: "帮助",
        links: [
          { label: "常见问题", href: "/#final", tag: "帮助" },
          { label: "反馈问题", href: "/#final", tag: "反馈" },
        ],
      },
      {
        title: "边界",
        links: [
          { label: "非诊断声明", href: "/#final", tag: "边界" },
          { label: "隐私说明", href: "/#final", tag: "隐私" },
        ],
      },
      {
        title: "联系",
        links: [
          { label: "支持入口", href: "/#final", tag: "支持" },
          { label: "返回首页", href: "/", tag: "首页" },
        ],
      },
    ],
  },
];

export function SiteNav({ current = "overview" }: { current?: MenuKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<MenuKey>("overview");
  const activeGroup =
    menuGroups.find((group) => group.key === activeKey) ?? menuGroups[0];

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-detail", isOpen && activeKey !== "overview");
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.classList.remove("menu-open", "menu-detail");
      document.body.style.overflow = "";
    };
  }, [activeKey, isOpen]);

  function closeMenu() {
    setIsOpen(false);
    setActiveKey("overview");
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          HUMAN 3.0
        </Link>
        <nav className="nav" aria-label="主导航">
          {menuGroups.map((group) => (
            <div className="nav-item" key={group.key}>
              <button className="nav-trigger" type="button">
                {group.label}
              </button>
              <div className="submenu">
                <div className="submenu-inner">
                  <div>
                    <div className="submenu-kicker">{group.kicker}</div>
                    <div className="submenu-title">{group.title}</div>
                  </div>
                  {group.columns.map((column) => (
                    <div className="submenu-column" key={column.title}>
                      <span>{column.title}</span>
                      {column.links.map((link) => (
                        <Link key={`${group.key}-${link.label}`} href={link.href}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label="打开菜单"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(true)}
        >
          ≡
        </button>
      </div>
      <nav
        className="mobile-menu"
        id="mobile-menu"
        data-open={isOpen}
        data-view={isOpen && activeKey !== "overview" ? "detail" : "root"}
        aria-label="移动端菜单"
      >
        <button
          className="mobile-menu-close"
          type="button"
          aria-label="关闭菜单"
          onClick={closeMenu}
        >
          ×
        </button>
        <div className="mobile-menu-track">
          <div className="mobile-menu-screen">
            <div className="mobile-menu-heading">Menu</div>
            {menuGroups.map((group) => (
              <button
                className="mobile-module"
                type="button"
                key={group.key}
                aria-current={current === group.key ? "page" : undefined}
                onClick={() => setActiveKey(group.key)}
              >
                {group.label} <span>{group.labelEn}</span>
              </button>
            ))}
          </div>
          <div className="mobile-menu-screen">
            <button
              className="mobile-back"
              type="button"
              onClick={() => setActiveKey("overview")}
            >
              ‹ 返回
            </button>
            <div className="mobile-detail-title">{activeGroup.label}</div>
            {menuGroups.map((group) => (
              <div
                className="mobile-subitems"
                data-active={group.key === activeKey}
                data-panel={group.key}
                key={group.key}
              >
                {group.columns.flatMap((column) =>
                  column.links.slice(0, 1).map((link) => (
                    <Link
                      className="mobile-subitem"
                      href={link.href}
                      key={`${group.key}-${column.title}`}
                      onClick={closeMenu}
                    >
                      {link.label} <span>{link.tag ?? column.title}</span>
                    </Link>
                  )),
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
