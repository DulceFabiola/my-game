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
    this.x--;
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

// Instancias
const boardImage = "https://opengameart.org/sites/default/files/Brick_03.png";
const monsterImage = "../../images/mike.png";
const kidImage = "../../images/boo.png";
let monster = new Character(20, 20);
let monsterCanvas = new GameAsset(20, 20, 100, 100, monsterImage);
let kidCanvas = new GameAsset(1100, 0, 100, 100, kidImage);
const board = new Board(0, 0, canvas.width, canvas.height, boardImage);

// funciones principales
function start() {
  update();
}

function update() {
  // 1. calcular o recalcular el estado
  frames++;
  // 2. Limpiar el canvas
  clearCanvas();
  // 3. Dibujar los elementos
  board.draw();
  monsterCanvas.draw();
  kidCanvas.draw();
  requestAnimationFrame(update);
}

// Funciones de apoyo

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
// Interaccion de usuarios

startGameButton.onclick = start;
