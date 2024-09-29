class Word {
    constructor(word, clue) {
        this.word = word;
        this.clue = clue;
    }

    getLength() {
        return this.word.length;
    }
}

class Coordinate {
    constructor(x, y) {
        this.row = x;
        this.col = y;
    }

    toString() {
        return `(${this.row}, ${this.col})`;
    }
}

function init(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = '-';
        }
    }
}

function checkhorizontalafter(wordList, oldword, placed, row, col, matrix, nontracklist) {
    for (let i = 0; i < oldword.length; i++) {
        const c = oldword.charAt(i);
        for (let j = 0; j < wordList.length; j++) {
            const word = wordList[j].word;
            if (placed.includes(word)) {
                continue;
            }
            for (let k = 0; k < word.length; k++) {
                if (c === word.charAt(k)) {
                    const newCol = col - k;
                    if (newCol >= 0 && newCol + word.length <= matrix[0].length) {
                        if (checkhorizontal(word, row + i, newCol, matrix, nontracklist)) {
                            placehorizontal(word, placed, row + i, newCol, matrix, nontracklist);
                            break;
                        }
                    }
                }
            }
        }
    }
}

function checkafter(wordList, oldword, placed, row, col, matrix, nontracklist) {
    for (let i = 0; i < oldword.length; i++) {
        const c = oldword.charAt(i);
        for (let j = 0; j < wordList.length; j++) {
            const word = wordList[j].word;
            if (placed.includes(word)) {
                continue;
            }
            for (let k = 0; k < word.length; k++) {
                if (c === word.charAt(k)) {
                    const newRow = row - k;
                    if (newRow >= 0 && newRow + word.length <= matrix.length) {
                        if (checkvertical(word, newRow, col + i, matrix, nontracklist)) {
                            placevertical(word, placed, newRow, col + i, matrix, nontracklist);
                            break;
                        }
                    }
                }
            }
        }
    }
}

function checkvertical(word, row, col, matrix, nontracklist) {
    if (row + word.length > matrix.length) {
        return false;
    }
    for (let i = row; i < row + word.length; i++) {
        for (const coord of nontracklist) {
            if (i === coord.row && col === coord.col) {
                return false;
            }
        }
    }
    for (let i = 0; i < word.length; i++) {
        if (matrix[row + i][col] !== '-' && matrix[row + i][col] !== word.charAt(i)) {
            return false;
        }
    }
    for (let i = 0; i < word.length; i++) {
        if (col > 0) {
            if (matrix[row + i][col - 1] !== '-') {
                if ((i > 0 && matrix[row + i - 1][col - 1] !== '-') || (i < word.length - 1 && matrix[row + i + 1][col - 1] !== '-')) {
                    return false;
                }
            }
        }
        if (col < matrix[0].length - 1) {
            if (matrix[row + i][col + 1] !== '-') {
                if ((i > 0 && matrix[row + i - 1][col + 1] !== '-') || (i < word.length - 1 && matrix[row + i + 1][col + 1] !== '-')) {
                    return false;
                }
            }
        }
    }
    if (row > 0 && matrix[row - 1][col] !== '-') {
        return false;
    }
    if (row + word.length < matrix.length && matrix[row + word.length][col] !== '-') {
        return false;
    }
    return true;
}

function checkhorizontal(word, row, col, matrix, nontracklist) {
    if (col + word.length > matrix[0].length) {
        return false;
    }
    for (let i = col; i < col + word.length; i++) {
        for (const coord of nontracklist) {
            if (row === coord.row && i === coord.col) {
                return false;
            }
        }
    }
    for (let i = 0; i < word.length; i++) {
        if (matrix[row][col + i] !== '-' && matrix[row][col + i] !== word.charAt(i)) {
            return false;
        }
    }
    for (let i = 0; i < word.length; i++) {
        if (row > 0) {
            if (matrix[row - 1][col + i] !== '-') {
                if ((i > 0 && matrix[row - 1][col + i - 1] !== '-') || (i < word.length - 1 && matrix[row - 1][col + i + 1] !== '-')) {
                    return false;
                }
            }
        }
        if (row < matrix.length - 1) {
            if (matrix[row + 1][col + i] !== '-') {
                if ((i > 0 && matrix[row + 1][col + i - 1] !== '-') || (i < word.length - 1 && matrix[row + 1][col + i + 1] !== '-')) {
                    return false;
                }
            }
        }
    }
    if (col > 0 && matrix[row][col - 1] !== '-') {
        return false;
    }
    if (col + word.length < matrix[0].length && matrix[row][col + word.length] !== '-') {
        return false;
    }
    return true;
}

function generateClues(wordList, matrix) {
    console.log("Across Clues:");
    for (const wordObj of wordList) {
        if (isWordPlacedHorizontally(wordObj.word, matrix)) {
            console.log(`${wordObj.word}: ${wordObj.clue}`);
        }
    }

    console.log("Down Clues:");
    for (const wordObj of wordList) {
        if (isWordPlacedVertically(wordObj.word, matrix)) {
            console.log(`${wordObj.word}: ${wordObj.clue}`);
        }
    }
}

function placehorizontal(word, placed, row, col, matrix, nontracklist) {
    for (let i = 0; i < word.length; i++) {
        matrix[row][col + i] = word.charAt(i);
    }
    if (col > 0) {
        nontracklist.push(new Coordinate(row, col - 1));
        if (row > 0) {
            nontracklist.push(new Coordinate(row - 1, col - 1));
        }
        if (row < matrix.length - 1) {
            nontracklist.push(new Coordinate(row + 1, col - 1));
        }
    }
    if (col + word.length < matrix[0].length) {
        nontracklist.push(new Coordinate(row, col + word.length));
        if (row > 0) {
            nontracklist.push(new Coordinate(row - 1, col + word.length));
        }
        if (row < matrix.length - 1) {
            nontracklist.push(new Coordinate(row + 1, col + word.length));
        }
    }
    if (row > 0) {
        nontracklist.push(new Coordinate(row - 1, col));
        nontracklist.push(new Coordinate(row - 1, col + word.length - 1));
    }
    if (row < matrix.length - 1) {
        nontracklist.push(new Coordinate(row + 1, col));
        nontracklist.push(new Coordinate(row + 1, col + word.length - 1));
    }
    placed.push(word);
}

function placevertical(word, placed, row, col, matrix, nontracklist) {
    for (let i = 0; i < word.length; i++) {
        matrix[row + i][col] = word.charAt(i);
    }
    if (row > 0) {
        nontracklist.push(new Coordinate(row - 1, col));
        if (col > 0) {
            nontracklist.push(new Coordinate(row - 1, col - 1));
        }
        if (col < matrix[0].length - 1) {
            nontracklist.push(new Coordinate(row - 1, col + 1));
        }
    }
    if (row + word.length < matrix.length) {
        nontracklist.push(new Coordinate(row + word.length, col));
        if (col > 0) {
            nontracklist.push(new Coordinate(row + word.length, col - 1));
        }
        if (col < matrix[0].length - 1) {
            nontracklist.push(new Coordinate(row + word.length, col + 1));
        }
    }
    if (col > 0) {
        nontracklist.push(new Coordinate(row, col - 1));
    }
    if (col < matrix[0].length - 1) {
        nontracklist.push(new Coordinate(row, col + 1));
    }
    placed.push(word);
}

function print(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        console.log(matrix[i].join(" "));
    }
}

function isWordPlacedHorizontally(word, matrix) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length - word.length + 1; col++) {
            let match = true;
            for (let i = 0; i < word.length; i++) {
                if (matrix[row][col + i] !== word.charAt(i)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
    }
    return false;
}

function isWordPlacedVertically(word, matrix) {
    for (let row = 0; row < matrix.length - word.length + 1; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
            let match = true;
            for (let i = 0; i < word.length; i++) {
                if (matrix[row + i][col] !== word.charAt(i)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
    }
    return false;
}

function main() {
    const random = Math.random;

    const wordList = [
        new Word("QUEUE", "A data structure that follows FIFO"),
        new Word("SORTING", "The process of arranging elements"),
        new Word("SETS", "A collection of unique elements"),
        new Word("DEQUE", "A double-ended queue"),
        new Word("CHAR", "A character data type"),
        new Word("STACK", "A data structure that follows LIFO"),
        new Word("TREE", "A hierarchical data structure"),
        new Word("GREEDY", "An algorithm that makes local optimal choices"),
        new Word("ARRAY", "A collection of elements identified by index"),
        new Word("RECURSION", "A function that calls itself")
    ];

    const nontracklist = [];
    const placed = [];
    wordList.sort((w1, w2) => w2.getLength() - w1.getLength());

    const matrix = Array.from({ length: 11 }, () => Array(11).fill('-'));
    init(matrix);

    let row, col;
    let placedWord = false;

    for (let attempts = 0; attempts < 100; attempts++) {
        for (let i = 0; i < wordList.length; i++) {
            row = Math.floor(random() * matrix.length);
            col = Math.floor(random() * matrix[0].length);
            const vertical = random() < 0.5;

            if (placed.includes(wordList[i].word)) {
                continue;
            }

            if (vertical) {
                if (checkvertical(wordList[i].word, row, col, matrix, nontracklist)) {
                    placevertical(wordList[i].word, placed, row, col, matrix, nontracklist);
                    checkhorizontalafter(wordList, wordList[i].word, placed, row, col, matrix, nontracklist);
                    placedWord = true;
                    break;
                }
            } else {
                if (checkhorizontal(wordList[i].word, row, col, matrix, nontracklist)) {
                    placehorizontal(wordList[i].word, placed, row, col, matrix, nontracklist);
                    checkafter(wordList, wordList[i].word, placed, row, col, matrix, nontracklist);
                    placedWord = true;
                    break;
                }
            }
        }
    }

    if (!placedWord) {
        console.log("Failed to place the longest word.");
    }

    module.exports.matrix = matrix;

    // print(matrix);
    console.log();
    console.log();
    console.log();
    // module.exports.generateClues =  generateClues(wordList, matrix);
}

main();