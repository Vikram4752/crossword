import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dictionaryAPI, crosswordAPI } from '../utils/api';
import { toast } from 'react-toastify';
import {
  Plus,
  BookOpen,
  Puzzle,
  Edit,
  Trash2,
  Play,
  Users
} from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';
import DictionaryForm from '../components/Dictionary/DictionaryForm';
import PuzzlePreviewModal from '../components/Crossword/PuzzlePreviewModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [dictionaries, setDictionaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [editingDictionary, setEditingDictionary] = useState(null);
  const [showPuzzlePreview, setShowPuzzlePreview] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [currentPuzzleId, setCurrentPuzzleId] = useState(null);
  const [generatingPuzzle, setGeneratingPuzzle] = useState(null);

  useEffect(() => {
    loadDictionaries();
  }, []);

  const loadDictionaries = async () => {
    try {
      const response = await dictionaryAPI.getAll();
      const data = response.data?.data || response.data || [];
      setDictionaries(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load dictionaries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDictionary = () => {
    setEditingDictionary(null);
    setShowDictionaryModal(true);
  };

  const handleEditDictionary = async (dict) => {
    try {
      const response = await dictionaryAPI.get(dict.id);
      setEditingDictionary(response.data.data);
      setShowDictionaryModal(true);
    } catch (error) {
      toast.error('Failed to load dictionary details');
    }
  };

  const handleDeleteDictionary = async (dictId) => {
    if (!window.confirm('Are you sure you want to delete this dictionary?')) return;
    try {
      await dictionaryAPI.delete(dictId);
      toast.success('Dictionary deleted');
      loadDictionaries();
    } catch (error) {
      toast.error('Failed to delete dictionary');
    }
  };

  const handleDictionarySave = async (dictionaryData) => {
    try {
      if (editingDictionary) {
        await dictionaryAPI.update(editingDictionary._id, dictionaryData);
        toast.success('Dictionary updated');
      } else {
        await dictionaryAPI.create(dictionaryData);
        toast.success('Dictionary created');
      }
      setShowDictionaryModal(false);
      setEditingDictionary(null);
      loadDictionaries();
    } catch (error) {
      toast.error('Failed to save dictionary');
    }
  };

  const handleGeneratePuzzle = async (dictId, size = 10) => {
    setGeneratingPuzzle(dictId);
    try {
      const response = await crosswordAPI.generateWithSize(dictId, size);
      const puzzleData = response.data;
      const puzzleId = `${dictId}-${Date.now()}`;
      localStorage.setItem(`puzzle-${puzzleId}`, JSON.stringify(puzzleData));
      setCurrentPuzzle(puzzleData);
      setCurrentPuzzleId(puzzleId);
      setShowPuzzlePreview(true);
    } catch (error) {
      toast.error('Failed to generate puzzle');
    } finally {
      setGeneratingPuzzle(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Welcome Section */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Welcome back, <span className="text-primary-600 dark:text-primary-400">{user?.email}</span>!
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-300">
          Manage your dictionaries and create amazing crossword puzzles.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col items-center py-8 px-4">
          <BookOpen className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-3" />
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{dictionaries.length}</span>
          <span className="text-gray-500 dark:text-gray-300 mt-1">Dictionaries</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col items-center py-8 px-4">
          <Puzzle className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
          <span className="text-3xl font-bold text-gray-900 dark:text-white">∞</span>
          <span className="text-gray-500 dark:text-gray-300 mt-1">Puzzles Created</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col items-center py-8 px-4">
          <Users className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
          <span className="text-3xl font-bold text-gray-900 dark:text-white">∞</span>
          <span className="text-gray-500 dark:text-gray-300 mt-1">Shares</span>
        </div>
      </section>

      {/* Dictionaries Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Dictionaries</h2>
          <button
            onClick={handleCreateDictionary}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow transition"
          >
            <Plus size={20} />
            <span>New Dictionary</span>
          </button>
        </div>

        {dictionaries.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-12 text-center flex flex-col items-center">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No dictionaries yet</h3>
            <p className="text-gray-500 dark:text-gray-300 mb-6">Create your first dictionary to start generating crossword puzzles.</p>
            <button
              onClick={handleCreateDictionary}
              className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow transition"
            >
              Create Your First Dictionary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dictionaries.map((dict) => (
              <div
                key={dict.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[70%]">
                    {dict.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditDictionary(dict)}
                      className="p-2 rounded hover:bg-primary-50 dark:hover:bg-primary-900 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition"
                      title="Edit dictionary"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDictionary(dict.id)}
                      className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="Delete dictionary"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Ready to generate puzzles</p>
                  <button
                    onClick={() => handleGeneratePuzzle(dict.id)}
                    disabled={generatingPuzzle === dict.id}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow transition ${
                      generatingPuzzle === dict.id
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {generatingPuzzle === dict.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Generate Puzzle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dictionary Modal */}
      <Modal
        isOpen={showDictionaryModal}
        onClose={() => {
          setShowDictionaryModal(false);
          setEditingDictionary(null);
        }}
        title={editingDictionary ? 'Edit Dictionary' : 'Create New Dictionary'}
        size="lg"
      >
        <DictionaryForm
          dictionary={editingDictionary}
          onSave={handleDictionarySave}
          onCancel={() => {
            setShowDictionaryModal(false);
            setEditingDictionary(null);
          }}
        />
      </Modal>

      {/* Puzzle Preview Modal */}
      <PuzzlePreviewModal
        isOpen={showPuzzlePreview}
        onClose={() => setShowPuzzlePreview(false)}
        puzzleData={currentPuzzle}
        puzzleId={currentPuzzleId}
      />
    </div>
  );
};

export default Dashboard;
