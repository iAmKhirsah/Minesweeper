'use strict';
var gBoard;
var gTimer = 0;
var gLevel = {
  size: 8,
  mines: 12,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
const FLAG = '!';
const MINE = '*';
function init() {
  gBoard = buildBoard();
  generateMines();
  renderBoard(gBoard);
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.size; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
      };
    }
  }
  return board;
}
// see if i can make this shorter
function setMinesNegsCount(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine) board[cellI][cellJ].minesAroundCount++;
    }
  }
}
function renderBoard(board) {
  var strHTML = '<table border="1"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var className = 'cell cell' + i + '-' + j;
      setMinesNegsCount(gBoard, i, j);
      if (gBoard[i][j].isMine) {
        strHTML += `<td class="${className}" onclick="cellClicked(${i},${j})" oncontextmenu="cellClicked(${i},${j})"></td>`;
      } else if (!gBoard[i][j].isMine) {
        strHTML += `<td class="${className}" onclick="cellClicked(${i},${j})" oncontextmenu="cellClicked(${i},${j})"></td>`;
      }
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elTable = document.querySelector('.table');
  elTable.innerHTML = strHTML;
}
function cellClicked(i, j) {
  if (!(i >= 0 && j >= 0 && i <= gBoard.length - 1 && j <= gBoard.length - 1)) {
    return;
  }

  if (gBoard[i][j].isShown) return;
  gBoard[i][j].isShown = true;

  if (!gGame.isOn && gBoard[i][j].isMine) {
    var emptyCell = getEmptyCells(gBoard);
    gBoard[i][j] = gBoard[emptyCell.i][emptyCell.j];
  }
  //////// check if this thing works properly, the generate mines
  if (!gGame.isOn) {
    gGame.isOn = true;
    setInterval(timer, 1000);
  }

  if (gBoard[i][j].isMine) {
    renderCell(i, j, MINE);
  } else if (gBoard[i][j].minesAroundCount === 0) {
    expandShown(i, j);
    renderCell(i, j, 0);
  } else if (!gBoard[i][j].isMine) {
    renderCell(i, j, gBoard[i][j].minesAroundCount);
  }
}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(i, j) {
  cellClicked(i + 1, j);
  cellClicked(i - 1, j);
  cellClicked(i, j + 1);
  cellClicked(i, j - 1);
  cellClicked(i + 1, j + 1);
  cellClicked(i + 1, j - 1);
  cellClicked(i - 1, j + 1);
  cellClicked(i - 1, j - 1);
}

function generateMines() {
  for (var i = 0; i < gLevel.mines; i++) {
    var randomRow = getRandomInt(0, gLevel.size - 1);
    var randomCol = getRandomInt(0, gLevel.size - 1);
    gBoard[randomRow][randomCol].isMine = true;
  }
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].minesAroundCount === 0 && !board[i][j].isMine) {
        emptyCells.push({ i, j });
      }
    }
  }
  var randomNum = getRandomInt(0, emptyCells.length);
  return emptyCells[randomNum];
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function renderCell(i, j, item) {
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.innerHTML = item;
}

function timer() {
  var timer = document.querySelector('.timer');
  gTimer++;
  timer.innerText = `Timer: ${gTimer}`;
}
function difficulty(size, bombs) {}
