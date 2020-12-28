console.log("is this thing connected");

// if only 1 instance of something --> module
// more than 1 instance --> factory

// module: set up gameboard

// set up gameboard
const Gameboard = (function () {
  const board = [];

  const init = () => {
    const gameboard = document.getElementById("gameboard");

    for (let i = 0; i < 9; i++) {
      board.push(" ");
      const cell = document.createElement("div");
      cell.setAttribute("data-id", i);
      cell.classList.add("available");
      gameboard.append(cell);

      cell.addEventListener("click", function (e) {
        if (this.classList.contains("selected")) return;
        board[e.target.dataset.id] = Game.players[Game.activePlayer].symbol;
        this.classList.remove("available");
        this.classList.add("selected");
        this.classList.add(
          `selected-${Game.players[Game.activePlayer].symbol}`
        );
        this.innerText = Game.players[Game.activePlayer].symbol;
        Game.checkWinner();
      });
      console.log("board inside", board);
    }

    document.querySelector("button").addEventListener("click", Game.reset);
    document.querySelector("button").style.display = "none";
    console.log("board in init", board);
  };

  return {
    // init function to set up gameboard in HTML
    // gameboard setup, row & column # --> Controller needs these to determine winner

    init,
    board
  };
})();

// game controller obj (basically the current game obj)
const Game = (function () {
  // private

  // set up # players in here?
  const player1 = Player("X");
  const player2 = Player("O");
  const players = [player1, player2];
  console.log(player1, player2);
  console.log(players);

  // var to keep track of active Player
  let activePlayer = 0; // or just set to player obj?

  // function to check for winner/completed line

  // winning Lines
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

  let hasWinner = false;
  // check winner
  const checkWinner = () => {
    console.log("inside checkWinner");
    // get current marked spots --> "board" array
    // get current active player
    const indices = [];
    console.log("indices", indices);
    Gameboard.board.forEach((cell, idx) => {
      if (cell === Game.players[Game.activePlayer].symbol) {
        indices.push(idx);
      }
    });
    console.log(Game.players[Game.activePlayer].symbol);
    console.log("indices for player", indices);
    if (indices.length < 3) {
      Game.activePlayer = Game.activePlayer === 0 ? 1 : 0;
      return;
    }

    // check indices against winningLines
    // no need for them to be in order, just check if any of the nums in each winning Line has been found!
    for (let i = 0; i < winningLines.length; i++) {
      const line = winningLines[i];
      let match = 0;

      // for each number in a winning line, loop through the indices array to check for it,
      line.forEach((num) => {
        indices.forEach((index) => {
          if (index === num) {
            match++;
            if (match === 3) {
              console.log("we have a winner!");
              hasWinner = true;
              document.querySelector("button").style.display = "initial";
              return; // can't do this in foreach --> just use for loop
            }
          }
        });
      });
    }

    if (!hasWinner) {
      let count = 0;
      for (let k = 0; k < Gameboard.board.length; k++) {
        if (Gameboard.board[k] === "X" || Gameboard.board[k] === "O") {
          count++;
        }
        if (count === Gameboard.board.length) {
          console.log("it's a tie!");
          document.querySelector("button").style.display = "initial";
        }
      }
    }

    // if no winner --> next player
    Game.activePlayer = Game.activePlayer === 0 ? 1 : 0;
  };

  const setWinningStyle = (symbol) => {
    if (symbol === "X") {
      // querySelector for winning line index --> match to data-set
    } else {
    }
  };

  const reset = () => {
    console.log("this is supposed to reset the game");
    hasWinner = false;
    document.getElementById("gameboard").innerHTML = "";
    // need to reset players array etc.
    Gameboard.board = []; // this is just setting up another var, not the same one as below
    console.log("before init", Gameboard.board);
    Gameboard.init();
  };

  return {
    activePlayer,
    players,
    checkWinner,
    reset
  };
})();

// factory
function Player(symbol) {
  const score = 0; // currently not used

  return {
    symbol,
    score
  };
}

Gameboard.init();
