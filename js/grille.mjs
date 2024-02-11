import { Cookie } from "./cookie.mjs";
import { TaskManager } from "./task.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille extends TaskManager {

  /** Callback appelée quand le joueur click sur un cookie */
  onCookieClick;

  /** Callback appelée quand le joueur fait glisser un cookie sur un autres */
  onCookieDrag;

  /**
   * Constructeur de la grille
   * @param {number} width nombre de collone
   * @param {number} height nombre de colonnes
   */
  constructor(width, height) {
    super()
    this.width = width;
    this.height = height;

    this.tabcookies = this.remplirTableauDeCookies()
  }

  get h(){ return this.height}

  get w(){ return this.width}


  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    const caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      const x = index % this.width;
      const y = Math.floor(index / this.width); 

      const cookie = this.tabcookies[x][y];
      const img = cookie.htmlImage;

      img.onclick = _ => { if(this.onCookieClick) this.onCookieClick(cookie,x,y) }

      img.ondragover = _ => { event.preventDefault() }

      img.ondragstart = _ => { this.dragFrom={cookie, x, y} }

      img.ondrop = _ => {
        if(this.onCookieDrag){
          if(this.dragFrom){
            this.onCookieDrag(this.dragFrom.cookie, this.dragFrom.x, this.dragFrom.y, cookie, x, y)
            this.dragFrom=undefined
          }
        }
      }

      div.appendChild(img);
    });
    
  }

  get(x, y) {
    return this.tabcookies[x][y];
  }

  safe_get(x, y) {
    if(x<0 || x>=this.width || y<0 || y>=this.height)return undefined
    else return this.get(x,y);
  }
  
  remplirTableauDeCookies() {
    const tab = create2DArray(9);
    for(let width = 0; width < this.width; width++) {
      for(let height =0; height < this.height; height++) {
        tab[width][height] = Cookie.random(width, height);
      }
    }

    return tab;
  }

  forEach(callback) {
    for(let x = 0; x < this.w; x++) {
      for(let y =0; y < this.h; y++) {
        callback(this.get(x,y), x, y);
      }
    }
  }

}