
function createGameboard() {
  let boardState = [];
  boardState.push([null, null, null]);
  boardState.push([null, null, null]);
  boardState.push([null, null, null]);

  function clear() {
    boardState = [];
    boardState.push([null, null, null]);
    boardState.push([null, null, null]);
    boardState.push([null, null, null]); 
  }

  function playMove(move) {
    const {x, y, symbol} = move;
    if (boardState[x][y] === null) {
      boardState[x][y] = symbol;
      return true;
    }
    return false;
  }

  function showGameState() {
    console.table(boardState);
  }

  function getBoardState() {
    return boardState;
  }

  return {
    getBoardState,
    clear,
    playMove,
    showGameState,
  };
};

function createPlayer(symbol) {
  function requestMove(x, y) {
    return {x, y, symbol}
  }

  return {
    requestMove
  }

}

let Game = (function () {
  const playerX = createPlayer('X');
  const playerO = createPlayer('O');
  const gameboard = createGameboard();
  let currentTurnX = true;

  function handleTurn(x, y) {
    let move;
    if (currentTurnX) {
      move = playerX.requestMove(x, y);
    }
    else {
      move = playerO.requestMove(x, y);
    }
    const moveResult = gameboard.playMove(move);
    if (moveResult) {
      const gameResult = determineWinner(gameboard.getBoardState()); 
        if (gameResult !== null) {
          return gameResult;
        }
      currentTurnX = !currentTurnX;
    }
    return null;
  }  

  function calculateRowCol(rowcol) {
    const filtered = rowcol.filter((f) => f !== null);
      if (filtered.length === 2) {
        if (filtered[0] !== filtered[1]) {
            return "tie";
        }
      }
      else if (filtered.length === 3) {
        if (filtered.every((f) => f === "X") || filtered.every((f) => f === "O")) {
          return filtered[0];
        }
        else {
          return "tie";
        }
      }
      return null;
    }
  
  function determineWinner(boardState) {
    let results = [];
    for (let i = 0; i < 3; i++){ 
      results.push(calculateRowCol(boardState[i]));
      results.push(calculateRowCol([boardState[0][i], boardState[1][i], boardState[2][i]]));
    }
    results.push(calculateRowCol([boardState[0][0], boardState[1][1], boardState[2][2]]));
    results.push(calculateRowCol([boardState[0][2], boardState[1][1], boardState[2][0]]));
    const winner = results.filter((f) => f !== "tie" && f !==  null);
    console.log("The results for this turn are: ",results);
    if (winner.length > 0) {
      return winner[0];
    }
    const numTies = results.filter((f) => f === "tie").length;
    if (numTies === 8) {
      return "tie";
    }
    return null;
  }

  function play() {
    gameboard.clear();
    currentTurnX = true;
    while (true) {
      const currentTurn =currentTurnX ? "X" : "O";
      gameboard.showGameState();
      const input = prompt(`It's currently player ${currentTurn}'s turn. Hint: <x, y>`);
      const move = input.split(',').map((m) => parseInt(m));
      const result = handleTurn(...move); 
      if (result !== null) {
        if (result === "tie") {
          console.log("It's a tie!");
        }
        else {
          console.log(`Player ${result} wins!`);
        }
        break;
      }
    }
    
  }

  return  {
    play,
    determineWinner,
    calculateRowCol,
  }
})();

window.Game = Game;
