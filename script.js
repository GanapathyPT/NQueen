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
          ways.push({ i, j, queen: true });

          // calling the function
          // if it returns false then the current position is not a good position
          if (!placeQueens(gameBoard)) {
            // then remove the queen that placed currently
            gameBoard[i][j] = 0;
            ways.push({ i, j, queen: false });
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
const gameBoardDiv = document.getElementById("gameBoard");
const nInput = document.getElementById("nInput");
const solveBtn = document.getElementById("solveBtn");
const speedRange = document.getElementById("speed");
const progressBar = document.getElementById("progress");
const immediateBtn = document.getElementById("immediate");
const spinner = document.getElementById("spinner");
let N; // denotes the no of queens to be placed
const ways = [];
const speedToMs = {
  0: 400,
  1: 300,
  2: 200,
  3: 100,
  4: 50,
  5: 1,
};

const handleNChange = (newN) => {
  // N should be between 4 and 10 to maintain recursive calls limited
  newN = Math.min(9, newN);
  newN = Math.max(4, newN);

  makeBoard(newN);
  return newN;
};

// whenever user changes N, make the board and store it
nInput.addEventListener("change", (event) => {
  N = parseInt(event.target.value);
  N = handleNChange(N);
  event.target.value = N;
});

nInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    resetGame();
    await solveBoard();
  }
});

// solve the board when user clicks on solve button
solveBtn.addEventListener("click", async () => {
  resetGame();
  await solveBoard();
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
      colDiv.className = "border square";
      rowDiv.appendChild(colDiv);
    }

    rowDiv.className = "row square__row";
    boardDiv.appendChild(rowDiv);
  }

  gameBoardDiv.innerHTML = boardDiv.innerHTML;
}

/**
 * solve the board with DOM manipulation
 * @param solveMethod -> method of solving
 */
async function solveBoard() {
  switchInputsDisabled(true);
  spinner.classList.toggle("active");

  // emptying the array
  ways.splice(0, ways.length);
  // resetting progress bar
  progressBar.style.width = "0px";

  // solving the game programatically
  const board = new Array(N).fill(0).map(() => new Array(N).fill(0));
  const solvedBoard = await placeQueens(board);

  await sleep(1000);
  spinner.classList.toggle("active");

  // getting the delay time user entered
  const delayTiming = speedToMs[parseInt(speedRange.value)];
  await setAllValuesWithMethod(delayTiming);

  switchInputsDisabled(false);
}

/**
 * setting values of the grid with the given delay
 */
async function setAllValuesWithMethod(delayTiming) {
  for (let way in ways) {
    progressBar.style.width = `${parseFloat((way / (ways.length - 1)) * 100)}%`;
    const { i, j, queen } = ways[way];

    // setting the steps performed in DOM with the given delay
    setQueen(i, j, queen);
    await sleep(delayTiming);
  }
}

/**
 * reset the game board on DOM
 */
function resetGame() {
  new Array(N).fill(0).forEach((row, i) => {
    new Array(N).fill(0).forEach((col, j) => {
      const squareDiv = document.getElementById(`${i}_${j}`);
      squareDiv.innerText = "";
    });
  });
}

/**
 * set the Queen in DOM
 */
function setQueen(i, j, queen) {
  const squareDiv = document.getElementById(`${i}_${j}`);
  squareDiv.innerHTML = queen ? `<img src="./public/queen.png" />` : "";
}

/**
 * delay the execution for ms milliseconds
 * @param ms -> milliseconds to delay
 */
function sleep(ms) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, ms);
  });
}

/**
 * switch all the input disabled values
 * @param disabled -> boolean value for disabled value
 */
function switchInputsDisabled(disabled) {
  solveBtn.disabled = disabled;
  speedRange.disabled = disabled;
  nInput.disabled = disabled;
}

const initialN = nInput.value ? parseInt(+nInput.value) : 4;
nInput.value = initialN;
// make the board initially
handleNChange(initialN);
