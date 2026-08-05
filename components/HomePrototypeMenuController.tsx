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

    function closeMenu({ restoreFocus = false }: { restoreFocus?: boolean } = {}) {
      menuEl.dataset.open = "false";
      menuEl.dataset.view = "root";
      buttonEl.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-detail");
      setBodyLock(false);
      if (restoreFocus) {
        buttonEl.focus();
      }
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

    const keydownListener = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || menuEl.dataset.open !== "true") return;

      event.preventDefault();
      closeMenu({ restoreFocus: true });
    };
    const closeMenuListener = () => closeMenu();

    buttonEl.addEventListener("click", openMenu);
    closeButtonEl.addEventListener("click", closeMenuListener);
    backButtonEl.addEventListener("click", backToRoot);
    links.forEach((link) => link.addEventListener("click", closeMenuListener));
    document.addEventListener("keydown", keydownListener);

    return () => {
      buttonEl.removeEventListener("click", openMenu);
      closeButtonEl.removeEventListener("click", closeMenuListener);
      backButtonEl.removeEventListener("click", backToRoot);
      links.forEach((link) => link.removeEventListener("click", closeMenuListener));
      document.removeEventListener("keydown", keydownListener);
      moduleListeners.forEach((remove) => remove());
      document.body.classList.remove("menu-open", "menu-detail");
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}
