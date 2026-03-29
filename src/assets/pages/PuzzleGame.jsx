import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

export default function PuzzleGame() {
  const [board, setBoard] = useState(Array(CELL_COUNT).fill(0));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('2048-best') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Initialize board
  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best', score.toString());
    }
  }, [score, bestScore]);

  const addRandomTile = (currentBoard) => {
    const emptyCells = currentBoard.map((val, idx) => (val === 0 ? idx : null)).filter((val) => val !== null);
    if (emptyCells.length === 0) return currentBoard;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...currentBoard];
    newBoard[randomCell] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const startNewGame = () => {
    let newBoard = Array(CELL_COUNT).fill(0);
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const move = useCallback((direction) => {
    if (gameOver || won) return;

    let newBoard = [...board];
    let scoreIncrease = 0;
    let moved = false;

    const processRow = (row) => {
      let filtered = row.filter((val) => val);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] !== 0 && filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          scoreIncrease += filtered[i];
          filtered.splice(i + 1, 1);
          filtered.push(0);
        }
      }
      while (filtered.length < GRID_SIZE) filtered.push(0);
      return filtered;
    };

    for (let i = 0; i < GRID_SIZE; i++) {
      let row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        if (direction === 'LEFT' || direction === 'RIGHT') {
          row.push(newBoard[i * GRID_SIZE + j]);
        } else {
          row.push(newBoard[j * GRID_SIZE + i]);
        }
      }

      if (direction === 'RIGHT' || direction === 'DOWN') row.reverse();

      let newRow = processRow(row);

      if (direction === 'RIGHT' || direction === 'DOWN') newRow.reverse();

      for (let j = 0; j < GRID_SIZE; j++) {
        let currentIdx = direction === 'LEFT' || direction === 'RIGHT' ? i * GRID_SIZE + j : j * GRID_SIZE + i;
        if (newBoard[currentIdx] !== newRow[j]) moved = true;
        newBoard[currentIdx] = newRow[j];
      }
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore((s) => s + scoreIncrease);
      checkGameOver(newBoard);
      if (newBoard.includes(2048)) setWon(true);
    }
  }, [board, gameOver, won]);

  const checkGameOver = (currentBoard) => {
    if (currentBoard.includes(0)) return;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = currentBoard[i * GRID_SIZE + j];
        if (j < GRID_SIZE - 1 && current === currentBoard[i * GRID_SIZE + j + 1]) return;
        if (i < GRID_SIZE - 1 && current === currentBoard[(i + 1) * GRID_SIZE + j]) return;
      }
    }
    setGameOver(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); move('UP'); break;
        case 'ArrowDown': e.preventDefault(); move('DOWN'); break;
        case 'ArrowLeft': e.preventDefault(); move('LEFT'); break;
        case 'ArrowRight': e.preventDefault(); move('RIGHT'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val) => {
    const colors = {
      0: 'bg-gray-200 dark:bg-gray-800',
      2: 'bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-100',
      4: 'bg-indigo-100 dark:bg-indigo-800/60 text-gray-800 dark:text-gray-100',
      8: 'bg-blue-300 dark:bg-blue-700 text-white',
      16: 'bg-blue-400 dark:bg-blue-600 text-white',
      32: 'bg-blue-500 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30',
      64: 'bg-blue-600 dark:bg-blue-400 text-white shadow-lg shadow-blue-600/30',
      128: 'bg-purple-400 dark:bg-purple-600 text-white shadow-lg shadow-purple-400/30 text-3xl',
      256: 'bg-purple-500 dark:bg-purple-500 text-white shadow-lg shadow-purple-500/30 text-3xl',
      512: 'bg-purple-600 dark:bg-purple-400 text-white shadow-lg shadow-purple-600/30 text-3xl',
      1024: 'bg-pink-500 dark:bg-pink-500 text-white shadow-lg shadow-pink-500/30 text-2xl',
      2048: 'bg-pink-600 dark:bg-pink-400 text-white shadow-lg shadow-pink-600/30 text-2xl animate-pulse',
    };
    return colors[val] || 'bg-gray-900 text-white text-2xl';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">2048</h1>
          <div className="flex gap-2">
            <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Score</div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{score}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Best</div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{bestScore}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Join the numbers to reach <span className="font-bold text-gray-900 dark:text-gray-100">2048</span>!</p>
          <button 
            onClick={startNewGame}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            New Game
          </button>
        </div>

        {/* Game Board container */}
        <div className="relative bg-gray-100 dark:bg-gray-900 p-3 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-4 gap-3 bg-gray-300 dark:bg-gray-800 p-3 rounded-xl border border-gray-300/50 dark:border-gray-700/50 backdrop-blur-sm">
            {board.map((val, idx) => (
              <div 
                key={idx} 
                className={`w-full aspect-square rounded-xl flex items-center justify-center font-bold text-3xl transition-all duration-200 ${getTileColor(val)} ${val ? 'scale-100' : 'scale-95 opacity-50'}`}
              >
                {val !== 0 ? val : ''}
              </div>
            ))}
          </div>

          {/* Overlays */}
          {(gameOver || won) && (
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-fade-in z-10 border border-transparent">
              <h2 className={`text-4xl font-black mb-4 ${won ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                {won ? 'You Win!' : 'Game Over!'}
              </h2>
              <button 
                onClick={startNewGame}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Use your <span className="font-semibold text-gray-700 dark:text-gray-300">arrow keys</span> to move the tiles. Tiles with the same number merge into one when they touch!</p>
        </div>
      </div>
    </div>
  );
}
