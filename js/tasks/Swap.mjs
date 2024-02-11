import { BaseTask } from "../task.js";
import { Cookie } from "../cookie.mjs";
import { KillTask } from "./Delete.mjs";
import { tagAll } from "../combine.mjs";

export class SwapTask extends BaseTask {
  lastCookie;

  start(manager) {
    manager.onCookieClick = (cookie, _x, _y) => {
      if (this.lastCookie == cookie) {
        this.select(undefined);
      }
      if (this.lastCookie && Cookie.canSwap(this.lastCookie, cookie)) {
        const a = this.lastCookie;
        const b = cookie;
        this.select(undefined);
        Cookie.swapCookies(a, b);
        const flag = tagAll(manager, 3, a.ligne, a.colonne, 1, 0);
        const flag2 = tagAll(manager, 3, b.ligne, b.colonne, 0, 1);
        if (flag || flag2) manager.task = new KillTask();
      } else this.select(cookie);
    };

    manager.onCookieDrag = (cookie1, x1, y1, cookie2, x2, y2) => {
      if (Cookie.canSwap(cookie1, cookie2)) {
        Cookie.swapCookies(cookie1, cookie2);
        const flag = tagAll(manager, 3, x1, y1, 1, 0);
        const flag2 = tagAll(manager, 3, x2, y2, 0, 1);
        if (flag || flag2) manager.task = new KillTask();
      }
    };
  }

  stop(manager) {
    manager.onCookieClick = undefined;
    manager.onCookieDrag = undefined;
    this.select(undefined);
  }

  select(cookie) {
    if (this.lastCookie) {
      this.lastCookie.selected = false;
    }
    if (cookie) {
      cookie.selected = true;
    }
    this.lastCookie = cookie;
  }
}
