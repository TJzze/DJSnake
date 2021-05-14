const BOARD_ROWS  = 22;
const BOARD_COLS  = 20;
const SNAKE_INIT  = 1;
const SNAKE_SPEED = 200; 
const EXPAN_RATE  = 1;
var snakeBody = [
    {x: 10, y: 10},
    {x: 11, y: 10},
    {x: 12, y: 10},
    {x: 13, y: 10},
    {x: 14, y: 10}
];
var food = setFood();


function expandSnake() {
    for (let i = 0; i < EXPAN_RATE; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1]});
    }
}

function onFood() {
    return snakeBody[0].x === food.x && snakeBody[0].y === food.y
}

function onSnake(position, ignore) {
    return snakeBody.some((bodyPart, index) => {
        if (ignore && index === 0) return false
        return bodyPart.x === position.x && bodyPart.y === position.y
    })
}

function setFood() {
    var position = {x: -1, y: -1};
    while (position.x === -1 || onSnake(position, false)) {
        position.x = Math.floor(Math.random() * BOARD_COLS);
        position.y = Math.floor(Math.random() * BOARD_ROWS);
    }

    return position;
}

function snakeEatSnake() {
    var x = snakeBody[0].x;
    var y = snakeBody[0].y;

    var head = {x, y}
    var ignore = true;
    return onSnake(head, ignore);
}

function eatFood(list) {
    var x = food.x;
    var y = food.y;

    list[y].children[x].classList.remove('food');
}
 
function snakeMove(direction) {
    if (onFood()) {
        eatFood(document.querySelectorAll('.row-element'));
        expandSnake();
        food = setFood();
        // console.log(snakeBody);
        // console.log(food);
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

function updateBoard(list, tail) {
    list[tail[1]].children[tail[0]].classList.remove('snake');

    var headx = snakeBody[0].x;
    var heady = snakeBody[0].y;

    list[heady].children[headx].classList.add('snake'); 
}

function drawBoard() {
    document.querySelector('.gameboard').innerHTML = "";

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
    var x = food.x;
    var y = food.y;

    list[y].children[x].classList.add('food');
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

async function main() {
    drawBoard();
    snakeBody = [
        {x: 10, y: 10},
        {x: 11, y: 10},
        {x: 12, y: 10},
        {x: 13, y: 10},
        {x: 14, y: 10}
    ];

    var gridList = document.querySelectorAll('.row-element');
    drawSnake(gridList);
    drawFood(gridList);

    let direction = {x: 0, y: 0};
    window.addEventListener('keydown', e => {
        direction = setDirection(e, direction);
    })

    setInterval(function gameProcess() { 
        var tail = [snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y];  
        if (direction.x !== 0 || direction.y !== 0) {
            snakeMove(direction);
            updateBoard(gridList, tail);
            if (snakeEatSnake) {
                console.log("snakeeee");
            }
        }
    }, SNAKE_SPEED);
}

window.addEventListener('load', main);