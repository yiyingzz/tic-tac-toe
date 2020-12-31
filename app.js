// module for gameboard
const Gameboard = (function () {
  const board = [];

  const renderBoard = () => {
    const gameboard = document.getElementById("gameboard");

    for (let i = 0; i < 9; i++) {
      board.push(" ");
      const cell = document.createElement("div");
      cell.setAttribute("data-id", i);
      cell.setAttribute("tabindex", "0");
      cell.classList.add("cell");
      cell.classList.add("available");
      gameboard.append(cell);

      cell.addEventListener("click", function (e) {
        if (!e.target.classList.contains("available")) return;
        Game.updateBoard(e.target);
      });
      cell.addEventListener("keydown", function (e) {
        if (!e.target.classList.contains("available")) return;
        if (e.code === "Space" || e.code === "Enter")
          Game.updateBoard(e.target);
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
  const player1 = Player("X", "Player 1");
  const player2 = Player("O", "Player 2");
  const players = [player1, player2];

  let isPVP = true;
  let startingPlayer = 1;
  let activePlayer = startingPlayer;
  let remainingCells = 9;
  let winningLine;

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

  const hasWinner = () => {
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
        winningLine = line;
        return true;
      }
    }
    return false;
  };

  const declareTie = () => {
    showMessage("It's a tie!");
    document.querySelector(".btn-reset").style.display = "initial";
  };

  const showWinner = (line) => {
    const winner = players[activePlayer];
    showMessage(`${winner.name} (${winner.symbol}) wins!`);
    let bgColor = "pink";
    if (winner.symbol === "O") bgColor = "yellow";
    const board = document.querySelectorAll(".board div");
    line.forEach((num) => {
      const elem = board[num];
      elem.style.color = `var(--blue)`;
      elem.style.backgroundColor = `var(--${bgColor})`;
    });
    disableBoard();
    document.querySelector(".btn-reset").style.display = "initial";
  };

  const checkForWinner = () => {
    if (hasWinner()) {
      showWinner(winningLine);
    } else if (remainingCells === 0) {
      declareTie();
    } else {
      takeTurn();
    }
  };

  const disableBoard = () => {
    const board = document.querySelector(".board");
    const div = document.createElement("div");
    div.classList.add("disabled-overlay");
    board.append(div);
  };

  const enableBoard = () => {
    const div = document.querySelector(".board .disabled-overlay");
    div.remove();
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
    restart();
  };

  const computerTakesTurn = () => {
    setTimeout(function () {
      const board = document.querySelectorAll(".board .available");
      const cell = board[Math.floor(Math.random() * board.length)];
      cell.dataset.player = players[1].symbol;
      updateBoard(cell);
      enableBoard();
    }, 250);
  };

  const updateBoard = (cell) => {
    if (!cell.classList.contains("available")) return;
    Gameboard.board[cell.dataset.id] = players[activePlayer].symbol;
    cell.classList.remove("available");
    remainingCells -= 1;
    cell.dataset.player = players[activePlayer].symbol;
    cell.innerText = players[activePlayer].symbol;
    checkForWinner(cell);
  };

  const takeTurn = () => {
    switchActivePlayer();
    if (!isPVP && activePlayer === 1) {
      disableBoard();
      computerTakesTurn();
    }
  };

  const switchActivePlayer = () => {
    activePlayer = activePlayer === 0 ? 1 : 0;
    showMessage(
      `${players[activePlayer].name} (${players[activePlayer].symbol})'s turn!`
    );
  };

  const init = () => {
    Gameboard.renderBoard();
    document.querySelector(".btn-reset").addEventListener("click", reset);
    document.querySelector(".btn-pvp").addEventListener("click", playPvp);
    document.querySelector(".btn-solo").addEventListener("click", playSolo);
    document
      .querySelector(".btn-change")
      .addEventListener("click", function () {
        showStartScreen();
      });
    showStartScreen();
  };

  const restart = () => {
    Gameboard.renderBoard();
    document.querySelector(".btn-reset").addEventListener("click", reset);
    document.querySelector(".btn-reset").style.display = "none";
    showMessage(
      `${players[activePlayer].name} (${players[activePlayer].symbol}) starts!`
    );
    if (!isPVP && activePlayer === 1) {
      disableBoard();
      computerTakesTurn();
    }
  };

  const showStartScreen = () => {
    document.querySelector(".start-screen").style.display = "initial";
    document.querySelector(".game-screen").style.display = "none";
    document.querySelector(".btn-reset").style.display = "none";
  };

  const hideStartScreen = () => {
    document.querySelector(".start-screen").style.display = "none";
    document.querySelector(".game-screen").style.display = "initial";
    reset();
  };

  const playPvp = () => {
    isPVP = true;
    players[1].name = "Player 2";
    document.querySelector(".game-mode p").textContent = "vs player";
    hideStartScreen();
  };

  const playSolo = () => {
    isPVP = false;
    players[1].name = "Computer";
    document.querySelector(".game-mode p").textContent = "vs computer";
    hideStartScreen();
  };

  return {
    updateBoard,
    init
  };
})();

// factory function for players
function Player(symbol, name) {
  return { symbol, name };
}

Game.init();
