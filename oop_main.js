var food = setFood();
 
function snakeMove(direction) {
    if (onFood()) {
        eatFood(document.querySelectorAll('.row-element'));
        expandSnake();
        food = setFood();
        drawFood(document.querySelectorAll('.row-element'));
    }

    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }

    if (snakeBody[0].x === 0 && direction.x === -1) {
        snakeBody[0].x = BOARD_COLS - 1;
        snakeBody[0].y += direction.y;
    } else if (snakeBody[0].x === BOARD_COLS - 1 && direction.x === 1) {
        snakeBody[0].x = 0;
        snakeBody[0].y += direction.y;
    } else if (snakeBody[0].y === 0 && direction.y === -1) {
        snakeBody[0].x += direction.x;
        snakeBody[0].y = BOARD_ROWS - 1;
    } else if (snakeBody[0].y === BOARD_ROWS - 1 && direction.y === 1) {
        snakeBody[0].x += direction.x;
        snakeBody[0].y = 0;
    } else {
        snakeBody[0].x += direction.x;
        snakeBody[0].y += direction.y;
    }
}

function setDirection(e, oldDirection) {
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

    setFood(positions) {
        var position = {x: -1, y: -1};
        while (position.x === -1 || positions.onSnake(position, false)) {
            position.x = Math.floor(Math.random() * this.board.getRows());
            position.y = Math.floor(Math.random() * this.board.getCols());
        }

        return position;
    }
}

class Food {
    constructor(list, food) {
        this.food = food;
        this.list = list;
    }

    drawFood() {
        var x = this.food.x;
        var y = this.food.y;

        this.list[y].children[x].classList.add('food');
    }

    eatFood() {
        var x = this.food.x;
        var y = this.food.y;

        this.list[y].children[x].classList.remove('food');
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

    getTail() {
        var index = this.snake.length - 1;
        var tail = [this.snake[index].x, this.snake[index].y];
        return tail;
    }

    expandSnake(expandRate) {
        for (let i = 0; i < expandRate; i++) {
            this.snake.push({ ...this.snake[this.snake.length - 1]});
        }
    }

    updateSnakePosition(list, tail) { //updateBoard
        list[tail[1]].children[tail[0]].classList.remove('snake');

        var headx = snakeBody[0].x;
        var heady = snakeBody[0].y;

        list[heady].children[headx].classList.add('snake'); 
    }
}

class SnakeAndFoodPositions {
    constructor(snake, food) {
        this.snake = snake;
        this.food = food;
    }

    onSnake(position, ignore) {
        return this.snake.some((bodyPart, index) => {
            if (ignore && index === 0) return false;
            return bodyPart.x === position.x && bodyPart.y === position.y;
        })
    }

    snakeEatSnake() {
        var x = this.snake[0].x;
        var y = this.snake[0].y;

        var head = {x, y};
        var ignore = true;
        return this.onSnake(head, ignore);
    }

    onFood() {
        return this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
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

    SnakeAndFoodPositions sfPositions = new SnakeAndFoodPositions(snake, food);

    var foodPos = gameboard.setFood(sfPositions);
    Food food = new Food(list, foodPos);

    snake.drawSnake();
    food.drawFood();

    let direction = {x: 0, y: 0};
    window.addEventListener('keydown', e => {
        direction = setDirection(e, direction);
    })

    setInterval(function gameProcess() { 
        var tail = snake.getTail(); 
        if (direction.x !== 0 || direction.y !== 0) {
            snakeMove(direction);
            updateBoard(gridList, tail);
            if (sfPositions.snakeEatSnake) {
                console.log("snakeeee");
            }
        }
    }, snake.getSpeed());
}

window.addEventListener('load', main);