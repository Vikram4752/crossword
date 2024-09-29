const { matrix } = require('./cross_word.js');

function print(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    let row = "";
    for (let j = 0; j < matrix[i].length; j++) {
      row += matrix[i][j] + " "; 
    }
    console.log(row.trim());
  }
}

function convertToBooleanMatrix(matrix) {
  // Convert the matrix to true/false values
  return matrix.map(row =>
    row.map(cell => cell !== '-') // True if the cell contains a character, false if it's "-"
  );
}

const booleanMatrix = convertToBooleanMatrix(matrix);
print(matrix);
print(booleanMatrix);

function createCrossword(matrix) {
  const crosswordContainer = document.getElementById('crossword');
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Set grid template rows and columns based on the matrix size
  crosswordContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  crosswordContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Loop through the matrix and create input fields or black boxes
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.maxLength = 1; // Limit input to one character
      cell.className = 'crossword-cell';
      if (matrix[i][j] === false) {
        cell.classList.add('black-box');
        cell.disabled = true; // Disable input for black boxes
      }
      crosswordContainer.appendChild(cell);
    }
  }
}

// Call the function to create the crossword
createCrossword(booleanMatrix);

// Function to handle form submission (extract input values)
function submitCrossword() {
  const inputs = document.querySelectorAll('.crossword-cell');
  let userAnswers = [];
  let isCorrect = true;

  // Extract user input from the crossword
  inputs.forEach((input, index) => {
    const row = Math.floor(index / booleanMatrix[0].length);
    const col = index % booleanMatrix[0].length;
    
    if (!input.disabled) {
      userAnswers.push(input.value);
      // Compare with the original matrix
      if (input.value !== matrix[row][col]) {
        isCorrect = false;
      }
    }
  });

  // Show validation result
  if (isCorrect) {
    alert("Correct! You've completed the crossword puzzle!");
  } else {
    alert("Some answers are incorrect. Please try again.");
  }
}
