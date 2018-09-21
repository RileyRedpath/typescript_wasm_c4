import { GameState } from "./connect4";
console.log("can you hear me?");
const minimax = import("./rustyAI");
var gameState = new GameState();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function setFillStyleForPlayer(p, ctx) {
    var g = Math.abs(p) * 255;
    var b = (p == 1 ? 1 : 0) * 255;
    ctx.fillStyle = 'rgb(0,' + g + ' ,' + b + ')';
}
const draw = () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var rectX = Math.round(canvas.width / 7);
    var rectY = Math.round(canvas.height / 7);
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            setFillStyleForPlayer(gameState.board[i][j], ctx);
            ctx.fillRect(i * rectX - 1, (6 - j) * rectY - 1, rectX - 2, rectY - 2);
        }
    }
};
console.log("fuck you!");
window.addEventListener('click', c => {
    var column = Math.floor(c.clientX / Math.round(canvas.width / 7));
    console.log("piece dropped: " + column);
    gameState.dropPiece(column);
    draw();
    if (gameState.over) {
        console.log('game over');
        setFillStyleForPlayer(gameState.turn, ctx);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        gameState = new GameState();
    }
});
window.addEventListener("keypress", evt => {
    if (evt.key === "a") {
        console.log("calculating best move");
        import("./rustyAI").then(m => {
            console.log("inside then ");
            var board1D = gameState.boardAs1d();
            console.log("1d board created");
            console.log("best move: " + m.minimax_setup(board1D, gameState.turn));
        });
    }
    else if (evt.key === "q") {
        import("./rustyAI").then(m => {
            m.log_test();
        });
    }
    else if (evt.key === "s") {
        import("./rustyAI").then(m => {
            console.log("3 + 1 = " + m.add(3, 1));
        });
    }
});
draw();
