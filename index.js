const gameBoard = document.getElementsByClassName("board")[0];
const boardSizeButton = document.getElementById("board-size-button");
const startButton = document.getElementById("start-button");
let gameWidth = document.getElementById("board-width");
let gameHeight = document.getElementById("board-height");
let boardDimension = document.getElementById("board-dimension");
let boardSize = [10, 10];
let keydown = "";
let interval;
let running = false;
let speed = 1000;

//starts everything
document.addEventListener("DOMContentLoaded", () => {
  createBoard(boardSize[0], boardSize[1]);
  documentEventListeners();
});

//holder function for various document level event listeners
const documentEventListeners = () => {
  //listens to board size input and resizes based on the values
  boardSizeButton.addEventListener("click", e => {
    e.preventDefault();
    if (gameWidth.value === "") {
      gameWidth.value = boardSize[0];
    }
    if (gameHeight.value === "") {
      gameHeight.value = boardSize[1];
    }
    createBoard(gameWidth.value, gameHeight.value);
    gameWidth.value = "";
    gameHeight.value = "";
  });

  //'c' and 'x', when held, allow for multiple selection of cells as you mouse over them. (c, all to yellow, x, all to green)
  document.addEventListener("keydown", e => {
    keydown = e.which;
  });
  document.addEventListener("keyup", () => {
    keydown = "";
  });

  //starts the game loop
  startButton.addEventListener("click", addInterval);
};

//toggles start button text and event listener to start/stop the game
const addInterval = () => {
  running = true;
  startButton.innerText = "Stop";
  interval = setInterval(loop, speed);
  startButton.removeEventListener("click", addInterval);
  let resetInterval = startButton.addEventListener("click", () => {
    clearInterval(interval);
    running = false;
    startButton.innerText = "Start!";
    startButton.removeEventListener("click", resetInterval);
    startButton.addEventListener("click", addInterval);
  });
};

//creates and populates the current gameboard with 10x10 pixel cells
const createBoard = (width, height) => {
  gameBoard.innerHTML = "";
  if (width < 10) {
    width = 10;
  }
  if (width > 100) {
    width = 100;
  }
  if (height < 10) {
    height = 10;
  }
  if (height > 100) {
    height = 100;
  }
  gameBoard.style.width = width * 10 + "px";
  gameBoard.style.height = height * 10 + "px";
  for (let i = 0; i < height * 10; i += 10) {
    for (let j = 0; j < width * 10; j += 10) {
      let cell = document.createElement("div");
      addStyle(cell, i, j);
      cell.addEventListener("click", () => {
        clickBit(cell);
      });
      cell.addEventListener("mouseover", () => {
        mouseOver(cell);
      });
      gameBoard.appendChild(cell);
    }
  }
  boardSize = [width, height];
  boardDimension.innerText = `Current Board is ${boardSize[0]} by ${boardSize[1]}`;
};

const addStyle = (cell, i, j) => {
  cell.style.height = "10px";
  cell.style.width = "10px";
  cell.style.float = "left";
  cell.alive = false;
  cell.id = `${i / 10}a${j / 10}`;
  cell.style.backgroundColor = "green";
};

//event listener function for changing a cell with a single click
const clickBit = cell => {
  if (cell.alive === false && !running) {
    cell.alive = true;
    cell.style.backgroundColor = "yellow";
  } else if (cell.alive === true && !running) {
    cell.alive = false;
    cell.style.backgroundColor = "green";
  }
};

//event listener function for changing multiple cells on dragover
const mouseOver = cell => {
  if (keydown === 67 && !cell.alive && !running) {
    cell.alive = true;
    cell.style.backgroundColor = "yellow";
  } else if (keydown === 88 && cell.alive && !running) {
    cell.alive = false;
    cell.style.backgroundColor = "green";
  }
};

//main game logic
const loop = () => {
  let neighbors;
  for (let i = 0; i < boardSize[1]; i++) {
    for (let j = 0; j < boardSize[0]; j++) {
      neighbors = checkNeighbors(i, j);
      let cell = document.getElementById(`${i}a${j}`);
      if (cell.style.backgroundColor === "yellow") {
        cell.style.backgroundColor = "green";
      } else if (cell.style.backgroundColor === "green") {
        cell.style.backgroundColor = "yellow";
      }
    }
  }
};

const checkNeighbors = () => {
  let result;
};

//settimeout, do the loop every '0.5' seconds or however long is right, each iteration swap adjacent cells if this cell is selected. modify button to change text and stop the loop.
