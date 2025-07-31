import React, { useState, useEffect, useRef } from 'react';

const CrosswordGrid = ({ matrix, wordList, onSubmit, showAnswers = false }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [validation, setValidation] = useState({});
  const [startTime] = useState(Date.now());
  const inputRefs = useRef({});

  const size = matrix?.length || 0;

  useEffect(() => {
    if (matrix) {
      // Initialize user answers
      const answers = {};
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (matrix[i][j] !== '-') {
            answers[`${i}-${j}`] = '';
          }
        }
      }
      setUserAnswers(answers);
      setValidation({});
    }
  }, [matrix, size]);

  const handleInputChange = (row, col, value) => {
    if (value.length > 1) return;
    
    const key = `${row}-${col}`;
    setUserAnswers(prev => ({
      ...prev,
      [key]: value.toUpperCase()
    }));

    // Auto-focus next cell
    if (value && !showAnswers) {
      focusNextCell(row, col);
    }
  };

  const handleKeyDown = (e, row, col) => {
    const { key } = e;
    
    if (key === 'Backspace' && !userAnswers[`${row}-${col}`]) {
      focusPreviousCell(row, col);
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      handleArrowNavigation(key, row, col);
    }
  };

  const focusNextCell = (row, col) => {
    // Try right first, then down
    const nextPositions = [
      [row, col + 1],
      [row + 1, col],
    ];

    for (const [nextRow, nextCol] of nextPositions) {
      if (isValidCell(nextRow, nextCol)) {
        const nextRef = inputRefs.current[`${nextRow}-${nextCol}`];
        if (nextRef) {
          nextRef.focus();
          break;
        }
      }
    }
  };

  const focusPreviousCell = (row, col) => {
    // Try left first, then up
    const prevPositions = [
      [row, col - 1],
      [row - 1, col],
    ];

    for (const [prevRow, prevCol] of prevPositions) {
      if (isValidCell(prevRow, prevCol)) {
        const prevRef = inputRefs.current[`${prevRow}-${prevCol}`];
        if (prevRef) {
          prevRef.focus();
          break;
        }
      }
    }
  };

  const handleArrowNavigation = (key, row, col) => {
    let nextRow = row;
    let nextCol = col;

    switch (key) {
      case 'ArrowUp':
        nextRow = row - 1;
        break;
      case 'ArrowDown':
        nextRow = row + 1;
        break;
      case 'ArrowLeft':
        nextCol = col - 1;
        break;
      case 'ArrowRight':
        nextCol = col + 1;
        break;
    }

    if (isValidCell(nextRow, nextCol)) {
      const nextRef = inputRefs.current[`${nextRow}-${nextCol}`];
      if (nextRef) {
        nextRef.focus();
      }
    }
  };

  const isValidCell = (row, col) => {
    return row >= 0 && row < size && col >= 0 && col < size && matrix[row][col] !== '-';
  };

  const validateAnswers = () => {
    const newValidation = {};
    let correctCount = 0;
    let totalCount = 0;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j] !== '-') {
          const key = `${i}-${j}`;
          const userAnswer = userAnswers[key] || '';
          const correctAnswer = matrix[i][j];
          
          totalCount++;
          if (userAnswer === correctAnswer) {
            correctCount++;
            newValidation[key] = 'correct';
          } else if (userAnswer) {
            newValidation[key] = 'incorrect';
          }
        }
      }
    }

    setValidation(newValidation);
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    if (onSubmit) {
      onSubmit({
        correctCount,
        totalCount,
        accuracy,
        timeTaken,
        isComplete: correctCount === totalCount
      });
    }

    return { correctCount, totalCount, accuracy, timeTaken };
  };

  const clearAnswers = () => {
    const clearedAnswers = {};
    Object.keys(userAnswers).forEach(key => {
      clearedAnswers[key] = '';
    });
    setUserAnswers(clearedAnswers);
    setValidation({});
  };

  const getCellClass = (row, col) => {
    const key = `${row}-${col}`;
    const baseClass = 'crossword-cell';
    
    if (matrix[row][col] === '-') {
      return `${baseClass} crossword-cell-blocked`;
    }

    let statusClass = 'crossword-cell-active';
    if (validation[key] === 'correct') {
      statusClass = 'crossword-cell-correct';
    } else if (validation[key] === 'incorrect') {
      statusClass = 'crossword-cell-incorrect';
    }

    return `${baseClass} ${statusClass}`;
  };

  const getClueNumber = (row, col) => {
    // This would need to be calculated based on word positions
    // For now, return null - this should be enhanced based on your crossword generation logic
    return null;
  };

  if (!matrix || size === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">No crossword puzzle loaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Grid */}
      <div
        className="crossword-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const clueNumber = getClueNumber(rowIndex, colIndex);
            
            return (
              <div key={key} className="crossword-cell-wrapper">
                {clueNumber && (
                  <span className="clue-number">{clueNumber}</span>
                )}
                <input
                  ref={el => inputRefs.current[key] = el}
                  type="text"
                  maxLength={1}
                  className={getCellClass(rowIndex, colIndex)}
                  value={showAnswers ? cell : (userAnswers[key] || '')}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  disabled={cell === '-' || showAnswers}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={validateAnswers}
          className="btn-primary"
        >
          Check Answers
        </button>
        <button
          onClick={clearAnswers}
          className="btn-secondary"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CrosswordGrid;