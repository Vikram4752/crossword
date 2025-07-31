import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { crosswordAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { 
  RotateCcw, 
  Shuffle, 
  Settings, 
  Timer,
  Trophy,
  Share2
} from 'lucide-react';
import CrosswordGrid from '../components/Crossword/CrosswordGrid';
import CluesList from '../components/Crossword/CluesList';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const Puzzle = () => {
  const { puzzleId } = useParams();
  const { isAuthenticated } = useAuth();
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [puzzleSize, setPuzzleSize] = useState(10);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStats, setGameStats] = useState(null);
  const [submittingScore, setSubmittingScore] = useState(false);

  useEffect(() => {
    loadPuzzle();
  }, [puzzleId]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadPuzzle = async () => {
    try {
      // First try to load from localStorage (for newly generated puzzles)
      const storedPuzzle = localStorage.getItem(`puzzle-${puzzleId}`);
      if (storedPuzzle) {
        const data = JSON.parse(storedPuzzle);
        setPuzzleData(data);
        setIsTimerRunning(true);
        setLoading(false);
        return;
      }

      // For demo puzzle or other cases, you could load from API
      if (puzzleId === 'demo') {
        // Load demo puzzle data
        const demoData = {
          matrix: [
            ['H', 'E', 'L', 'L', 'O'],
            ['-', '-', '-', '-', '-'],
            ['W', 'O', 'R', 'L', 'D'],
            ['-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-']
          ],
          wordList: [
            { word: 'HELLO', clue: 'A greeting' },
            { word: 'WORLD', clue: 'The Earth' }
          ]
        };
        setPuzzleData(demoData);
        setIsTimerRunning(true);
      } else {
        toast.error('Puzzle not found');
      }
    } catch (error) {
      toast.error('Failed to load puzzle');
    } finally {
      setLoading(false);
    }
  };

  const handlePuzzleSubmit = async (results) => {
    setIsTimerRunning(false);
    setGameStats(results);

    if (isAuthenticated && results.isComplete) {
      setSubmittingScore(true);
      try {
        // Extract dictionary ID from puzzle ID (in a real app, this would be handled differently)
        const dictId = puzzleId.split('-')[0];
        if (dictId && dictId !== 'demo') {
          await crosswordAPI.submit(dictId, results.accuracy);
          toast.success('Score submitted to leaderboard!');
        }
      } catch (error) {
        toast.error('Failed to submit score');
      } finally {
        setSubmittingScore(false);
      }
    }
  };

  const handleClearPuzzle = () => {
    setTimer(0);
    setIsTimerRunning(true);
    setGameStats(null);
    // The CrosswordGrid component will handle clearing its own state
  };

  const handleRegeneratePuzzle = async () => {
    if (puzzleId === 'demo') {
      toast.info('Demo puzzle cannot be regenerated');
      return;
    }

    setLoading(true);
    try {
      const dictId = puzzleId.split('-')[0];
      const response = await crosswordAPI.regenerate(dictId, puzzleSize);
      const newPuzzleData = response.data;
      
      setPuzzleData(newPuzzleData);
      setTimer(0);
      setIsTimerRunning(true);
      setGameStats(null);
      
      // Update stored puzzle data
      localStorage.setItem(`puzzle-${puzzleId}`, JSON.stringify(newPuzzleData));
      
      toast.success('Puzzle regenerated!');
    } catch (error) {
      toast.error('Failed to regenerate puzzle');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = async (newSize) => {
    if (puzzleId === 'demo') {
      toast.info('Demo puzzle size cannot be changed');
      return;
    }

    setPuzzleSize(newSize);
    setShowSettings(false);
    setLoading(true);

    try {
      const dictId = puzzleId.split('-')[0];
      const response = await crosswordAPI.generateWithSize(dictId, newSize);
      const newPuzzleData = response.data;
      
      setPuzzleData(newPuzzleData);
      setTimer(0);
      setIsTimerRunning(true);
      setGameStats(null);
      
      // Update stored puzzle data
      localStorage.setItem(`puzzle-${puzzleId}`, JSON.stringify(newPuzzleData));
      
      toast.success(`Puzzle resized to ${newSize}x${newSize}!`);
    } catch (error) {
      toast.error('Failed to resize puzzle');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sharePuzzle = async () => {
    const puzzleUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Crossword Puzzle',
          text: 'Check out this crossword puzzle!',
          url: puzzleUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard(puzzleUrl);
        }
      }
    } else {
      copyToClipboard(puzzleUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Puzzle link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!puzzleData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Puzzle Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          The puzzle you're looking for doesn't exist or has expired.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crossword Puzzle
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {puzzleId === 'demo' ? 'Demo Puzzle' : `Puzzle ID: ${puzzleId}`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Timer */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Timer size={16} />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleClearPuzzle}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={handleRegeneratePuzzle}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2"
          >
            <Shuffle size={16} />
            <span className="hidden sm:inline">New</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Size</span>
          </button>

          <button
            onClick={sharePuzzle}
            className="btn-primary flex items-center space-x-2"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Game Stats */}
      {gameStats && (
        <div className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  {gameStats.isComplete ? 'Puzzle Complete!' : 'Progress Update'}
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  {gameStats.correctCount} of {gameStats.totalCount} correct 
                  ({gameStats.accuracy}%) • Time: {formatTime(gameStats.timeTaken)}
                </p>
              </div>
            </div>
            {submittingScore && <LoadingSpinner size="sm" />}
          </div>
        </div>
      )}

      {/* Puzzle Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Crossword Grid */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <CrosswordGrid
              matrix={puzzleData.matrix}
              wordList={puzzleData.wordList}
              onSubmit={handlePuzzleSubmit}
            />
          </div>
        </div>

        {/* Clues */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Clues
            </h3>
            <CluesList
              wordList={puzzleData.wordList}
              matrix={puzzleData.matrix}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Puzzle Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Puzzle Size
            </label>
            <select
              value={puzzleSize}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              className="input-field"
            >
              {Array.from({ length: 16 }, (_, i) => i + 5).map(size => (
                <option key={size} value={size}>
                  {size} × {size}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Changing the size will generate a new puzzle
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Puzzle;