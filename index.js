/**
 * MinesweeperOnline
 * Michiel Derveeuw
 */

const express = require('express');
const http = require('http');
const socketio = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketio(server);

const Field = require('./game/Field');

let field = new Field(10, 10, 10);
let gameDone = false;

function newGame() {
    setTimeout(function () {
        field = new Field(10, 10, 10);
        gameDone = false;
    }, 1000);
}

app.use(express.static('public'));

io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function(){
        console.log('User disconnected');
    });
    socket.on('show', function (data) {
        field.show(data.coord.x, data.coord.y);
    });
    socket.on('mark', function (data) {
        field.mark(data.coord.x, data.coord.y);
    });
    socket.on('clear', function (data) {
        field.clear(data.coord.x, data.coord.y);
    });
});

setInterval(function() {
    io.sockets.emit('interval', field.public);
    if ((field.checkLose() || field.checkWin()) && !gameDone) {
        newGame();
        gameDone = true;
    }
}, 33);

server.listen(3000, function () {
    console.log('Server listening on port 3000');
});
