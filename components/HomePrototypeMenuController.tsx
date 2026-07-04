"use client";

import { useEffect } from "react";

export function HomePrototypeMenuController() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-prototype");
    const button = root?.querySelector<HTMLButtonElement>(".menu-button");
    const menu = root?.querySelector<HTMLElement>(".mobile-menu");
    const closeButton = root?.querySelector<HTMLButtonElement>(".mobile-menu-close");
    const backButton = root?.querySelector<HTMLButtonElement>(".mobile-back");
    const modules = Array.from(
      root?.querySelectorAll<HTMLButtonElement>(".mobile-module") ?? [],
    );
    const links = Array.from(
      root?.querySelectorAll<HTMLAnchorElement>(".mobile-subitem") ?? [],
    );

    if (!root || !button || !menu || !closeButton || !backButton) return;

    const rootEl = root;
    const buttonEl = button;
    const menuEl = menu;
    const closeButtonEl = closeButton;
    const backButtonEl = backButton;

    function setBodyLock(isLocked: boolean) {
      document.body.classList.toggle("menu-open", isLocked);
      document.body.style.overflow = isLocked ? "hidden" : "";
    }

    function setDetail(key: string) {
      menuEl.dataset.view = "detail";
      document.body.classList.add("menu-detail");
      rootEl.querySelectorAll<HTMLElement>(".mobile-subitems").forEach((panel) => {
        panel.dataset.active = String(panel.dataset.panel === key);
      });
    }

    function openMenu() {
      menuEl.dataset.open = "true";
      menuEl.dataset.view = "root";
      buttonEl.setAttribute("aria-expanded", "true");
      document.body.classList.remove("menu-detail");
      setBodyLock(true);
    }

    function closeMenu() {
      menuEl.dataset.open = "false";
      menuEl.dataset.view = "root";
      buttonEl.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-detail");
      setBodyLock(false);
    }

    function backToRoot() {
      menuEl.dataset.view = "root";
      document.body.classList.remove("menu-detail");
    }

    const moduleListeners = modules.map((module) => {
      const listener = () => setDetail(module.dataset.menuKey ?? "overview");
      module.addEventListener("click", listener);
      return () => module.removeEventListener("click", listener);
    });

    buttonEl.addEventListener("click", openMenu);
    closeButtonEl.addEventListener("click", closeMenu);
    backButtonEl.addEventListener("click", backToRoot);
    links.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      buttonEl.removeEventListener("click", openMenu);
      closeButtonEl.removeEventListener("click", closeMenu);
      backButtonEl.removeEventListener("click", backToRoot);
      links.forEach((link) => link.removeEventListener("click", closeMenu));
      moduleListeners.forEach((remove) => remove());
      document.body.classList.remove("menu-open", "menu-detail");
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}
