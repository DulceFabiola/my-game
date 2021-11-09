const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const startGameButton = document.getElementById("start-game-button");
const monsterButton = document.getElementById("monster-button");
// Definir variables globales
let frames = 0;
const kids = [];
const monsterScareArray = [];
let raton = {}; // las coordenadas del ratón
class GameAsset {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = img;
  }

  draw() {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
class Board extends GameAsset {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  draw() {
    // this.x--;
    if (this.x < -this.width) this.x = 0;
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

class CharacterAsset extends GameAsset {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  draw() {
    // this.y = canvas.height - this.height;
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.x--;
  }
  moveRight() {
    this.x++;
  }
  isTouching(obj) {
    return (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y
    );
  }
}

class KidAsset extends CharacterAsset {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }
  draw() {
    this.x--;
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Scare extends GameAsset {
  constructor(x, y, width, height, img, audio) {
    super(x, y, width, height, img);
    this.audio = new Audio();
    this.audio.src = audio;
  }

  draw() {
    this.x++;
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  shootSound() {
    this.audio.volume = 0.2;
    this.audio.play();
  }
}
// Instancias
const boardImage = "https://opengameart.org/sites/default/files/Brick_03.png";
const monsterImage = "../../images/mike.png";
const kidImage = "../../images/boo.png";
const kidCoin = "../../images/kid-coin.png";
const monsterIcon = "../../images/monster-coin.png";
const energyIcon = "../../images/energy-icon.png";
const alert = "../../images/3312.png";
const scareIcon = "../../images/sully-icon.png";
const scareAudio = "../../sounds/grito-mounstruo.mp3";
const gatitoAudio = "../../sounds/boo-gatito.mp3";
const mikeAudio = "../../sounds/mike-wazowski.mp3";
// let monster = new Character(20, 20);
let monsterCanvas = new CharacterAsset(
  0,
  canvas.height / 2,
  100,
  100,
  monsterImage
);
let kidCanvas = new KidAsset(1100, 0, 100, 100, kidImage);
const board = new Board(0, 0, canvas.width, canvas.height, boardImage);
const resourcesMonster = new GameAsset(30, 10, 80, 80, monsterIcon);
const resourcesEnergy = new GameAsset(180, 10, 80, 80, energyIcon);
const alertKid = new GameAsset(320, 10, 80, 80, alert);
// funciones principales
function start() {
  update();
}

function update() {
  // 1. calcular o recalcular el estado
  frames++;
  checkKeys();
  generateKids();
  checkCollitions();
  // 2. Limpiar el canvas
  clearCanvas();
  // 3. Dibujar los elementos
  board.draw();
  monsterCanvas.draw();
  drawKids();
  resourcesMonster.draw();
  resourcesEnergy.draw();
  alertKid.draw();
  requestAnimationFrame(update);
  printScares();

  //Inicia el grito
}

// Funciones de apoyo

function checkCollitions() {
  kids.forEach((kid) => {
    if (monsterCanvas.isTouching(kid)) {
      console.log("Tenemos un 3312");
    }
  });
}

function generateKids() {
  if (frames % 500 === 0) {
    const y = Math.floor(Math.random() * 380);
    let kid = new KidAsset(1100, y, 100, 100, kidImage);
    kids.push(kid);
  }
}

function drawKids() {
  kids.forEach((kid) => kid.draw());
}
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function checkKeys() {
  document.onkeydown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
        monsterCanvas.moveLeft();
        break;
      case "ArrowRight":
        monsterCanvas.moveRight();
        break;
      case " ":
        const monsterScare = new Scare(
          0,
          canvas.height / 2,
          40,
          40,
          scareIcon,
          scareAudio
        );
        monsterScare.shootSound();
        monsterScareArray.push(monsterScare);
        break;
      default:
        break;
    }
  };
}
function printScares() {
  monsterScareArray.forEach((monsterScare) => monsterScare.draw());
}

function generateMonster() {
  console.log("create monster");
}
// Interaccion de usuarios

startGameButton.onclick = start;

//Detectar click dentro del canvas
canvas.addEventListener("click", (event) => {
  const raton = oMousePos(canvas, event);
  //console.log("has hecho click en", raton);
  //context.isPointInPath(raton.x, raton.y)
  if (16 <= raton.x <= 70 && 16 <= raton.y <= 50) {
    //generateMonster();
  } else {
    // console.log("algo mas");
  }
});

// una función para recuperar las coordenadas del ratón
function oMousePos(canvas, event) {
  //Return the size of an element and its position relative to the viewport:
  let ClientRect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - ClientRect.left),
    y: Math.round(event.clientY - ClientRect.top),
  };
}
