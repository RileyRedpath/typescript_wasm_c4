import {GameState} from "./connect4"
import {Player} from "./connect4"

var gameState = new GameState();

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function setFillStyleForPlayer(p:Player, ctx: CanvasRenderingContext2D){
    var g = Math.abs (p) * 255;
    var b = (p == 1 ? 1 : 0) * 255;
    ctx.fillStyle = 'rgb(0,' +  g + ' ,' + b + ')';
}

const draw = () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    var rectX = Math.round(canvas.width / 7);
    var rectY = Math.round(canvas.height / 7);

    ctx.fillStyle = '#232323'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for(var i = 0; i < 7; i++){
        for(var j = 0; j < 7; j++){
            setFillStyleForPlayer(gameState.board[i][j], ctx);
            ctx.fillRect(i*rectX, (6-j)*rectY, rectX, rectY)
        }
    }
}

window.addEventListener('keydown', k => {
    gameState.dropPiece(Number(k.key));
    draw();
    if(gameState.over){
        console.log('game over');
        setFillStyleForPlayer(gameState.turn, ctx);
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        gameState = new GameState();
    }
})

draw();

