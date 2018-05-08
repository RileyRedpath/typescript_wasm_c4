import {GameState} from "./connect4";
import {Player} from "./connect4";
import {AI} from "./ai";

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

    for(var i = 0; i < 7; i++){
        for(var j = 0; j < 7; j++){
            setFillStyleForPlayer(gameState.board[i][j], ctx);
            ctx.fillRect(i*rectX - 1, (6-j)*rectY - 1, rectX - 2, rectY - 2)
        }
    }
}

window.addEventListener('click', c => {
    var column = Math.floor(c.clientX / Math.round(canvas.width / 7));
    gameState.dropPiece(column);
    draw();
    if(gameState.over){
        console.log('game over');
        setFillStyleForPlayer(gameState.turn, ctx);
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        gameState = new GameState();
    }   
})

draw();

