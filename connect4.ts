export class GameState {
    turn: Player;
    board: Player[][];
    over: boolean;

    constructor() {
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

    public dropPiece(columnIndx: number) {
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
            rowIndx = 0
            this.board[columnIndx][rowIndx] = this.turn;
        }

        if (new BoardInspector(this.board).checkWon(columnIndx, rowIndx, this.turn)) {
            this.over = true;
            return
        }

        this.turn = this.turn * -1;
    }

    public boardAs1d(): Int32Array{
        console.log("creating array");
        var vec = [];
        for(var i = 0; i < 7; i++){
            for(var j = 0; j < 7; j++){

                var place = this.board[i][j];
                if(place === Player.PLAYER1){
                    vec.push(1);
                }else if(place === Player.PLAYER2){
                    vec.push(-1);
                }else{
                    vec.push(0);
                }
            }
        }
        console.log("array created");
        return new Int32Array(vec);
    }
}

export class BoardInspector {

    board: Player[][];

    constructor(_board: Player[][]) {
        this.board = _board;
    }

    public checkWon(x: number, y: number, p: Player): boolean {
        return this.checkVerticalFour(x, y, p) || this.checkHorizontalFour(x, y, p) || this.checkDiagonalFour(x, y, p);
    }

    private checkVerticalFour(x: number, y: number, p: Player): boolean {
        return y > 2 && this.board[x][y - 1] == p
            && this.board[x][y - 2] == p
            && this.board[x][y - 3] == p;
    }

    private checkHorizontalFour(x: number, y: number, p: Player): boolean {
        var left = this.onBoundary(x, true) ? 0 : this.checkHorizontalRecurse(-1, x, y, p);
        var right = this.onBoundary(x, false) ? 0 : this.checkHorizontalRecurse(1, x, y, p);

        return left + right + 1 > 3;
    }

    //returns how many consecutive player p pieces to the dx of x
    private checkHorizontalRecurse(dx: number, x: number, y: number, p: Player): number {
        if (this.onBoundary(x, dx == -1)) {
            return 0;
        }
        return this.board[x + dx][y] != p ? 0 : this.checkHorizontalRecurse(dx, x + dx, y, p) + 1;
    }

    private onBoundary(n: number, left: boolean): boolean {
        return left ? (n < 1) : (n > 5)
    }

    private checkDiagonalFour(x: number, y: number, p: Player): boolean {
        var downLeft = (this.onBoundary(x, true) || this.onBoundary(y, true)) ? 0 : this.checkDiagonalRecurse(-1, -1, x, y, p);
        var upLeft = (this.onBoundary(x, true) || this.onBoundary(y, false)) ? 0 : this.checkDiagonalRecurse(-1, 1, x, y, p);
        var downRight = (this.onBoundary(x, false) || this.onBoundary(y, true)) ? 0 : this.checkDiagonalRecurse(1, -1, x, y, p);
        var upRight = (this.onBoundary(x, false) || this.onBoundary(y, false)) ? 0 : this.checkDiagonalRecurse(1, 1, x, y, p);

        return (downLeft + upRight + 1 > 3 || upLeft + downRight + 1 > 3)
    }

    //returns how many  consecutive player p pieces to the (dx,dy) of (x,y)
    private checkDiagonalRecurse(dy: number, dx: number, x: number, y: number, p: Player): number {
        if (this.onBoundary(x, dx == -1) || this.onBoundary(y, dy == -1)) {
            return 0;
        }
        return this.board[x + dx][y + dy] != p ? 0 : this.checkDiagonalRecurse(dy, dx, x + dx, y + dy, p) + 1;
    }
}

export enum Player {
    PLAYER1 = 1,
    NONE = 0,
    PLAYER2 = -1,
}