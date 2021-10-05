'use strict';
var gBoard;
var gTimer;
var gLives;
var gPotentialMine;
var gTimerInterval;
var gHintFlag = false;

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
const FLAG = '🚩';
const MINE = '💣';
function init() {
  gTimer = 0;
  gLives = 3;
  gGame.shownCount = 0;
  gPotentialMine = 0;
  gGame.isOn = false;
  var elSmiley = document.querySelector('.smiley');
  var elLives = document.querySelector('.lives');
  var elTimer = document.querySelector('.timer');
  elSmiley.innerText = '😃';
  elTimer.innerText = `Timer: ${gTimer}`;
  elLives.innerHTML = `Lives: ${gLives}`;
  clearInterval(gTimerInterval);
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
        isMarked: false,
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
      if (j < 0 || j >= board.length) continue;
      if (board[i][j].isMine) board[cellI][cellJ].minesAroundCount++;
    }
  }
}

// CLEAN UP THE FUNCTION A BIT
function renderBoard(board) {
  var strHTML = '<table border="1"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var className = 'cell cell' + i + '-' + j;
      setMinesNegsCount(gBoard, i, j);
      if (gBoard[i][j].isMine) {
        strHTML += `<td class="${className}" onclick="cellClicked( ${i},${j})" oncontextmenu="rightClick(event, ${i},${j})"></td>`;
      } else if (!gBoard[i][j].isMine) {
        strHTML += `<td class="${className}" onclick="cellClicked( ${i},${j})" oncontextmenu="rightClick(event, ${i},${j})"></td>`;
      }
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elTable = document.querySelector('.table');
  elTable.innerHTML = strHTML;
}
function cellClicked(i, j) {
  if (!checkLegalNums(i, j)) {
    return;
  }
  if (gBoard[i][j].isShown) return;
  gBoard[i][j].isShown = true;
  gGame.shownCount++;
  if (gHintFlag) {
    checkHint(i, j);
    return;
  }
  var elLives = document.querySelector('.lives');
  if (!gGame.isOn && gBoard[i][j].isMine) {
    var emptyCell = getEmptyCells(gBoard);
    console.log('emptyCelli', emptyCell.i, 'emptyCellj', emptyCell.j);
    gBoard[i][j].isMine = false;
    gBoard[emptyCell.i][emptyCell.j].isMine = true;
  }

  if (!gGame.isOn) {
    gGame.isOn = true;
    // setMinesNegsCount(gBoard, i, j);
    gTimerInterval = setInterval(timer, 1000);
  }
  if (gBoard[i][j].isMine) {
    gLives--;
    gPotentialMine++;
    elLives.innerHTML = `Lives: ${gLives}`;
    renderCell(i, j, MINE);
    if (gLives === 0) {
      checkGameOverByMines();
    }
  } else if (gBoard[i][j].minesAroundCount === 0) {
    expandShown(i, j);
    renderCell(i, j, 0);
  } else if (!gBoard[i][j].isMine) {
    renderCell(i, j, gBoard[i][j].minesAroundCount);
  }
  if (
    gPotentialMine === gLevel.mines &&
    gGame.shownCount === gLevel.size * gLevel.size &&
    gLives > 0
  ) {
    handleSmileyVictory();
  }
}

function checkGameOverByMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        renderCell(i, j, MINE);
        handleSmileyDefeat();
      }
    }
  }
}

function checkGameOverByFlags(i, j) {
  if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
    gPotentialMine++;
    console.log(gPotentialMine);
    console.log(gLevel.mines);
  }
  if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    gPotentialMine--;
    console.log('IF IS NOT MARKED', gPotentialMine);
    console.log('IF IS NOT MARKED', gLevel.mines);
  }
  if (
    gPotentialMine === gLevel.mines &&
    gGame.shownCount === gLevel.size * gLevel.size
  ) {
    handleSmileyVictory();
  }
  console.log('shownCount', gGame.shownCount);
  console.log('gLevel.size', gLevel.size * gLevel.size);
}

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
  for (var i = 0; i < gLevel.mines; ) {
    var randomRow = getRandomInt(0, gLevel.size - 1);
    var randomCol = getRandomInt(0, gLevel.size - 1);
    if (gBoard[randomRow][randomCol].isMine) {
      continue;
    }
    console.log(i);
    i++;
    gBoard[randomRow][randomCol].isMine = true;
  }
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (!board[i][j].isMine) {
        emptyCells.push({ i, j });
      }
    }
  }
  var randomNum = getRandomInt(0, emptyCells.length - 1);
  return emptyCells[randomNum];
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderCell(i, j, item = -1) {
  if ((item = -1)) {
    if (!gBoard[i][j].isShown) {
      item = ' ';
    } else if (gBoard[i][j].isMarked) {
      item = FLAG;
    } else if (gBoard[i][j].isMine) {
      item = MINE;
    } else item = gBoard[i][j].minesAroundCount;
  }
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.innerHTML = item;
}

function timer() {
  var elTimer = document.querySelector('.timer');
  gTimer++;
  elTimer.innerText = `Timer: ${gTimer}`;
}
function difficulty(size, bombs) {
  gLevel.size = size;
  gLevel.mines = bombs;
  init();
}

function rightClick(ev, i, j) {
  if (!gGame.isOn) {
    gGame.isOn = true;
    setInterval(timer, 1000);
  }
  if (gBoard[i][j].isShown && gBoard[i][j].isMarked) {
    gGame.shownCount--;
    console.log('--showncount', gGame.shownCount);
    hideCell(i, j);
    gBoard[i][j].isMarked = false;
    return;
  }

  if (gBoard[i][j].isShown) return;
  ev.preventDefault();
  gGame.markedCount++;
  gGame.shownCount++;
  gBoard[i][j].isMarked = true;
  gBoard[i][j].isShown = true;
  checkGameOverByFlags(i, j);
  renderCell(i, j);
}

function handleSmileyVictory() {
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerText = '😎';
  console.log('you won');
  gGame.isOn = false;
}

function handleSmileyDefeat() {
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerText = '🤯';
  console.log('you lost');
  gGame.isOn = false;
}

function hint() {
  gHintFlag = true;
  console.log(gHintFlag);
}

function checkHint(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (checkLegalNums(i, j)) {
        gBoard[i][j].isShown = true;
        setTimeout(hideCell, 1000, i, j);
        renderCell(i, j);
      }
    }
  }
}

function hideCell(i, j) {
  gBoard[i][j].isShown = false;
  gHintFlag = false;
  console.log('hello');
  renderCell(i, j, ' ');
}

function checkLegalNums(i, j) {
  var check =
    i >= 0 && j >= 0 && i <= gBoard.length - 1 && j <= gBoard.length - 1;
  return check;
}

function safeClick() {
  var emptyCell = getEmptyCells(gBoard);
  var i = emptyCell.i;
  var j = emptyCell.j;
  gBoard[i][j].isShown = true;
  setTimeout(hideCell, 1000, i, j);
  renderCell(i, j);
}
