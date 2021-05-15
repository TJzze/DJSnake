class GameBoard {
    constructor(boardRows, boardCols, board) {
        this.rowCount = boardRows;
        this.colCount = boardCols;
        this.board = board;
    }

    getRows () {
        return this.rowCount;
    }

    getCols () {
        return this.colCount;
    }

    drawBoard () {
        this.board.innerHTML = "";

        for (let i = 0; i < this.rowCount; i++) {
            const boardRowElement = document.createElement('div');
            boardRowElement.classList.add('row-element');

            for (let j = 0; j < this.colCount; j++) {
                const block = document.createElement('div');
                block.classList.add('block');
                boardRowElement.appendChild(block);
            }  

            this.board
                .appendChild(boardRowElement);
        }
    }
}

class Snake {
	constructor(snakeBody, speed, list) {
        this.snake = snakeBody;
        this.snakeSpeed = speed;
        this.list = list;
    }

    drawSnake() {
    	for (let i = 0; i < this.snake.length; i++) {
            var x = this.snake[i].x;
            var y = this.snake[i].y;

            this.list[y].children[x].classList.add('snake');
        }
    }

    getSpeed() {
        return this.snakeSpeed;
    }

    getSnake() {
    	return this.snake;
    }

    getTail() {
    	var index = this.snake.length - 1;
        var tail = [this.snake[index].x, this.snake[index].y];
        return tail;
    }

    getHead() {
    	var index = 0;
        var head = [this.snake[index].x, this.snake[index].y];
        return head;
    }

    expandSnake(expandRate) {
        for (let i = 0; i < expandRate; i++) {
            this.snake.push({ ...this.snake[this.snake.length - 1]});
        }
    }

    updateSnakePosition() { //updateBoard
    	var tail = this.getTail();
        this.list[tail[1]].children[tail[0]].classList.remove('snake');

        var headx = this.getHead();

        this.list[head[1].children[head[0]].classList.add('snake'); 
    }

    onSnake(position, ignore) {
        return this.snake.some((bodyPart, index) => {
            if (ignore && index === 0) return false;
            return bodyPart.x === position[0] && bodyPart.y === position[1];
        })
    }

    snakeEatSnake() {
        var head = this.getHead();
        var ignore = true;
        return this.onSnake(head, ignore);
    }
}

class Food {
	constructor(list, food) {
		this.food = food;
		this.list = list;
	}

	getFood() {
		return this.food;
	}

	drawFood(newFood) {
		this.food = newFood;
		var x = this.food.x;
        var y = this.food.y;
        console.log(x);
        console.log(y);

        this.list[y].children[x].classList.add('food');
	}

	eatFood() {
		var x = this.food.x;
        var y = this.food.y;

        this.list[y].children[x].classList.remove('food');
	}
}

class SnakeAndFoodPositions {
    constructor(snake, food, board) {
        this.snake = snake;
        this.food = food;
        this.board = board;
    }

    onFood() {
    	var head = this.snake.getHead();
    	var food = this.food.getFood();
        return head[0] === food.x && head[1] === food.y;
    }

    setFood() {
        var position = {x: -1, y: -1};
        while (position.x === -1 || this.snake.onSnake(position, false)) {
            position.x = Math.floor(Math.random() * this.board.getRows());
            position.y = Math.floor(Math.random() * this.board.getCols());
        }

        return position;
    }
}

class GameProcess {
	constructor(snake, food, positions, board) {
		this.snake = snake;
		this.food = food;
		this.positions = positions;
		this.board = board;
	}

	setDirection(e, oldDirection) {
		let inputDirection = {x: 0, y: 0};

	    switch (e.key) {
	        case 'ArrowUp' :
	            if (oldDirection.y !== 0) break
	            inputDirection = {x: 0, y: -1}
	            break

	        case 'ArrowDown' :
	            if (oldDirection.y !== 0) break
	            inputDirection = {x: 0, y: 1}
	            break

	        case 'ArrowLeft' :
	            if (oldDirection.x !== 0) break
	            inputDirection = {x: -1, y: 0}
	            break

	        case 'ArrowRight' :
	            if (oldDirection.x !== 0 || (oldDirection.x === 0 && oldDirection.y === 0) ) break
	            inputDirection = {x: 1, y: 0}
	            break
	    }

	    if (inputDirection.x === 0 && inputDirection.y === 0) {
	        return oldDirection;
	    }

	    return inputDirection;
	}

	move(direction) {
		if (this.positions.onFood()) {
	        this.food.eatFood();
	        snake.expandSnake(1);
	        var foodNewPos = positions.setFood();
	        this.food.drawFood(foodNewPos);
	    }

	    // var head = this.snake.getHead();

	    for (let i = this.snake.length - 2; i >= 0; i--) {
	        this.snake[i + 1] = { ...this.snake[i] };
	    }

	    if (this.snake[0].x === 0 && direction.x === -1) {
	        this.snake[0].x = this.board.getCols() - 1;
	        this.snake[0].y += direction.y;
	    } else if (this.snake[0].x === this.board.getCols() - 1 && direction.x === 1) {
	        this.snake[0].x = 0;
	        this.snake[0].y += direction.y;
	    } else if (this.snake[0].y === 0 && direction.y === -1) {
	        this.snake[0].x += direction.x;
	        this.snake[0].y = this.board.getRows() - 1;
	    } else if (this.snake[0].y === this.board.getRows() - 1 && direction.y === 1) {
	        this.snake[0].x += direction.x;
	        this.snake[0].y = 0;
	    } else {
	        this.snake[0].x += direction.x;
	        this.snake[0].y += direction.y;
	    }
	}
}

async function main() {
    var board = document.querySelector('.gameboard');
    GameBoard gameBoard = new GameBoard(22, 20, board);
    gameBoard.drawBoard();

    var list = document.querySelectorAll('.row-element');

    snakeBody = [
        {x: 10, y: 10},
        {x: 11, y: 10},
        {x: 12, y: 10},
        {x: 13, y: 10},
        {x: 14, y: 10}
    ];
    var snakeSpeed = 1000;
    Snake snake = new Snake(snakeBody, snakeSpeed, list);

    var foodPos = {x: 0, y: 0};
    const food = new Food(list, foodPos);

    SnakeAndFoodPositions sfPositions = new SnakeAndFoodPositions(snake, food, gameBoard);

    GameProcess game = new GameProcess(snake, food, sfPositions, gameBoard);

    snake.drawSnake();
    food.drawFood();

    let direction = {x: 0, y: 0};
    window.addEventListener('keydown', e => {
        direction = game.setDirection(e, direction);
    })

    setInterval(function gameProcess() { 
        var tail = snake.getTail(); 
        if (direction.x !== 0 || direction.y !== 0) {
            game.move(direction);
            snake.updateSnakePosition();
            if (snake.snakeEatSnake()) {
                console.log("snakeeee");
            }
        }
    }, snake.getSpeed());
}

window.addEventListener('load', main);