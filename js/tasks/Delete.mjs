import { BaseTask } from "../task.js";
import { FallTask } from "./Falling.mjs";
import { Cookie } from "../cookie.mjs";

let currentScore = 0;
let scoreDisplayElement = document.querySelector("#score");

let addedScore = 0;
let scoreMultiplier = 0;
let addedScoreDisplayElement = document.querySelector("#score_added");

export function setScore(newScore) {
  currentScore = newScore;
  scoreDisplayElement.innerHTML = "Score: " + currentScore;
}

export function getScore() {
  return currentScore;
}

export function setScoreMultiplier(newScoreMultiplier) {
  scoreMultiplier = newScoreMultiplier;
  addScore(0);
}

export function getScoreMultiplier() {
  return scoreMultiplier;
}

export function addScore(newScore) {
  // Add to added score
  addedScore += newScore;
  addedScoreDisplayElement.innerHTML =
    "X" + scoreMultiplier + " +" + addedScore;

  // Set score style
  let style;
  if (addedScore > 8000) style = 7;
  else if (addedScore > 3000) style = 6;
  else if (addedScore > 1000) style = 5;
  else if (addedScore > 500) style = 4;
  else if (addedScore > 200) style = 3;
  else if (addedScore > 100) style = 2;
  else style = 1;

  addedScoreDisplayElement.classList.remove(
    "overlay-1",
    "overlay-2",
    "overlay-3",
    "overlay-4",
    "overlay-5",
    "overlay-6",
    "overlay-7"
  );
  addedScoreDisplayElement.classList.add("overlay-" + style);
}

export function resolveScore() {
  setScore(getScore() + addedScore);
  addedScore = 0;
  scoreMultiplier = 0;
  addedScoreDisplayElement.innerHTML = "";
}

export class KillTask extends BaseTask {
  constructor() {
    super();
  }

  /** @override */
  start(manager) {
    if (scoreMultiplier == 0) scoreMultiplier = 5;
    else scoreMultiplier *= 2;

    setTimeout(() => {
      manager.forEach((cookie, y, x) => {
        if (cookie.state === Cookie.POWERED) {
          cookie.state = Cookie.IDLE;
          cookie.type = undefined;
          addScore(scoreMultiplier);
        }
      });
      manager.task = new FallTask();
    }, 500);
  }
}
export const KILL_TASK = new KillTask();
