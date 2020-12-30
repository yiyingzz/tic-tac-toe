// module for gameboard
const Gameboard = (function () {
  const board = [];

  const renderBoard = () => {
    const gameboard = document.getElementById("gameboard");

    for (let i = 0; i < 9; i++) {
      board.push(" ");
      const cell = document.createElement("div");
      cell.setAttribute("data-id", i);
      cell.classList.add("cell");
      cell.classList.add("available");
      gameboard.append(cell);

      cell.addEventListener("click", function (e) {
        Game.checkResults(e.target);
      });
    }
  };

  return {
    renderBoard,
    board
  };
})();

// module for game controller
const Game = (function () {
  const player1 = Player("X");
  const player2 = Player("O");
  const players = [player1, player2];

  let startingPlayer = 0;
  let activePlayer = startingPlayer;
  let remainingCells = 9;

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = () => {
    const board = document.querySelectorAll(".board .cell");
    for (line of winningLines) {
      const a = line[0];
      const b = line[1];
      const c = line[2];

      if (
        board[a].dataset.player === players[activePlayer].symbol &&
        board[b].dataset.player === players[activePlayer].symbol &&
        board[c].dataset.player === players[activePlayer].symbol
      ) {
        showMessage(
          `player ${activePlayer + 1} (${players[activePlayer].symbol}) wins!`
        );
        setWinningStyle(line);
        disableBoard();
        document.querySelector("button").style.display = "initial";
        return true;
      }
    }

    // if no winner --> next player
    activePlayer = activePlayer === 0 ? 1 : 0;
    showMessage(
      `player ${activePlayer + 1} (${players[activePlayer].symbol})'s turn!`
    );
    return false;
  };

  const declareTie = () => {
    showMessage("It's a tie!");
    document.querySelector("button").style.display = "initial";
  };

  const setWinningStyle = (line) => {
    const winner = players[activePlayer].symbol;
    let bgColor = "pink";
    if (winner === "O") bgColor = "yellow";
    const board = document.querySelectorAll(".board div");
    line.forEach((num) => {
      const elem = board[num];
      elem.style.color = `var(--blue)`;
      elem.style.backgroundColor = `var(--${bgColor})`;
    });
  };

  const checkResults = (cell) => {
    if (!cell.classList.contains("available")) return;
    Gameboard.board[cell.dataset.id] = players[activePlayer].symbol;
    cell.classList.remove("available");
    remainingCells -= 1;
    cell.classList.add(`selected-${players[activePlayer].symbol}`);
    cell.dataset.player = players[activePlayer].symbol;
    cell.innerText = players[activePlayer].symbol;
    if (remainingCells === 0 && !checkWinner()) {
      declareTie();
    } else {
      checkWinner();
    }
  };

  const disableBoard = () => {
    const board = document.querySelector(".board");
    const div = document.createElement("div");
    div.classList.add("disabled-overlay");
    board.append(div);
  };

  const showMessage = (msg) => {
    msg = msg[0].toLowerCase() + msg.slice(1);
    document.querySelector(".message").textContent = msg;
  };

  const reset = () => {
    remainingCells = 9;
    document.getElementById("gameboard").innerHTML = "";
    for (let i = Gameboard.board.length - 1; 0 <= i; i--) {
      Gameboard.board.pop(Gameboard.board[i]);
    }
    startingPlayer = startingPlayer === 0 ? 1 : 0;
    activePlayer = startingPlayer;
    init();
  };

  const init = () => {
    Gameboard.renderBoard();
    document.querySelector("button").addEventListener("click", reset);
    document.querySelector("button").style.display = "none";
    showMessage(
      `player ${activePlayer + 1} (${players[activePlayer].symbol}) starts!`
    );
  };

  return {
    checkResults,
    init
  };
})();

// factory function for players
function Player(symbol) {
  return { symbol };
}

Game.init();
