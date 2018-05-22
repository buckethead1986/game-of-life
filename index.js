const gameBoard = document.getElementsByClassName("board")[0];
const boardOptionsButton = document.getElementById("board-options-button");
const startButton = document.getElementById("start-button");
const showOptionsButton = document.getElementById("showOptions");
const optionsDiv = document.getElementById("options");
let gameWidth = document.getElementById("board-width");
let gameHeight = document.getElementById("board-height");
let liveColorChange = document.getElementById("live-color");
// let deadColorChange = document.getElementById("dead-color");
let speedChange = document.getElementById("speed");
let boardDimension = document.getElementById("board-dimension");
let boardSize = [40, 40];
let keydown = "";
let interval;
let isRunning = false;
let speed = 200;
let tempBoard = [];
let liveColor = "grey";
let deadColor = "black";

//starts everything
document.addEventListener("DOMContentLoaded", () => {
  createBoard(boardSize[0], boardSize[1]);
  documentEventListeners();
});

//holder function for various document level event listeners
const documentEventListeners = () => {
  //listens to board size input and resizes based on the values
  boardOptionsButton.addEventListener("click", e => {
    e.preventDefault();
    boardOptions(e);
  });

  //'c' and 'x', when held, allow for multiple selection of cells as you mouse over them. (c, all to liveColor, x, all to deadColor)
  document.addEventListener("keydown", e => {
    keydown = e.which;
  });
  document.addEventListener("keyup", () => {
    keydown = "";
  });

  //starts the game loop
  startButton.addEventListener("click", addInterval);

  //additional options hide/show toggle
  showOptionsButton.addEventListener("click", () => {
    if (optionsDiv.style.display === "block") {
      optionsDiv.style.display = "none";
    } else if (optionsDiv.style.display === "none") {
      optionsDiv.style.display = "block";
    }
  });
};

//changes cell colors, speed, board size
const boardOptions = e => {
  if (gameWidth.value === "") {
    gameWidth.value = boardSize[0];
  }
  if (gameHeight.value === "") {
    gameHeight.value = boardSize[1];
  }
  if (gameWidth.value != boardSize[0] || gameHeight.value != boardSize[1]) {
    createBoard(gameWidth.value, gameHeight.value);
  }
  if (liveColorChange.value !== liveColor && liveColorChange.value !== "") {
    liveColor = liveColorChange.value;
  }
  // if (deadColorChange.value !== deadColor && deadColorChange.value !== "") {
  //   deadColor = deadColorChange.value;
  // }
  if (speedChange.value !== speed && speedChange.value !== "") {
    speed = speedChange.value;
  }
  liveColorChange.value = "";
  // deadColorChange.value = "";
  gameWidth.value = "";
  gameHeight.value = "";
  speedChange.value = "";
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
  cell.liveColor = liveColor;
  cell.deadColor = deadColor;
  cell.id = `${i / 10}a${j / 10}`;
  cell.style.backgroundColor = cell.deadColor;
};

//event listener function for changing a cell with a single click
const clickBit = cell => {
  if (cell.alive === false && !isRunning) {
    cell.alive = true;
    cell.liveColor = liveColor;
    cell.style.backgroundColor = cell.liveColor;
  } else if (cell.alive === true && !isRunning) {
    cell.alive = false;
    cell.deadColor = deadColor;
    cell.style.backgroundColor = cell.deadColor;
  }
};

//event listener function for changing multiple cells on dragover
const mouseOver = cell => {
  if (keydown === 67 && !cell.alive && !isRunning) {
    cell.alive = true;
    cell.liveColor = liveColor;
    cell.style.backgroundColor = cell.liveColor;
  } else if (keydown === 88 && cell.alive && !isRunning) {
    cell.alive = false;
    cell.deadColor = deadColor;
    cell.style.backgroundColor = cell.deadColor;
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
        if (tempBoard[i][j][1] < 2) {
          cell.alive = false;
          cell.style.backgroundColor = cell.deadColor;
        } else if (tempBoard[i][j][1] > 3) {
          cell.alive = false;
          cell.style.backgroundColor = cell.deadColor;
        } else if (tempBoard[i][j][1] === 2 || tempBoard[i][j][1] === 3) {
          cell.alive = true;
          cell.liveColor = tempBoard[i][j][0];
          cell.style.backgroundColor = cell.liveColor;
        }
      } else {
        if (tempBoard[i][j][1] === 3) {
          cell.alive = true;
          cell.liveColor = tempBoard[i][j][0];
          cell.style.backgroundColor = cell.liveColor;
        }
      }
    }
  }
};

//checks and tallies all alive neighbors and gets most common neighbor color
const checkNeighbors = (i, j) => {
  let result = 0;
  let colors = [];
  let count = {};
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      //excludes itself
      if (!(dx === 0 && dy === 0)) {
        if (document.getElementById(`${i + dx}a${j + dy}`) !== null) {
          if (document.getElementById(`${i + dx}a${j + dy}`).alive) {
            colors.push(
              document.getElementById(`${i + dx}a${j + dy}`).liveColor
            );
            result += 1;
          }
        }
      }
    }
  }
  //takes the count object, gets a count of how many times each color appears as a neighbor, and reduces that to an array of [most common neighbor, total neighbors]
  count = reduceCount(countUpDuplicates(count, colors), result);
  return count;
};

//Gets a count for how many times each color appears as a neighbor, by color. {purple: 3, grey: 1, #228B22: 2}
const countUpDuplicates = (count, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (count[colors[i]]) {
      count[colors[i]] += 1;
    } else {
      count[colors[i]] = 1;
    }
  }
  return count;
};

//reduces the count object to an array of: [maximum counted color, number of neighbors]
const reduceCount = (count, result) => {
  if (Object.keys(count).length === 1) {
    count = [Object.keys(count)[0], result];
  } else if (Object.keys(count).length !== 0) {
    count = Object.keys(count).reduce(
      (a, b) => (count[a] > count[b] ? [a, result] : [b, result])
    );
  } else {
    count = [deadColor, 0];
  }
  return count;
};
