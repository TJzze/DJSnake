const BOARD_ROWS  = 22;
const BOARD_COLS  = 20;
const SNAKE_INIT  = 1;
const SNAKE_SPEED = 500; 
const EXPAN_RATE  = 1;
const snakeBody = [
    {x: 10, y: 10},
    {x: 11, y: 10},
    {x: 12, y: 10},
    {x: 13, y: 10},
    {x: 14, y: 10}
];
const food = setFood();


function expandSnake() {
    for (let i = 0; i < EXPAN_RATE; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1]});
    }
}

function onFood() {
    return snakeBody[0].x === food.x && snakeBody[0].y === food.y
}

function onSnake(position) {
    return snakeBody.some(bodyPart => {
        bodyPart.x === position.x && bodyPart.y === position.y
    })
}

// function setFood() {
//     var position = {x: 0, y: 0};
//     while (position == null || onSnake(position)) {
//         position.x = randomx();
//         position.y = randomy();
//     }

//     return position;
// }
 
function snakeMove(direction) {
    if (onFood()) {
        expandSnake();
        setFood();
        drawFood(document.querySelectorAll('.row-element'));
    }

    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }

    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;
}

function updateBoard(list, tail) {
    list[tail[1]].children[tail[0]].classList.remove('snake');

    var headx = snakeBody[0].x;
    var heady = snakeBody[0].y;

    list[heady].children[headx].classList.add('snake'); 
}

function drawBoard() {
    for (let i = 0; i < BOARD_ROWS; i++) {
        const boardRowElement = document.createElement('div');
        boardRowElement.classList.add('row-element');

        for (let j = 0; j < BOARD_COLS; j++) {
            const block = document.createElement('div');
            block.classList.add('block');
            boardRowElement.appendChild(block);
        }  

        document.querySelector('.gameboard')
            .appendChild(boardRowElement);
    }
}

function drawSnake(list) {
    for (let i = 0; i < snakeBody.length; i++) {
        var x = snakeBody[i].x;
        var y = snakeBody[i].y;

        list[y].children[x].classList.add('snake');
    }
}

function drawFood(list) {
    list[food.y].children[food.x].classList.add('food');
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
            if (oldDirection.x !== 0) break
            inputDirection = {x: 1, y: 0}
            break
    }

    if (inputDirection.x === 0 && inputDirection.y === 0) {
        return oldDirection;
    }

    return inputDirection;
}

async function main() {
    drawBoard();

    var gridList = document.querySelectorAll('.row-element');
    drawSnake(gridList);
    drawFood(gridList);

    let direction = {x: 0, y: 0};
    window.addEventListener('keydown', e => {
        direction = setDirection(e, direction);
    })

    setInterval(function gameProcess() { 
        var tail = [snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y];  
        snakeMove(direction);
        if (direction.x !== 0 || direction.y !== 0) {
            updateBoard(gridList, tail);
        }
    }, SNAKE_SPEED);
}

window.addEventListener('load', main);