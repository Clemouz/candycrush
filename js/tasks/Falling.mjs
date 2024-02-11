import { BaseTask } from "../task.js";
import { SwapTask } from "./Swap.mjs";
import { KillTask } from "./Delete.mjs";
import { Cookie } from "../cookie.mjs";
import { tagAll } from "../combine.mjs";
import { resolveScore } from "./Delete.mjs";

export class FallTask extends BaseTask {
  /** @override */
  start(manager) {
    this.fallAll(manager);
  }

  async fallAll(manager) {
    // Make everything fall
    let fallen = true;
    while (fallen) {
      fallen = false;
      for (let x = 0; x < manager.width; x++) {
        if (this.#fall(manager, x)) fallen ||= true;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Remove all falling states
      manager.forEach((cookie, x, y) => {
        cookie.state = Cookie.IDLE;
      });
    }

    // Verify if there is a match
    let match = false;
    manager.forEach((cookie, x, y) => {
      if (tagAll(manager, 3, x, y)) {
        match ||= true;
      }
    });

    // Swap to according task
    if (match) {
      manager.task = new KillTask();
    } else {
      resolveScore();
      manager.task = new SwapTask();
    }
  }

  #fall(manager, x) {
    let ret = false;
    for (let y = manager.height - 1; y >= 0; y--) {
      const cookie = manager.safe_get(x, y);
      const up_cookie = manager.safe_get(x, y - 1);
      if (cookie.type === undefined) {
        cookie.state = Cookie.FALLING;
        if (up_cookie) {
          cookie.type = up_cookie.type;
          up_cookie.type = undefined;
        } else {
          cookie.type = Cookie.randomType();
        }
        ret = true;
      }
    }
    return ret;
  }
}
