// module for gameboard
const Gameboard = (function () {
  const board = [];

  const init = () => {
    const gameboard = document.getElementById("gameboard");
    Game.startingPlayer = Game.startingPlayer === 0 ? 1 : 0;
    Game.activePlayer = Game.startingPlayer;

    for (let i = 0; i < 9; i++) {
      board.push(" ");
      const cell = document.createElement("div");
      cell.setAttribute("data-id", i);
      cell.classList.add("cell");
      cell.classList.add("available");
      gameboard.append(cell);

      cell.addEventListener("click", function (e) {
        if (this.classList.contains("selected")) return;
        board[e.target.dataset.id] = Game.players[Game.activePlayer].symbol;
        this.classList.add("selected");
        cell.classList.remove("available");
        this.classList.add(
          `selected-${Game.players[Game.activePlayer].symbol}`
        );
        this.innerText = Game.players[Game.activePlayer].symbol;
        Game.checkWinner();
      });
    }

    document.querySelector("button").addEventListener("click", Gameboard.reset);
    document.querySelector("button").style.display = "none";
    Game.showMessage(
      `player ${Game.activePlayer + 1} (${
        Game.players[Game.activePlayer].symbol
      }) starts!`
    );
  };

  const reset = () => {
    Game.hasWinner = false;
    document.getElementById("gameboard").innerHTML = "";
    for (let i = Gameboard.board.length - 1; 0 <= i; i--) {
      Gameboard.board.pop(Gameboard.board[i]);
    }
    Gameboard.init();
  };

  return {
    init,
    board,
    reset
  };
})();

// module for game controller
const Game = (function () {
  const player1 = Player("X");
  const player2 = Player("O");
  const players = [player1, player2];
  let startingPlayer = 1; // start at 1, we flip this upon init
  let activePlayer = 0;
  let hasWinner = false;

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
    const indices = [];
    Gameboard.board.forEach((cell, idx) => {
      if (cell === Game.players[Game.activePlayer].symbol) {
        indices.push(idx);
      }
    });
    if (3 <= indices.length) {
      for (let i = 0; i < winningLines.length; i++) {
        let match = 0;
        for (let j = 0; j < winningLines[i].length; j++) {
          let num = winningLines[i][j];
          for (let k = 0; k < indices.length; k++) {
            if (indices[k] === num) {
              match++;
              if (match === 3) {
                hasWinner = true;
                Game.showMessage(
                  `player ${Game.activePlayer + 1} (${
                    Game.players[Game.activePlayer].symbol
                  }) wins!`
                );
                setWinningStyle(winningLines[i]);
                disableBoard();
                document.querySelector("button").style.display = "initial";
                return;
              }
            }
          }
        }
      }

      let count = 0;
      for (let k = 0; k < Gameboard.board.length; k++) {
        if (Gameboard.board[k] === "X" || Gameboard.board[k] === "O") {
          count++;
        }
        if (count === Gameboard.board.length) {
          showMessage("It's a tie!");
          document.querySelector("button").style.display = "initial";
          return;
        }
      }
    }

    // if no winner --> next player
    Game.activePlayer = Game.activePlayer === 0 ? 1 : 0;
    showMessage(
      `player ${Game.activePlayer + 1} (${
        Game.players[Game.activePlayer].symbol
      })'s turn!`
    );
  };

  const setWinningStyle = (line) => {
    const winner = Game.players[Game.activePlayer].symbol;
    let bgColor = "pink";
    if (winner === "O") bgColor = "yellow";
    const board = document.querySelectorAll(".board div");
    line.forEach((num) => {
      const elem = board[num];
      elem.style.color = `var(--blue)`;
      elem.style.backgroundColor = `var(--${bgColor})`;
    });
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

  return {
    startingPlayer,
    activePlayer,
    players,
    checkWinner,
    hasWinner,
    showMessage
  };
})();

// factory function for players
function Player(symbol) {
  return { symbol };
}

Gameboard.init();
