console.log("is this thing connected");

// if only 1 instance of something --> module
// more than 1 instance --> factory

// module: set up gameboard

// set up gameboard
const Gameboard = (function () {
  // calculate rows x columns, default 3x3
  const board = [];

  // initialize board
  const init = () => {
    console.log("init func");

    const gameboard = document.getElementById("gameboard");

    for (let i = 0; i < 9; i++) {
      board.push(" ");
      const cell = document.createElement("div");
      cell.setAttribute("data-id", i);
      gameboard.append(cell);

      cell.addEventListener("click", function (e) {
        if (this.classList.contains("selected")) return;
        console.log(`you clicked cell #${e.target.dataset.id}`);
        board[e.target.dataset.id] = Game.players[Game.activePlayer].symbol;
        this.classList.add("selected");
        this.innerText = Game.players[Game.activePlayer].symbol;
        console.log(board);
        // run check
        checkWinner();
      });
    }
  };

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

  // check winner
  const checkWinner = () => {
    console.log("inside checkWinner");
    // get current marked spots --> "board" array
    // get current active player
    const indices = [];
    board.forEach((cell, idx) => {
      if (cell === Game.players[Game.activePlayer].symbol) {
        console.log(idx);
        indices.push(idx);
      }
    });
    if (indices.length < 3) {
      Game.activePlayer = Game.activePlayer === 0 ? 1 : 0;
      return;
    }

    // if no winner --> next player
    Game.activePlayer = Game.activePlayer === 0 ? 1 : 0;
  };

  return {
    // init function to set up gameboard in HTML
    // gameboard setup, row & column # --> Controller needs these to determine winner

    init,
    board,
    checkWinner
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

  return {
    // public score-keeping
    // calculate current scores function --> then update player obj ---> then check if there's a winner
    // function to check for winner
    // hasWinner ?
    // functions that listen for user clicks (evt listner callbacks) on the gameboard
    // need a way to determine/control whose turn so it can place the right X/O symbol
    // a counter for whose turn like activePlayer = 0 or 1 (gets flipped everytime)
    activePlayer,
    players
  };
})();

// factory
function Player(symbol) {
  const score = 0;

  // player properties
  // id
  // score
  // isWinner

  return {
    symbol,
    score
    // player obj
    // score
  };
}

Gameboard.init();
