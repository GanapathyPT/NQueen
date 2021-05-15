/********************************************
 ************* GAME LOGICS ******************
 ********************************************/

/**
 * print the game board in a good manner
 * @param gameBoard -> board of the game (2D array)
 */
function printBoard(gameBoard) {
  console.group("Print");
  for (i of gameBoard) console.log(i);
  console.groupEnd();
}

/**
 * check if the queen can be placed in the given position
 * @param gameBoard -> board of the game
 * @param pos -> position to check for validity
 */
function checkIfQueenCanBePlaced(gameBoard, pos) {
  const [row, col] = pos;

  // horizontal check
  if (gameBoard[row].includes(1)) return false;

  // vertical check
  const column = [];
  gameBoard.forEach((boardRow) => {
    column.push(boardRow[col]);
  });
  if (column.includes(1)) return false;

  let i, j;

  // upper left diagonal
  [i, j] = [row, col];
  while (i >= 0 && j >= 0) {
    if (gameBoard[i][j] === 1) return false;
    i--;
    j--;
  }

  // upper right diagonal
  [i, j] = [row, col];
  while (i < gameBoard.length && j < gameBoard.length) {
    if (gameBoard[i][j] === 1) return false;
    i++;
    j++;
  }

  // lower left diagonal
  [i, j] = [row, col];
  while (i < gameBoard.length && j >= 0) {
    if (gameBoard[i][j] === 1) return false;
    i++;
    j--;
  }

  // upper left diagonal
  [i, j] = [row, col];
  while (i >= 0 && j < gameBoard.length) {
    if (gameBoard[i][j] === 1) return false;
    i--;
    j++;
  }

  return true;
}

/**
 * calculate the no of queens in a board
 * @param gameBoard -> grid of the game
 */
function calcNoOfQueens(gameBoard) {
  let total = 0;
  for (let row in gameBoard)
    for (let col in gameBoard[row]) if (gameBoard[row][col] === 1) total++;

  return total;
}

/**
 * final function to place all the queens
 * @param gameBoard -> grid of the game
 */
function placeQueens(gameBoard) {
  // if the total no of queen is same as the board length then algo is over
  if (calcNoOfQueens(gameBoard) === gameBoard.length) return true;

  for (let i in gameBoard) {
    for (let j in gameBoard[i]) {
      // if there is no queens placed on the current position
      if (gameBoard[i][j] === 0) {
        //   also if it is valid to place the queen on the current position
        if (checkIfQueenCanBePlaced(gameBoard, [i, j])) {
          // place the queen as it is valid
          gameBoard[i][j] = 1;

          // calling the function
          // if it returns false then the current position is not a good position
          if (!placeQueens(gameBoard)) {
            // then remove the queen that placed currently
            gameBoard[i][j] = 0;
          } else {
            // if the recursive call returns true then the game is over
            // as it only return true if the no of queens is satisifed with their positions
            return gameBoard;
          }
        }
      }
    }
  }

  // there is no position to place the queen
  return false;
}

/********************************************
 ********* DOM MANIPULATION LOGICS ***********
 *********************************************/

// variables for the DOM manipulation
const gameBoardDiv = document.querySelector(".game__board");
const nInput = document.getElementById("nInput");
const solveBtn = document.querySelector(".solve__btn");
let N = 4;

// whenever user changes N, make the board and store it
nInput.addEventListener("change", (event) => {
  const n = parseInt(event.target.value);
  makeBoard(n);
  N = n;
});

// solve the board when user clicks on solve button
solveBtn.addEventListener("click", (event) => {
  solveBoard();
});

/**
 * make the board for the given N
 * @param n -> size of the array cube
 */
function makeBoard(n) {
  const boardDiv = document.createElement("div");
  for (let i = 0; i < n; i++) {
    const rowDiv = document.createElement("div");

    for (let j = 0; j < n; j++) {
      const colDiv = document.createElement("div");
      colDiv.id = `${i}_${j}`;
      colDiv.classList.add("board__col");
      rowDiv.appendChild(colDiv);
    }

    rowDiv.classList.add("board__row");
    boardDiv.appendChild(rowDiv);
  }

  gameBoardDiv.innerHTML = boardDiv.innerHTML;
}

/**
 * solve the board with DOM manipulation
 */
async function solveBoard() {
  const board = new Array(N).fill(0).map((row) => new Array(N).fill(0));
  const solvedBoard = await placeQueens(board);
  printBoard(solvedBoard);
  solvedBoard.forEach((row, i) => {
    row.forEach(async (col, j) => {
      if (col === 1) await setQueen(i, j, true);
    });
  });
}

/**
 * set the Queen in DOM
 */
function setQueen(i, j) {
  return setTimeout(() => {
    const squareDiv = document.getElementById(`${i}_${j}`);
    squareDiv.innerText = "Q";
  }, 100 * (i + j));
}

// make the board initially
makeBoard(N);
