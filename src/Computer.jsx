import { useState,useEffect } from 'react';
import Board from './components/Board';
import {calculateWinner} from './Helper';
import StatusMessage from './components/Statusmsg';
import History from './components/History';
import './styles.scss';

const NEW_GAME = [{ board: Array(9).fill(null), isXNext: true }];
function Computer() {
  const [history, setHistory] = useState(NEW_GAME);
  const [currentMove, setCurrentMove] = useState(0);
  const current = history[currentMove];

  const { winner, winningSquares } = calculateWinner(current.board);

  const handleSquareClick = position => {
    if (current.board[position] || winner) {
      computerMove();
      // return;
    }
    setHistory(prev => {
      const last = prev[prev.length - 1];

      const newBoard = last.board.map((square, pos) => {
        if (pos === position) {
          return last.isXNext ? 'X' : 'O';
        }

        return square;
      });

      return prev.concat({ board: newBoard, isXNext: !last.isXNext });
    });

    setCurrentMove(prev => prev + 1);
  };
  const moveTo = move => {
    setCurrentMove(move);
  };

  const onNewGame = () => {
    setHistory(NEW_GAME);
    setCurrentMove(0);
  };

    const handleBack = () => {
        window.history.back(); // Navigates to the previous page
    };


  // Minimax Algorithm
  const minimax = (board, depth, isMaximizing) => {
    const { winner } = calculateWinner(board);
    if (winner === 'X') return -10 + depth;
    if (winner === 'O') return 10 - depth;
    if (!board.includes(null)) return 0; // Tie

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = 'O'; // AI's move
          const score = minimax(board, depth + 1, false);
          board[i] = null; // Undo move
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = 'X'; // Player's move
          const score = minimax(board, depth + 1, true);
          board[i] = null; // Undo move
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // AI Move with Minimax
  const computerMove = () => {
    const nextBoard = current.board.slice(); // Clone current board
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < nextBoard.length; i++) {
      if (!nextBoard[i]) {
        nextBoard[i] = 'O'; // AI's tentative move
        const score = minimax(nextBoard, 0, false);
        nextBoard[i] = null; // Undo move

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== null) {
      setHistory(prev => {
        const last = prev[prev.length - 1];
        const newBoard = last.board.map((square, idx) => (idx === bestMove ? 'O' : square));
        return prev.concat({ board: newBoard, isXNext: true });
      });

      setCurrentMove(prev => prev + 1);
    }
  };

  // Trigger computer move after player's turn
  useEffect(() => {
    if (!current.isXNext && !winner) {
      computerMove();
    }
  }, [current, winner]);
  
  
  return (
    <div className='app'>
      <h1>
        TIC <span className="text-green">TAC</span> TOE
      </h1>
    <div className="board">
      <StatusMessage winner={winner} current={current} />
      <Board
        board={current.board}
        handleSquareClick={handleSquareClick}
        winningSquares={winningSquares}
      />
    </div>
    <div className="app2">
    <button
        type="button"
        onClick={onNewGame}
        className={`btn-reset ${winner ? 'active' : ''}`}
      >
        Start New Game
        </button>
        <button onClick={handleBack} className="btn-reset">
            Go Back
        </button>
        </div>
      <h2 style={{ fontWeight: 'normal' }}>Current game history</h2>
      <History history={history} moveTo={moveTo} currentMove={currentMove} />
      <div className="bg-balls" />
    </div>
  );
}
export default Computer;