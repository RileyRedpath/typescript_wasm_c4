import { GameState } from "./connect4"

export interface AI {
    findBestMove(state: GameState): number;
}