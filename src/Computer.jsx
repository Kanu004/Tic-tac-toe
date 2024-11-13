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


  const computerMove = () => {
    const nextSquares = current.board.slice(); // Create a copy of the current board
    const emptySquares = nextSquares.map((val, index) => (val === null ? index : null)).filter((val) => val !== null);
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];

    if (randomIndex !== undefined) {
      nextSquares[randomIndex] = 'O'; // Computer's move

      setHistory((prev) => {
        const last = prev[prev.length - 1];
        return prev.concat({ board: nextSquares, isXNext: true }); // Update history with computer's move
      });

      setCurrentMove((prev) => prev + 1);
    }
  };

  // Effect to trigger computer move after player's turn
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