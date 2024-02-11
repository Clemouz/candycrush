import { Cookie } from "./cookie.mjs";

/**
 * Find a line of cookies starting at (x,y) and going in the direction (vx,vy)
 * Return its length - 1
 */
export function findLineAt(manager, startX, startY, vx, vy) {
  let count = 0;
  let type = manager.safe_get(startX, startY).type;

  let xx = startX + vx;
  let yy = startY + vy;
  while (manager.safe_get(xx, yy)?.type == type) {
    count++;
    xx += vx;
    yy += vy;
  }

  return count;
}

/**
 * Find cookies centered at (x,y) and going in directions (vx,vy) and (-vx,-vy) then
 * tag the cookies if the line is at least long
 */
export function tagLine(manager, length, startX, startY, vx, vy) {
  let c1 = findLineAt(manager, startX, startY, vx, vy);
  let c2 = findLineAt(manager, startX, startY, -vx, -vy);
  if (c1 + c2 + 1 >= length) {
    for (let i = 1; i <= c1; i++) {
      let cookie = manager.safe_get(startX + i * vx, startY + i * vy);
      if (cookie) cookie.state = Cookie.POWERED;
    }
    for (let i = 1; i <= c2; i++) {
      let cookie = manager.safe_get(startX - i * vx, startY - i * vy);
      if (cookie) cookie.state = Cookie.POWERED;
    }
    manager.get(startX, startY).state = Cookie.POWERED;
    return true;
  }
  return false;
}

export function tagAll(manager, length, startX, startY) {
  let a = tagLine(manager, length, startX, startY, 1, 0);
  let b = tagLine(manager, length, startX, startY, 0, 1);
  //let c= this.#tagLine(manager, length, x, y, 1, 1)
  //let d= this.#tagLine(manager, length, x, y, 1, -1)
  return a || b;
}
