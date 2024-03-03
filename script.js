"use-strict";

const GRID_WIDTH = 25;
const GRID_HEIGHT = 25;
let gameActive = false;
let gameInterval;
let model = [];

window.addEventListener("load", start);

/* ######### CONTROLLER ######### */
function start() {
  console.log("start()");

  createBoard();

  makeBoardClickable();

  createModel();

  makeButtonClickable();
}

function selectCell(row, col) {
  //console.log("selectCell()");

  writeToCell(row, col);

  displayBoard();
}

function startGame() {
  //console.log("startGame()");

  gameActive = true;

  toggleButtons();

  gameInterval = setTimeout(runGame, 500);
}

function runGame() {
  console.log("runGame()");

  updateModel();

  displayBoard();

  if (gameActive) {
    gameInterval = setTimeout(runGame, 500);
  }
}

function pauseGame() {
  //console.log("pauseGame()");

  gameActive = false;
  toggleButtons();
  clearInterval(gameInterval);
}

function stopGame() {
  //console.log("stopGame");

  gameActive = false;
  clearInterval(gameInterval);

  toggleButtons();

  createModel();

  displayBoard();
}

/* ######### MODEL ######### */

function countNeighbours(row, col) {
  //console.log("countNeighbors()");

  let count = 0;
  for (let y = -1; y < 2; y++) {
    for (let x = -1; x < 2; x++) {
      if (x !== 0 || y !== 0) {
        const newRow = row + y;
        const newCol = col + x;
        if (newRow >= 0 && newRow < GRID_HEIGHT && newCol >= 0 && newCol < GRID_WIDTH) {
          count += readFromCell(newRow, newCol);
        }
      }
    }
  }
  return count;
}

function createBoard() {
  //console.log("createBoard()");

  const board = document.querySelector("#board");
  board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", row);
      cell.setAttribute("data-col", col);
      board.appendChild(cell);
    }
  }
}

function displayBoard() {
  console.log("displayBoard()");

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const value = readFromCell(row, col);
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      switch (value) {
        case 0:
          cell.style.backgroundColor = "white";
          break;
        case 1:
          cell.style.backgroundColor = "black";
          break;
      }
    }
  }
}

function createModel() {
  //console.log("createModel()");

  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      newRow[col] = 0;
    }
    model[row] = newRow;
  }
}

function writeToCell(row, col) {
  //console.log("writeToCell()");

  if (model[row][col] === 0) {
    model[row][col] = 1;
  } else if (model[row][col] === 1) {
    model[row][col] = 0;
  }
}

function readFromCell(row, col) {
  //console.log("readFromCell()");

  return model[row][col];
}

function updateModel() {
  //console.log("updateModel");

  const newModel = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      const neighbours = countNeighbours(row, col);
      if (model[row][col] === 1) {
        if (neighbours < 2 || neighbours > 3) {
          newRow[col] = 0;
        } else {
          newRow[col] = 1;
        }
      } else {
        if (neighbours === 3) {
          newRow[col] = 1;
        } else {
          newRow[col] = 0;
        }
      }
    }
    newModel.push(newRow);
  }
  model = newModel;
}
/* ######### VIEW ######### */

function makeBoardClickable() {
  //console.log("makeBoardClickable()");

  document.querySelector("#board").addEventListener("click", boardClicked);
}

function makeButtonClickable() {
  // console.log("makeButtonClickable");

  document.querySelector("#start-btn").addEventListener("click", startGame);
  document.querySelector("#stop-btn").addEventListener("click", stopGame);
}

function toggleButtons() {
  //console.log("toggleButtons()");

  const startBtn = document.querySelector("#start-btn");
  const pauseBtn = document.querySelector("#pause-btn");
  const stopBtn = document.querySelector("#stop-btn");

  if (gameActive) {
    startBtn.style.display = "none";
    pauseBtn.style.display = "block";
    stopBtn.style.display = "block";
  } else {
    startBtn.style.display = "block";
    pauseBtn.style.display = "none";
    stopBtn.style.display = "none";
  }
}

function boardClicked(evt) {
  //console.log("boardClicked()");

  const cell = evt.target;
  if (cell.classList.contains("cell")) {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    selectCell(row, col);
  }
}
