const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const startGameButton = document.getElementById("start-game-button");
// Definir variables globales
let frames = 0;
const kids = [];
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

// Instancias
const boardImage = "https://opengameart.org/sites/default/files/Brick_03.png";
const monsterImage = "../../images/mike.png";
const kidImage = "../../images/boo.png";
// let monster = new Character(20, 20);
let monsterCanvas = new CharacterAsset(20, 20, 100, 100, monsterImage);
let kidCanvas = new KidAsset(1100, 0, 100, 100, kidImage);
const board = new Board(0, 0, canvas.width, canvas.height, boardImage);

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
  // kidCanvas.draw();
  drawKids();
  requestAnimationFrame(update);
}

// Funciones de apoyo

function checkCollitions() {
  kids.forEach((kid) => {
    if (monsterCanvas.isTouching(kid)) {
      alert("Tenemos un 3312");
    }
  });
}

function generateKids() {
  if (frames % 200 === 0) {
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
        kidCanvas.moveLeft();
        break;
      case "ArrowRight":
        kidCanvas.moveRight();
        break;

      default:
        break;
    }
  };
}

// Interaccion de usuarios

startGameButton.onclick = start;
