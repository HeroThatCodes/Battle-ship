class BattleshipGame {
  constructor() {
    this.boardSize = 5; 
    this.shipLength = 3; // Length of the ship
    this.numShips = 3; // Number of ships in the game
    this.shipsSunkByUser = 0; // Counter to track the number of user's sunken ships
    this.shipsSunkByComputer = 0; // Counter to track the number of computer's sunken ships

    this.userShips = []; // Array to hold user's ship locations and hits
    this.computerShips = []; // Array to hold computer's ship locations and hits

    // Initialize the game board for the user and computer
    this.userBoard = [];
    this.computerBoard = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.userBoard[i] = Array(this.boardSize).fill('');
      this.computerBoard[i] = Array(this.boardSize).fill('');
    }

    // Place ships for the user and computer
    this.placeShips(this.userShips);
    this.placeShips(this.computerShips);
  }

  placeShips(ships) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = {
        locations: [],
        hits: Array(this.shipLength).fill(false)
      };
      this.generateShipLocations(ship, ships);
      ships.push(ship);
    }
  }

  generateShipLocations(ship, shipsArray) {
    let isCollision;
    do {
      let row = Math.floor(Math.random() * this.boardSize);
      let col = Math.floor(Math.random() * this.boardSize);
      let horizontal = Math.random() < 0.5;

      isCollision = false;
      if (horizontal) {
        if (col + this.shipLength > this.boardSize) {
          isCollision = true;
          continue;
        }
        for (let i = col; i < col + this.shipLength; i++) {
          if (shipsArray === this.userShips && this.userBoard[row][i] !== '') {
            isCollision = true;
            break;
          } else if (shipsArray === this.computerShips && this.computerBoard[row][i] !== '') {
            isCollision = true;
            break;
          }
        }
        if (!isCollision) {
          for (let i = col; i < col + this.shipLength; i++) {
            ship.locations.push(`${row}${i}`);
            if (shipsArray === this.userShips) {
              this.userBoard[row][i] = 'S'; // 'S' denotes a user's ship cell on the board
            } else {
              this.computerBoard[row][i] = 'S'; // 'S' denotes a computer's ship cell on the board
            }
          }
        }
      } else {
        if (row + this.shipLength > this.boardSize) {
          isCollision = true;
          continue;
        }
        for (let i = row; i < row + this.shipLength; i++) {
          if (shipsArray === this.userShips && this.userBoard[i][col] !== '') {
            isCollision = true;
            break;
          } else if (shipsArray === this.computerShips && this.computerBoard[i][col] !== '') {
            isCollision = true;
            break;
          }
        }
        if (!isCollision) {
          for (let i = row; i < row + this.shipLength; i++) {
            ship.locations.push(`${i}${col}`);
            if (shipsArray === this.userShips) {
              this.userBoard[i][col] = 'S';
            } else {
              this.computerBoard[i][col] = 'S';
            }
          }
        }
      }
    } while (isCollision);
  }

  createGameBoard(boardId, boardArray) {
    const board = document.getElementById(boardId);
    board.innerHTML = ''; // Clear the board
  
    for (let i = -1; i < this.boardSize; i++) {
      const row = document.createElement('tr');
      for (let j = -1; j < this.boardSize; j++) {
        const cell = document.createElement('td');
        
        if (i === -1 && j !== -1) {
          cell.textContent = j;
        } else if (j === -1 && i !== -1) {
          cell.textContent = String.fromCharCode(65 + i); 
        } else if (i !== -1 && j !== -1) {
          if (boardId === 'computerBoard') {
            const value = boardArray[i][j];
            cell.textContent = value === 'S' ? '' : value;
          } else {
            cell.textContent = boardArray[i][j] || '';
          }
        }
        
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  }

  updateGameBoards() {
    this.createGameBoard('userBoard', this.userBoard);
    this.createGameBoard('computerBoard', this.computerBoard);
  }

 
  checkUserGuess(userGuess) {
    const rowChar = userGuess.charAt(0);
    const col = parseInt(userGuess.charAt(1));
    
    const row = rowChar.charCodeAt(0) - 65; 
    
    for (let ship of this.computerShips) {
      for (let i = 0; i < ship.locations.length; i++) {
        const shipRow = parseInt(ship.locations[i].charAt(0));
        const shipCol = parseInt(ship.locations[i].charAt(1));
        
        if (row === shipRow && col === shipCol) {
          ship.hits[i] = true;
          if (ship.hits.every(hit => hit)) {
            this.shipsSunkByUser++;
            return 'Hit and sunk a ship!';
          }
          return 'Hit!';
        }
      }
    }
    return 'Miss!';
  }
  

  computerTurn() {
    let row = Math.floor(Math.random() * this.boardSize);
    let col = Math.floor(Math.random() * this.boardSize);
    let computerGuess = `${row}${col}`;

    for (let ship of this.userShips) {
      let index = ship.locations.indexOf(computerGuess);
      if (index !== -1) {
        ship.hits[index] = true;
        if (ship.hits.every(hit => hit)) {
          this.shipsSunkByComputer++;
          return `Computer hit and sunk a ship at ${computerGuess}!`;
        }
        return `Computer hit at ${computerGuess}!`;
      }
    }
    return `Computer missed at ${computerGuess}!`;
  }

  isUserGameOver() {
    return this.shipsSunkByUser === this.numShips;
  }

  isComputerGameOver() {
    return this.shipsSunkByComputer === this.numShips;
  }
}


const game = new BattleshipGame();
game.createGameBoard('userBoard', game.userBoard);
game.createGameBoard('computerBoard', game.computerBoard);


const attackButton = document.getElementById('attackButton');
attackButton.addEventListener('click', () => {
  const userInput = document.getElementById('userInput').value.toUpperCase();
  if (userInput && userInput.match(/^[A-E][0-4]$/)) {
    const userResult = game.checkUserGuess(userInput);
    document.getElementById('userResult').innerText = userResult;
    game.updateGameBoards();

    if (!game.isComputerGameOver()) {
      const computerResult = game.computerTurn();
      document.getElementById('computerResult').innerText = computerResult;
      game.updateGameBoards();

      if (game.isComputerGameOver()) {
        document.getElementById('computerResult').innerText = 'Computer has destroyed all your ships! Game over.';
        attackButton.disabled = true;
      }
    } else {
      document.getElementById('userResult').innerText = 'You have destroyed all computer ships! Game over.';
      attackButton.disabled = true;
    }
  } else {
    document.getElementById('userResult').innerText = 'Invalid input. Please enter coordinates (a0 - e4).';
  }
});

