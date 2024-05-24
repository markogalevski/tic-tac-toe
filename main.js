
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
  let name;
  function requestMove(x, y) {
    return {x, y, symbol}
  }
  function refreshName() {
    name = document.getElementById(`player${symbol}Name`).value;
  }

  function getName() {
    return name;
  }

  return {
    requestMove,
    getName,
    refreshName
  }
}

function createPlayerX() {
  return createPlayer('X');
}

function createPlayerO() {
  return createPlayer('O');
}

function createRenderer() {
  function clear() {
      const cells = document.getElementsByClassName("cell");
      for (const cell of cells) {
        cell.textContent = "";
      }   
  }

  function renderBoardState(boardState) {
      clear();
      const cells = document.getElementsByClassName("cell");
      let cell_counter = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardState[i][j] !== null) {
            const cell = cells[cell_counter];
            cell.textContent = boardState[i][j];
          }
          cell_counter++;
        }
      }

  }
  return {
    renderBoardState,
  }
  
}

const Game = (() => {
  const playerX = createPlayerX();
  const playerO = createPlayerO();
  const gameboard = createGameboard();
  const renderer = createRenderer();
  let currentTurnX = true;

  function setupEventHandlers() {
    const cells = document.getElementsByClassName("cell");
    let i = 0;
    let j = 0;
      const createHandleTurn = (x, y) => {
        function callHandleTurn() {
          handleTurn(x, y);
        }
        return callHandleTurn;
      }
    for (const cell of cells) {      
      cell.addEventListener("click", createHandleTurn(i, j));
      j++;
      if (j % 3 === 0) {
        i++;
        j = 0;
      }
    }
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", Game.start);
  }

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
      renderer.renderBoardState(gameboard.getBoardState());
      const gameResult = determineWinner(gameboard.getBoardState()); 
      if (gameResult) {
        const cells = document.getElementsByClassName("cell");
        for (const cell of cells) {
          //biome-ignore lint/correctness/noSelfAssign:  Removes all event handlers
          cell.outerHTML = cell.outerHTML;
        }
      }
      else {
        currentTurnX = !currentTurnX;
      }
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
        return "tie";
      }
      return null;
    }
  
  function determineWinner(boardState) {
    const results = [];
    for (let i = 0; i < 3; i++){ 
      results.push(calculateRowCol(boardState[i]));
      results.push(calculateRowCol([boardState[0][i], boardState[1][i], boardState[2][i]]));
    }
    results.push(calculateRowCol([boardState[0][0], boardState[1][1], boardState[2][2]]));
    results.push(calculateRowCol([boardState[0][2], boardState[1][1], boardState[2][0]]));
    const winner = results.filter((f) => f !== "tie" && f !==  null);
    if (winner.length > 0) {
      const winnerName = winner[0] === 'X' ? playerX.getName() : playerO.getName();

      console.log(`Player ${winnerName} wins!`);
      return true; //game over
    }
    const numTies = results.filter((f) => f === "tie").length;
    if (numTies === 8) {
        console.log("It's a tie!");
        return true;
    }
    return false;
  }
  function start() {
    gameboard.clear();
    playerX.refreshName();
    playerO.refreshName();
    setupEventHandlers();
    renderer.renderBoardState(gameboard.getBoardState());
    currentTurnX = true;    
  }

  return  {
    start,
    determineWinner,
    calculateRowCol,

  }
})();


window.Game = Game;
Game.start();
