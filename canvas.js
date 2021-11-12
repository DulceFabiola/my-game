//Definición variables DOM
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const startGameButton = document.getElementById("start-game-button");
const monsterButton = document.getElementById("monster-button");
// Definir variables globales
let intervalId;
let frames = 0;
const kids = [];
const monsterScareArray = [];
let raton = {}; // guardar las coordenadas del ratón
let isGameOver = false;
let points = 150;
let alert3312 = 0;
const monsters = [];
const boardImage = "https://opengameart.org/sites/default/files/Brick_03.png";
const gameOverImage = "/images/game-over.jpg";
const youWinImage = "/images/you-win.jpg";
const monsterImage = "/images/mike.png";
const sullyImage = "/images/sullivan.png";
const randallImage = "/images/randall.png";
const kidImage = "/images/boo.png";
const monsterIcon = "/images/monster-coin.png";
const energyIcon = "/images/energy-icon.png";
const alert = "/images/3312.png";
const scareIcon = "/images/sully-icon.png";
const scareAudio = "../../sounds/grito-mounstruo.mp3";
const gatitoAudio = "../../sounds/boo-gatito.mp3";
const gameOverAudio = "../../sounds/musical-game-over.wav";
const monsterImageArray = [monsterImage, sullyImage, randallImage];
let level = 1;
let speedKid = 400;
//Generacion de clases
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
  constructor(x, y, width, height, img, audio) {
    super(x, y, width, height, img);
    this.audio = new Audio();
    this.audio.src = audio;
  }

  draw() {
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

  shootSound() {
    this.audio.volume = 0.2;
    this.audio.play();
  }
}

class Character extends GameAsset {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  draw() {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.x--;
  }
  moveRight() {
    this.x++;
  }
  moveUp() {
    this.y--;
  }
  moveDown() {
    this.y++;
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

class Kid extends Character {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }
  draw() {
    this.x--;
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Scare extends Character {
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
  isTouching(obj) {
    return (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y
    );
  }
}
// Instancias de las clases
const board = new Board(
  0,
  0,
  canvas.width,
  canvas.height,
  boardImage,
  gatitoAudio
);
const boardGameOver = new Board(
  0,
  0,
  canvas.width,
  canvas.height,
  gameOverImage,
  gameOverAudio
);
const boardYouWin = new Board(
  0,
  0,
  canvas.width,
  canvas.height,
  youWinImage,
  gatitoAudio
);
const resourcesMonster = new GameAsset(30, 10, 80, 80, monsterIcon);
const resourcesEnergy = new GameAsset(180, 10, 80, 80, energyIcon);
const alertKid = new GameAsset(320, 10, 80, 80, alert);

// funciones principales
function start() {
  if (intervalId) return;
  update();
}

function update() {
  // 1. calcular o recalcular el estado
  frames++;
  gameOver();
  youWin();
  generateKids();
  checkCollitions();
  // 2. Limpiar el canvas
  clearCanvas();
  // 3. Dibujar los elementos
  board.draw();
  drawKids();
  resourcesMonster.draw();
  resourcesEnergy.draw();
  alertKid.draw();
  printScore();
  print3312();
  printLevel();
  drawMonsters();
  requestAnimationFrame(update);
  printScares();
  gameOver();
  youWin();
}

// Funciones de apoyo
function gameOver() {
  if (isGameOver) {
    boardGameOver.draw();
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
}
function youWin() {
  if (points >= 250) {
    level = 2;
  }
  if (points >= 350) {
    boardYouWin.draw();
    context.font = "40px sans-serif";
    context.fillStyle = "white";
    context.fillText(
      `Has mandado a dormir a todos los niños, HAS GANADO`,
      canvas.width / 8,
      canvas.height - 100
    );
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
}

function generateKids() {
  if (level > 1) {
    speedKid = 100;
  }
  if (frames % speedKid === 0) {
    const y = Math.floor(Math.random() * 380);
    let kid = new Kid(1100, y, 100, 100, kidImage);
    kids.push(kid);
  }
  // Nos aseguramos de solo tener los kids que se muestran en pantalla
  kids.forEach((kid, index) => {
    if (kid.x + kid.width < 0) {
      kids.splice(1, index);
    }
  });
}

function drawKids() {
  kids.forEach((kid) => kid.draw());
}
function generateMonster(x, y) {
  const monsterImg =
    monsterImageArray[Math.floor(Math.random() * monsterImageArray.length)];
  let monsterCanvas = new Character(x, y, 100, 100, monsterImg);
  monsters.push(monsterCanvas);
  generateScare(x, y);
  points -= 20;
}
function drawMonsters() {
  monsters.forEach((monster) => {
    if (points >= 20) {
      monster.draw();
    } else {
      context.font = "40px sans-serif";
      context.fillText(
        `Energía insuficiente para llamar a un monstruo`,
        canvas.width / 6,
        canvas.height / 2
      );
    }
  });
}

function generateScare(x, y) {
  const monsterScare = new Scare(x, y, 40, 40, scareIcon, scareAudio);
  monsterScare.shootSound();
  monsterScareArray.push(monsterScare);
}
function printScares() {
  monsterScareArray.forEach((monsterScare) => monsterScare.draw());
}

function checkCollitions() {
  kids.forEach((kid, i) => {
    monsters.forEach((monster, index) => {
      if (monster.isTouching(kid)) {
        kids.splice(i, 1);
        monsters.splice(index, 1);
        points -= 5;
        alert3312++;
      } else {
        monsterScareArray.forEach((scare, index) => {
          if (scare.isTouching(kid)) {
            kids.splice(i, 1);
            monsterScareArray.splice(index, 1);
            points += 50;
          }
        });
      }
    });
  });
  if (points <= 0 || alert3312 >= 5) {
    clearInterval(intervalId);
    isGameOver = true;
  }
}
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function printScore() {
  context.font = "20px sans-serif";
  context.fillStyle = "white";
  context.fillText(`SCORE:${points} W`, 160, 100);
}
function print3312() {
  context.font = "20px sans-serif";
  context.fillStyle = "white";
  context.fillText(`ALERT 3312:${alert3312}`, 310, 100);
}
function printLevel() {
  context.font = "20px sans-serif";
  context.fillStyle = "white";
  context.fillText(`LEVEL:${level}`, 30, 100);
}

// Interaccion de usuarios
startGameButton.onclick = start;

//Detectar click dentro del canvas
canvas.addEventListener("click", (event) => {
  const raton = oMousePos(canvas, event);
  generateMonster(raton.x, raton.y);
});

// función para recuperar las coordenadas del ratón
function oMousePos(canvas, event) {
  // regresa el tamaño de un elemento y lo posiciona relativamente al viewport
  let ClientRect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - ClientRect.left),
    y: Math.round(event.clientY - ClientRect.top),
  };
}
