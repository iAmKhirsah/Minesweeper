'use strict';
var gBoard;
var gLevel = {
  size: 8,
  mines: 2,
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
        strHTML += `<td class="${className}" onclick="cellClicked(${i},${j})"></td>`;
      } else if (!gBoard[i][j].isMine) {
        strHTML += `<td class="${className}" onclick="cellClicked(${i},${j})"></td>`;
      }
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elTable = document.querySelector('.table');
  elTable.innerHTML = strHTML;
}
function cellClicked(i, j) {
  if (gBoard[i][j].isMine) {
    gBoard[i][j].isShown = true;
    renderCell(i, j, MINE);
  } else if (gBoard[i][j].minesAroundCount === 0) {
    renderCell(i, j, '');
  } else if (!gBoard[i][j].isMine) {
    gBoard[i][j].isShown = true;
    renderCell(i, j, gBoard[i][j].minesAroundCount);
  }
}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(board, elCell, i, j) {}

function generateMines(board) {}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function renderCell(i, j, item) {
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.innerHTML = item;
}
