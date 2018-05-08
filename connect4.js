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
        if (new BoardInspector(this.board).checkWon(columnIndx, rowIndx, this.turn)) {
            this.over = true;
            return;
        }
        this.turn = this.turn * -1;
    };
    return GameState;
}());
exports.GameState = GameState;
var BoardInspector = /** @class */ (function () {
    function BoardInspector(_board) {
        this.board = _board;
    }
    BoardInspector.prototype.checkWon = function (x, y, p) {
        return this.checkVerticalFour(x, y, p) || this.checkHorizontalFour(x, y, p) || this.checkDiagonalFour(x, y, p);
    };
    BoardInspector.prototype.checkVerticalFour = function (x, y, p) {
        return y > 2 && this.board[x][y - 1] == p
            && this.board[x][y - 2] == p
            && this.board[x][y - 3] == p;
    };
    BoardInspector.prototype.checkHorizontalFour = function (x, y, p) {
        var left = this.onBoundary(x, true) ? 0 : this.checkHorizontalRecurse(-1, x, y, p);
        var right = this.onBoundary(x, false) ? 0 : this.checkHorizontalRecurse(1, x, y, p);
        return left + right + 1 > 3;
    };
    //returns how many consecutive player p pieces to the dx of x
    BoardInspector.prototype.checkHorizontalRecurse = function (dx, x, y, p) {
        if (this.onBoundary(x, dx == -1)) {
            return 0;
        }
        return this.board[x + dx][y] != p ? 0 : this.checkHorizontalRecurse(dx, x + dx, y, p) + 1;
    };
    BoardInspector.prototype.onBoundary = function (n, left) {
        return left ? (n < 1) : (n > 5);
    };
    BoardInspector.prototype.checkDiagonalFour = function (x, y, p) {
        var downLeft = (this.onBoundary(x, true) || this.onBoundary(y, true)) ? 0 : this.checkDiagonalRecurse(-1, -1, x, y, p);
        var upLeft = (this.onBoundary(x, true) || this.onBoundary(y, false)) ? 0 : this.checkDiagonalRecurse(-1, 1, x, y, p);
        var downRight = (this.onBoundary(x, false) || this.onBoundary(y, true)) ? 0 : this.checkDiagonalRecurse(1, -1, x, y, p);
        var upRight = (this.onBoundary(x, false) || this.onBoundary(y, false)) ? 0 : this.checkDiagonalRecurse(1, 1, x, y, p);
        return (downLeft + upRight + 1 > 3 || upLeft + downRight + 1 > 3);
    };
    //returns how many  consecutive player p pieces to the (dx,dy) of (x,y)
    BoardInspector.prototype.checkDiagonalRecurse = function (dy, dx, x, y, p) {
        if (this.onBoundary(x, dx == -1) || this.onBoundary(y, dy == -1)) {
            return 0;
        }
        return this.board[x + dx][y + dy] != p ? 0 : this.checkDiagonalRecurse(dy, dx, x + dx, y + dy, p) + 1;
    };
    return BoardInspector;
}());
exports.BoardInspector = BoardInspector;
var Player;
(function (Player) {
    Player[Player["PLAYER1"] = -1] = "PLAYER1";
    Player[Player["NONE"] = 0] = "NONE";
    Player[Player["PLAYER2"] = 1] = "PLAYER2";
})(Player = exports.Player || (exports.Player = {}));
