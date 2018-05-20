const gameBoard = document.getElementsByClassName("board")[0];
const boardSizeButton = document.getElementById("board-size-button");
const startButton = document.getElementById("start-button");
let gameWidth = document.getElementById("board-width");
let gameHeight = document.getElementById("board-height");
let boardDimension = document.getElementById("board-dimension");
let boardSize = [40, 40];
let keydown = "";

//starts everything
document.addEventListener("DOMContentLoaded", () => {
  createBoard(boardSize[0], boardSize[1]);
  documentEventListeners();
});

//holder function for various document level event listeners
const documentEventListeners = () => {
  //listens to board size input and resizes based on the values
  boardSizeButton.addEventListener("click", () => {
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

  startButton.addEventListener("click", () => {
    loop();
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
      cell.className = "on";
      cell.style.backgroundColor = "green";
      cell.addEventListener("click", () => {
        clickBit(cell);
      });
      cell.addEventListener("mouseover", e => {
        if (keydown === 67) {
          cell.style.backgroundColor = "yellow";
        } else if (keydown === 88) {
          cell.style.backgroundColor = "green";
        }
      });
      gameBoard.appendChild(cell);
    }
  }
  boardSize = [width, height];
  boardDimension.innerText = `Current Board is ${boardSize[0]} by ${boardSize[1]}`;
};

const clickBit = cell => {
  if (cell.style.backgroundColor === "green") {
    cell.style.backgroundColor = "yellow";
  } else {
    cell.style.backgroundColor = "green";
  }
};

const loop = () => {
  for (let i = 0; i < boardSize[1]; i++) {
    console.log("started");
    for (let j = 0; j < boardSize[0]; j++) {
      console.log("inside");
    }
  }
};

//settimeout, do the loop every '0.5' seconds or however long is right, each iteration swap adjacent cells if this cell is selected. modify button to change text and stop the loop.
