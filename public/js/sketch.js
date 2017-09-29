/**
 * MinesweeperOnline
 * Michiel Derveeuw
 */
let socket;
let game;
let mouseButtons = [false, false, false];
let leftRightHold;
let rightPressedLeftHold;

function setup() {
    createCanvas(200, 200);

    game = new Game(10, 10, 10);

    socket = io.connect();

    socket.on('interval', function (data) {
        game.field = data;
    });

    textAlign(CENTER, CENTER);
    textSize(14);
    noStroke();
}

function draw() {
    background(255);
    game.draw();
}

document.addEventListener('contextmenu', function (event) {
    if (event.srcElement.id === "defaultCanvas0") {
        event.preventDefault();
    }
});

function bodyMouseDown (event) {
    let x = floor(map(mouseX, 0, width, 0, 10));
    let y = floor(map(mouseY, 0, height, 0, 10));
    if (0 <= x && x < 10 && 0 <= y && y < 10) {
        if (event.button === 2 && !mouseButtons[0]) {
            socket.emit('mark', { coord: { x: x, y: y }});
        }
    }
    if (mouseButtons.length <= event.button) {
        while (mouseButtons.length <= event.button) {
            mouseButtons.push(false);
        }
    }
    mouseButtons[event.button] = true;
    leftRightHold = mouseButtons[0] && mouseButtons[2];
    rightPressedLeftHold = event.button === 2 && mouseButtons[0];
}

function bodyMouseUp (event) {
    let x = floor(map(mouseX, 0, width, 0, 10));
    let y = floor(map(mouseY, 0, height, 0, 10));
    if (0 <= x && x < 10 && 0 <= y && y < 10) {
        if (!leftRightHold) {
            if (event.button === 0 && !rightPressedLeftHold) {
                socket.emit('show', { coord: { x: x, y: y }});
                game.field.visible[x][y] = 1;
            }
        } else {
            if (event.button === 0 || event.button === 2) {
                socket.emit('clear', { coord: { x: x, y: y }});
            }
        }
    }
    if (mouseButtons.length <= event.button) {
        while (mouseButtons.length <= event.button) {
            mouseButtons.push(false);
        }
    }
    mouseButtons[event.button] = false;
    leftRightHold = mouseButtons[0] && mouseButtons[2];
    rightPressedLeftHold = event.button !== 0;
}