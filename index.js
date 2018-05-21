const gameBoard = document.getElementsByClassName("board")[0];
const boardSizeButton = document.getElementById("board-size-button");
const startButton = document.getElementById("start-button");
let gameWidth = document.getElementById("board-width");
let gameHeight = document.getElementById("board-height");
let boardDimension = document.getElementById("board-dimension");
let boardSize = [40, 40];
let keydown = "";
let interval;
let isRunning = false;
let speed = 300;
let tempBoard = [];

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
  isRunning = true;
  startButton.innerText = "Stop";
  interval = setInterval(loop, speed);
  startButton.removeEventListener("click", addInterval);
  let resetInterval = startButton.addEventListener("click", () => {
    clearInterval(interval);
    isRunning = false;
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
    tempBoard.push([]);
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
  if (cell.alive === false && !isRunning) {
    cell.alive = true;
    cell.style.backgroundColor = "yellow";
  } else if (cell.alive === true && !isRunning) {
    cell.alive = false;
    cell.style.backgroundColor = "green";
  }
};

//event listener function for changing multiple cells on dragover
const mouseOver = cell => {
  if (keydown === 67 && !cell.alive && !isRunning) {
    cell.alive = true;
    cell.style.backgroundColor = "yellow";
  } else if (keydown === 88 && cell.alive && !isRunning) {
    cell.alive = false;
    cell.style.backgroundColor = "green";
  }
};

//main game logic
//I don't like running the same loop twice, especially because its O(n^2) complexity, but modifying the cells as it runs messed up the logic
//(cells were changed and then tallied up in later iterations). I could rewrite the DOM every time, wiping the board and repopulating with new elements, but that seemed cumbersome.
const loop = () => {
  for (let i = 0; i < boardSize[1]; i++) {
    for (let j = 0; j < boardSize[0]; j++) {
      tempBoard[i][j] = checkNeighbors(i, j);
    }
  }
  //rules
  //Any live cell with fewer than two live neighbors dies, as if by under population.
  //Any live cell with two or three live neighbors lives on to the next generation.
  //Any live cell with more than three live neighbors dies, as if by overpopulation.
  //Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  for (let i = 0; i < boardSize[1]; i++) {
    for (var j = 0; j < boardSize[0]; j++) {
      let cell = document.getElementById(`${i}a${j}`);
      if (cell.alive) {
        if (tempBoard[i][j] - 1 < 2) {
          cell.alive = false;
          cell.style.backgroundColor = "green";
        } else if (tempBoard[i][j] - 1 > 3) {
          cell.alive = false;
          cell.style.backgroundColor = "green";
        } else if (tempBoard[i][j] === 2 || tempBoard[i][j] === 3) {
          cell.alive = true;
          cell.style.backgroundColor = "yellow";
        }
      } else {
        if (tempBoard[i][j] === 3) {
          cell.alive = true;
          cell.style.backgroundColor = "yellow";
        }
      }
    }
  }
};

//checks and tallies all alive neighbors, including itself
//If there's a way to exclude specific values from the conditional, like '... !== null && (dx !== 0 && dy !== 0)', let me know.
//That looks like it should work, but didn't.
const checkNeighbors = (i, j) => {
  let result = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (
        document.getElementById(`${i + dx}a${j + dy}`) !== null
        // && (dx !== 0 && dy !== 0)
      ) {
        if (document.getElementById(`${i + dx}a${j + dy}`).alive) {
          result += 1;
        }
      }
    }
  }
  return result;
};

//give speed up option, and allow changes to live/dead cells
