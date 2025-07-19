import { useState, useEffect } from "react";
import Header from "./Header.js";
import Board from "./Board.js";

function App() {
  const [difficulty, setDifficulty] = useState("Medium");
  const [flags, setFlags] = useState(40);
  const [boardSize, setBoardSize] = useState([14, 18]);
  const [boardContent, setBoardContent] = useState([]);
  const [boardRevealed, setBoardRevealed] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [gameState, setGameState] = useState(true);
  const [flagPos, setFlagPos] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  function handleDiffChange(e) {
    const diff = e.target.innerHTML;
    setDifficulty(diff);
    if (diff === "Medium") {
      setFlags(40);
      setBoardSize([14, 18]);
    } else if (diff === "Easy") {
      setFlags(10);
      setBoardSize([8, 10]);
    } else {
      setFlags(99);
      setBoardSize([20, 24]);
    }
  }

  // Updates the board with a new random game of minesweeper
  function handleNewGame() {
    const board = [];
    const bRevealed = [];
    const flagP = [];
    const tmp = [];
    const rows = boardSize[0];
    const cols = boardSize[1];

    // Set up board coordinates
    for (let i = 0; i < rows; i++) {
      board.push([]);
      bRevealed.push([]);
      flagP.push([]);
      for (let j = 0; j < cols; j++) {
        board[i].push(0);
        bRevealed[i].push(false);
        flagP[i].push(false);
        tmp.push([i, j]);
      }
    }
    setBoardRevealed(bRevealed);
    setFlagPos(flagP);

    // Randomly select board coordinates to have bombs in them
    for (let i = 0; i < flags; i++) {
      // Randomly select a square
      const index = Math.floor(Math.random() * tmp.length);

      // Set the square to a bomb square
      const sq = tmp[index];
      board[sq[0]][sq[1]] = -1;
      
      // Splice square out of tmp array
      tmp.splice(index, 1);
    }

    // From here, now calculate the number of bombs around non-bomb squares
    calculateBoard(board);

    setBoardContent(board);
    setFirstClick(true);
    setGameState(true);
    setGameWon(false);
  }

  // Calculates the numbers on the board given a board of 0s and -1s (representing bombs)
  function calculateBoard(board) {
    const rows = board.length;
    const cols = board[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] !== -1) continue;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            // Skip the bomb itself
            if (dr === 0 && dc === 0) continue;

            const nr = r + dr;
            const nc = c + dc;

            // Check bounds
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              // Increment only if not a bomb
              if (board[nr][nc] !== -1) {
                board[nr][nc]++;
              }
            }
          }
        }
      }
    }
    return board;
  }

  function handleNewClick(e, pos) {
    // Clicks disabled if game is over or won
    if (!gameState) return;
    if (gameWon) return;

    // First checks if left or right click:
    if (e.button === 0) {
      // Nothing happens if space is flagged
      if (!flagPos[pos[0]][pos[1]]) {
        handleLeftClick(pos);
      }
    } else {
      handleFlag(pos);
    }
  }

  function handleLeftClick(pos) {
    let boardC = [...boardContent];

    // If first click and square clicked is a bomb
    if (firstClick && boardC[pos[0]][pos[1]] === -1) {
      // Set clicked square to empty
      boardC[pos[0]][pos[1]] = 0;

      let keepGoing = true;
      for (let r = 0; keepGoing && r < boardSize[0]; r++) {
        // Randomly shuffles the row and goes through until it finds a square w/out a bomb
        // Create row of indexes and Shuffle row:
        let row = boardC[pos[r]].map((tmp, i) => i);
        for (let i = row.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [row[i], row[j]] = [row[j], row[i]];
        }

        // Find first row without a bomb square, if none found, go to next row
        for (let i = 0; keepGoing && i < row.length; i++) {
          if (boardC[r][row[i]] !== -1) {
            boardC[r][row[i]] = -1;
            keepGoing = false;
          }
        }
      }
      // Reset all nonbomb squares to 0
      boardC = boardC.map((r) => r.map((sq) => sq !== -1 ? 0 : -1));

      calculateBoard(boardC);
      setFirstClick(false);
    } else if (boardC[pos[0]][pos[1]] === -1) {
      // User clicked on a bomb and the game ends
      setGameState(false);
      return;
    }

    // Bad code lol but whatever it works:
    if (firstClick) {
      setFirstClick(false);
    }

    let boardR = [...boardRevealed];
    setBoardRevealed(clickSquare(pos, boardR, boardC));
    setBoardContent(boardC);
  }

  function clickSquare(pos, boardR, boardC) {
    // Check if square was already revealed
    if (boardR[pos[0]][pos[1]]) return boardR;

    // Update square to make it revealed
    boardR[pos[0]][pos[1]] = true;

    // If square was flagged, remove flag
    if (flagPos[pos[0]][pos[1]]) {
      setFlagPos(flagPos.map((row, i1) => {
        if (i1 === pos[0]) {
          return row.map((sq, i2) => i2 === pos[1] ? false : sq);
        } else {
          return row;
        }
      }));
    }

    // Only continues if this is an empty square
    if (boardC[pos[0]][pos[1]] !== 0) return boardR;

    // Reveals other squares around this square as well
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        const r = pos[0] + dr;
        const c = pos[1] + dc;

        // Check bounds:
        if (r >= 0 && c >= 0 && r < boardSize[0] && c < boardSize[1]) {
          boardR = clickSquare([r, c], boardR, boardC);
        }
      }
    }
    return boardR;
  }

  function handleFlag(pos) {
    let flagP = [...flagPos];
    // Nothing happens is square is already revealed or no flags left
    if (boardRevealed[pos[0]][pos[1]] || flags === 0) return;

    // Update flags used:
    if (flagPos[pos[0]][pos[1]]) {
      setFlags(flags + 1);
    } else {
      setFlags(flags - 1);
    }

    // Adds/removes flag from square clicked
    flagP[pos[0]][pos[1]] = !flagP[pos[0]][pos[1]];

    // Check if game was won
    checkGame(flagP);

    setFlagPos(flagP);
  }

  // Checks if user has flagged all bomb squares
  function checkGame(flagP) {
    // Check if player won game
    let keepGoing = true;
    for (let i = 0; keepGoing && i < boardSize[0]; i++) {
      for (let j = 0; keepGoing && j < boardSize[1]; j++) {
        keepGoing = (boardContent[i][j] === -1) === flagP[i][j];
      }
    }
    if (keepGoing) {
      setGameWon(true);
    }
  }

  // Calls handleNewGame whenever boardSize is updated
  useEffect(handleNewGame, [boardSize]);

  return (
    <div className="App">
      <Header difficulty={difficulty} flags={flags} handleDiffChange={handleDiffChange} />
      <Board
        bSize={boardSize}
        bContent={boardContent}
        bRevealed={boardRevealed}
        bFlags={flagPos}
        handleClick={handleNewClick}
      />
      { !gameState && <h2 className="game-message">Game Over!</h2> }
      { gameWon && <h2 className="game-message">You Won!</h2> }
    </div>
  );
}

export default App;