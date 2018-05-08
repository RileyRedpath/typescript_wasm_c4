(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var GameState = /** @class */ (function () {
    function GameState() {
        this.over = false;
        this.board = new Array(7);
        for (var i = 0; i < 7; i++) {
            this.board[i] = new Array(7);
            for (var j = 0; j < 7; j++) {
                this.board[i][j] = Player.NONE;
            }
        }
        this.turn = Player.PLAYER1;
    }
    GameState.prototype.dropPiece = function (columnIndx) {
        var rowIndx = -1;
        if (this.board[columnIndx][6] !== Player.NONE) {
            //row full
            return;
        }
        for (var i = 6; i > 0; i--) {
            if (this.board[columnIndx][i - 1] !== Player.NONE) {
                rowIndx = i;
                this.board[columnIndx][i] = this.turn;
                break;
            }
        }
        if (rowIndx === -1) {
            rowIndx = 0;
            this.board[columnIndx][rowIndx] = this.turn;
        }
        if (this.checkWon(columnIndx, rowIndx, this.turn)) {
            this.over = true;
            return;
        }
        this.turn = this.turn * -1;
    };
    GameState.prototype.checkWon = function (x, y, p) {
        return this.checkVerticalFour(x, y, p) || this.checkHorizontalFour(x, y, p) || this.checkDiagonalFour(x, y, p);
    };
    GameState.prototype.checkVerticalFour = function (x, y, p) {
        return y > 2 && this.board[x][y - 1] == p
            && this.board[x][y - 2] == p
            && this.board[x][y - 3] == p;
    };
    GameState.prototype.checkHorizontalFour = function (x, y, p) {
        var left = this.onBoundary(x, true) ? 0 : this.checkHorizontalRecurse(-1, x, y, p);
        var right = this.onBoundary(x, false) ? 0 : this.checkHorizontalRecurse(1, x, y, p);
        return left + right + 1 > 3;
    };
    //returns how many consecutive player p pieces to the dx of x
    GameState.prototype.checkHorizontalRecurse = function (dx, x, y, p) {
        if (this.onBoundary(x, dx == -1)) {
            return 0;
        }
        return this.board[x + dx][y] != p ? 0 : this.checkHorizontalRecurse(dx, x + dx, y, p) + 1;
    };
    GameState.prototype.onBoundary = function (n, left) {
        return left ? (n < 1) : (n > 5);
    };
    GameState.prototype.checkDiagonalFour = function (x, y, p) {
        var downLeft = (this.onBoundary(x, true) || this.onBoundary(y, true)) ? 0 : this.checkDiagonalRecurse(-1, -1, x, y, p);
        var upLeft = (this.onBoundary(x, true) || this.onBoundary(y, false)) ? 0 : this.checkDiagonalRecurse(-1, 1, x, y, p);
        var downRight = (this.onBoundary(x, false) || this.onBoundary(y, true)) ? 0 : this.checkDiagonalRecurse(1, -1, x, y, p);
        var upRight = (this.onBoundary(x, false) || this.onBoundary(y, false)) ? 0 : this.checkDiagonalRecurse(1, 1, x, y, p);
        return (downLeft + upRight + 1 > 3 || upLeft + downRight + 1 > 3);
    };
    //returns how many  consecutive player p pieces to the (dx,dy) of (x,y)
    GameState.prototype.checkDiagonalRecurse = function (dy, dx, x, y, p) {
        if (this.onBoundary(x, dx == -1) || this.onBoundary(y, dy == -1)) {
            return 0;
        }
        return this.board[x + dx][y + dy] != p ? 0 : this.checkDiagonalRecurse(dy, dx, x + dx, y + dy, p) + 1;
    };
    return GameState;
}());
exports.GameState = GameState;
var Player;
(function (Player) {
    Player[Player["PLAYER1"] = -1] = "PLAYER1";
    Player[Player["NONE"] = 0] = "NONE";
    Player[Player["PLAYER2"] = 1] = "PLAYER2";
})(Player = exports.Player || (exports.Player = {}));

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var connect4_1 = require("./connect4");
var gameState = new connect4_1.GameState();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
function setFillStyleForPlayer(p, ctx) {
    var g = Math.abs(p) * 255;
    var b = (p == 1 ? 1 : 0) * 255;
    ctx.fillStyle = 'rgb(0,' + g + ' ,' + b + ')';
}
var draw = function () {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var rectX = Math.round(canvas.width / 7);
    var rectY = Math.round(canvas.height / 7);
    ctx.fillStyle = '#232323';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            setFillStyleForPlayer(gameState.board[i][j], ctx);
            ctx.fillRect(i * rectX, (6 - j) * rectY, rectX, rectY);
        }
    }
};
window.addEventListener('keydown', function (k) {
    gameState.dropPiece(Number(k.key));
    draw();
    if (gameState.over) {
        console.log('game over');
        setFillStyleForPlayer(gameState.turn, ctx);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        gameState = new connect4_1.GameState();
    }
});
draw();

},{"./connect4":1}]},{},[2]);
