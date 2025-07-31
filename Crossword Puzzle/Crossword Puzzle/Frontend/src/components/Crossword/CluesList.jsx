import React from 'react';

const CluesList = ({ wordList, matrix }) => {
  if (!wordList || !matrix) {
    return null;
  }

  // Separate clues into Across and Down
  const acrossClues = [];
  const downClues = [];

  // This is a simplified version - you'd need to implement proper clue numbering
  // based on your crossword generation algorithm
  wordList.forEach((wordObj, index) => {
    const clue = {
      number: index + 1,
      clue: wordObj.clue,
      word: wordObj.word
    };

    // For demo purposes, alternate between across and down
    if (index % 2 === 0) {
      acrossClues.push(clue);
    } else {
      downClues.push(clue);
    }
  });

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Across Clues */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Across
        </h3>
        <div className="space-y-2">
          {acrossClues.map((clue) => (
            <div
              key={`across-${clue.number}`}
              className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-bold text-primary-600 dark:text-primary-400 min-w-[2rem]">
                {clue.number}.
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {clue.clue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Down Clues */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Down
        </h3>
        <div className="space-y-2">
          {downClues.map((clue) => (
            <div
              key={`down-${clue.number}`}
              className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-bold text-primary-600 dark:text-primary-400 min-w-[2rem]">
                {clue.number}.
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {clue.clue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CluesList;