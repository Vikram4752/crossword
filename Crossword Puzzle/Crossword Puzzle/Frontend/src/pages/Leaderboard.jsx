import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dictionaryAPI, crosswordAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { Trophy, Medal, Award, Users, Target } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Leaderboard = () => {
  const { isAuthenticated } = useAuth();
  const [dictionaries, setDictionaries] = useState([]);
  const [selectedDict, setSelectedDict] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadDictionaries();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedDict) {
      loadLeaderboard(selectedDict);
    }
  }, [selectedDict]);

  const loadDictionaries = async () => {
    try {
      const response = await dictionaryAPI.getAll();
      const dicts = response.data.data || [];
      setDictionaries(dicts);
      if (dicts.length > 0) {
        setSelectedDict(dicts[0].id);
      }
    } catch (error) {
      toast.error('Failed to load dictionaries');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (dictId) => {
    setLoadingLeaderboard(true);
    try {
      const response = await crosswordAPI.getLeaderboard(dictId);
      setLeaderboardData(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load leaderboard');
      setLeaderboardData([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 2:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 3:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Login Required
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You need to be logged in to view leaderboards
        </p>
        <a href="/login" className="btn-primary">
          Sign In
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (dictionaries.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Dictionaries Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create some dictionaries and generate puzzles to see leaderboards
        </p>
        <a href="/dashboard" className="btn-primary">
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Leaderboards
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          See how you rank against other puzzle solvers
        </p>
      </div>

      {/* Dictionary Selector */}
      <div className="card p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Dictionary
        </label>
        <select
          value={selectedDict || ''}
          onChange={(e) => setSelectedDict(e.target.value)}
          className="input-field max-w-md"
        >
          {dictionaries.map((dict) => (
            <option key={dict.id} value={dict.id}>
              {dict.title}
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Top Scores
          </h2>
        </div>

        {loadingLeaderboard ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              No scores yet for this dictionary. Be the first to complete a puzzle!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboardData.map((entry, index) => {
              const rank = index + 1;
              return (
                <div
                  key={entry._id || index}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    rank <= 3
                      ? 'bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20 border-primary-200 dark:border-primary-800'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>

                    {/* User Info */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {entry.userName || 'Anonymous User'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Rank #{rank}
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankBadgeColor(rank)}`}>
                      {entry.score}% accuracy
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {leaderboardData.length > 0 ? leaderboardData[0]?.score || 0 : 0}%
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Top Score</p>
        </div>
        
        <div className="card p-6 text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {leaderboardData.length}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Total Players</p>
        </div>
        
        <div className="card p-6 text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {leaderboardData.length > 0 
              ? Math.round(leaderboardData.reduce((sum, entry) => sum + (entry.score || 0), 0) / leaderboardData.length)
              : 0}%
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Average Score</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;