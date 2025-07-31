import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Save, X } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';

const DictionaryForm = ({ dictionary, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      dictionary: [{ word: '', clue: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dictionary',
  });

  useEffect(() => {
    if (dictionary) {
      reset({
        title: dictionary.title || '',
        dictionary: dictionary.dictionary || [{ word: '', clue: '' }],
      });
    }
  }, [dictionary, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Filter out empty entries
      const filteredDictionary = data.dictionary.filter(
        (entry) => entry.word.trim() && entry.clue.trim()
      );

      if (filteredDictionary.length === 0) {
        throw new Error('Please add at least one word-clue pair');
      }

      await onSave({
        title: data.title.trim(),
        dictionary: filteredDictionary,
      });
    } catch (error) {
      console.error('Error saving dictionary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = () => {
    append({ word: '', clue: '' });
  };

  const removeEntry = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dictionary Title
        </label>
        <input
          type="text"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
            maxLength: {
              value: 250,
              message: 'Title must be less than 250 characters',
            },
          })}
          className="input-field"
          placeholder="Enter dictionary title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Word-Clue Pairs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Word-Clue Pairs
          </label>
          <button
            type="button"
            onClick={addEntry}
            className="btn-secondary flex items-center space-x-2 text-sm"
          >
            <Plus size={16} />
            <span>Add Entry</span>
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Word
                </label>
                <input
                  type="text"
                  {...register(`dictionary.${index}.word`, {
                    required: 'Word is required',
                    minLength: {
                      value: 2,
                      message: 'Word must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Word must be less than 50 characters',
                    },
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: 'Word must contain only letters',
                    },
                  })}
                  className="input-field text-sm"
                  placeholder="Enter word"
                />
                {errors.dictionary?.[index]?.word && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.dictionary[index].word.message}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Clue
                  </label>
                  <input
                    type="text"
                    {...register(`dictionary.${index}.clue`, {
                      required: 'Clue is required',
                      minLength: {
                        value: 5,
                        message: 'Clue must be at least 5 characters',
                      },
                      maxLength: {
                        value: 200,
                        message: 'Clue must be less than 200 characters',
                      },
                    })}
                    className="input-field text-sm"
                    placeholder="Enter clue"
                  />
                  {errors.dictionary?.[index]?.clue && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.dictionary[index].clue.message}
                    </p>
                  )}
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Add at least one word-clue pair. Words should contain only letters.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center space-x-2"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Save size={16} />
          )}
          <span>{dictionary ? 'Update' : 'Create'} Dictionary</span>
        </button>
      </div>
    </form>
  );
};

export default DictionaryForm;