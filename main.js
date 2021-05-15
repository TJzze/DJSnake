const Direction = {
    None: 0,
    Left: 1,
    Right: 2,
    Up: 3,
    Down: 4,
};

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

    updateSnakePosition(tail) { 
        this.list[tail[1]].children[tail[0]].classList.remove('snake');

        var head = this.getHead();

        this.list[head[1]].children[head[0]].classList.add('snake'); 
    }

    onSnake(position, ignore) {
        return this.snake.some((bodyPart, index) => {
            if (ignore && index === 0) return false;
            return bodyPart.x === position[0] && bodyPart.y === position[1];
        });
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
            position.x = Math.floor(Math.random() * this.board.getCols());
            position.y = Math.floor(Math.random() * this.board.getRows());
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
        let inputDirection = Direction.None;

        switch (e.key) {
            case 'ArrowUp' :
                if (oldDirection === Direction.Up || oldDirection === Direction.Down) break
                inputDirection = Direction.Up;
                break

            case 'ArrowDown' :
                if (oldDirection === Direction.Up || oldDirection === Direction.Down) break
                inputDirection = Direction.Down;
                break

            case 'ArrowLeft' :
                if (oldDirection === Direction.Right || oldDirection === Direction.Left) break
                inputDirection = Direction.Left;
                break

            case 'ArrowRight' :
                if ((oldDirection === Direction.Right || oldDirection === Direction.Left) || (oldDirection === Direction.None)) break
                inputDirection = Direction.Right;
                break
        }

        if (inputDirection === Direction.None) {
            return oldDirection;
        }

        return inputDirection;
    }

    move(direction) {
        if (this.positions.onFood()) {
            this.food.eatFood();
            this.snake.expandSnake(3);
            var foodNewPos = this.positions.setFood();
            this.food.drawFood(foodNewPos);
        }

        for (let i = this.snake.getSnake().length - 2; i >= 0; i--) {
            this.snake.getSnake()[i + 1] = { ...this.snake.getSnake()[i] };
        }

        var snakeBody = this.snake.getSnake();

        if (snakeBody[0].x === 0 && direction === Direction.Left) {
            snakeBody[0].x = this.board.getCols() - 1;
        } else if (snakeBody[0].x === this.board.getCols() - 1 && direction === Direction.Right) {
            snakeBody[0].x = 0;
        } else if (snakeBody[0].y === 0 && direction === Direction.Up) {
            snakeBody[0].y = this.board.getRows() - 1;
        } else if (snakeBody[0].y === this.board.getRows() - 1 && direction === Direction.Down) {
            snakeBody[0].y = 0;
        } else {
            if (direction === Direction.Up) {
                snakeBody[0].y += -1;   
            } else if (direction === Direction.Down) {
                snakeBody[0].y += 1;
            } else if (direction === Direction.Left) {
                snakeBody[0].x += -1;
            } else if (direction === Direction.Right) {
                snakeBody[0].x += 1;
            }
        }
    }
}

async function main() {
    var board = document.querySelector('.gameboard');
    const gameBoard = new GameBoard(22, 20, board);
    gameBoard.drawBoard();

    var list = document.querySelectorAll('.row-element');

    snakeBody = [
        {x: 10, y: 10},
        {x: 11, y: 10},
        {x: 12, y: 10},
        {x: 13, y: 10},
        {x: 14, y: 10}
    ];
    var snakeSpeed = 200;
    const snake = new Snake(snakeBody, snakeSpeed, list);

    var foodPos = {x: 0, y: 0};
    const food = new Food(list, foodPos);

    const sfPositions = new SnakeAndFoodPositions(snake, food, gameBoard);

    const game = new GameProcess(snake, food, sfPositions, gameBoard);

    snake.drawSnake();
    food.drawFood(foodPos);

    let direction = Direction.None;
    window.addEventListener('keydown', e => {
        direction = game.setDirection(e, direction);
    })

    setInterval(function gameProcess() { 
        var tail = snake.getTail(); 
        if (direction != Direction.None) {
            game.move(direction);
            snake.updateSnakePosition(tail);
            if (snake.snakeEatSnake()) {
                main();
            }
        }
    }, snake.getSpeed());
}

window.addEventListener('load', main);