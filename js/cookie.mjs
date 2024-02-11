export class Cookie {

  static IDLE=0
  static POWERED=1
  static FALLING=2
  static MOVING=3


  ligne=0
  colone=0
  #type=0
  #selected=false
  #state=Cookie.IDLE
  htmlImage=undefined

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.#type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    this.htmlImage = document.createElement("img");
    this.htmlImage.classList.add("cookies");
    this.updateDisplay()
  }

  static random(ligne,colonne){
    return new Cookie(
      this.randomType(),
      ligne,
      colonne
    )
  }

  static randomType(){
    return Math.floor(Math.random()*this.urlsImagesNormales.length)
  }

  #classIf(clazz,condition){
    if(condition){
      this.htmlImage.classList.add(clazz)
    }
    else{
      this.htmlImage.classList.remove(clazz)
    }
  }

  updateDisplay(){
    this.#classIf("cookies-powered",this.state===Cookie.POWERED)
    this.#classIf("cookies-falling",this.state===Cookie.FALLING)
    this.#classIf("cookies-moving",this.state===Cookie.MOVING)
    this.#classIf("cookies-selected",this.selected)
    this.#classIf("cookies-empty",this.type===undefined)


    if(this.selected){
      this.htmlImage.src=Cookie.urlsImagesSurlignees[this.type]
    }
    else{
      this.htmlImage.src=Cookie.urlsImagesNormales[this.type]
    }
  }

  set selected(value) { this.#selected=value ; this.updateDisplay() }
  get selected() { return this.#selected }

  set type(value) { this.#type=value ; this.updateDisplay() }
  get type() { return this.#type }

  set state(value) { this.#state=value ; this.updateDisplay() }
  get state() { return this.#state }

  static swapCookies(c1, c2) {
    let type=c1.type;
    c1.type=c2.type;
    c2.type=type;
    c1.updateDisplay()
  }

  /**
   * Essaye d'échanger deux cookies. Si le swap est possible, les échange et renvoie false.
   * @param {Cookie} c1 
   * @param {Cookie} c2 
   * @param {number=1} maxDistance
   * @returns {Boolean}
   */
  static trySwap(c1,c2,distance){
    if(canSwap(c1,c2,distance)){
      swapCookies(c1,c2)
      return true
    }
    else return false
  }

  /**
   * Vérifie si il est possible de swap.
   * @param {Cookie} c1 
   * @param {Cookie} c2 
   * @param {number=1} maxDistance
   * @returns {Boolean}
   */
  static canSwap(c1,c2,distance){
    if(!distance)distance=1
    return c1!=c2 && c1.type!=c2.type && Cookie.distance(c1,c2)<=distance
  }

  /** renvoie la distance au sens "nombre de cases" 
   * entre deux cookies. Servira pour savoir si on peut
   * swapper deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    return distance;
  }
}
