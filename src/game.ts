import autoBind from 'auto-bind';
import { Board } from './board';
import { Color } from './piece';
import { Move, History } from './history';
import { promptMove } from './prompt';

export class Game {
  private turn = 1;
  private currentPlayer: Color = 'white';
  private board: Board;
  private checkmate = false;
  private history: History = new History();

  constructor() {
    this.board = new Board();
    autoBind(this);
  }

  async play(): Promise<void> {
    while (!this.checkmate) {
      await this.playTurn();
    }
  }

  async playTurn(): Promise<void> {
    const response = await promptMove(this.currentPlayer);
    const { from, to, confirm } = response.confirm;
    if (!confirm) return;
    const previousMove = this.history.getPreviousMove();
    const move = this.board.tryMove(this.currentPlayer, from, to, previousMove);
    if (move) {
      this.history.addMove(new Move(this.turn, ...move));
      this.currentPlayer == 'white'
        ? (this.currentPlayer = 'black')
        : ((this.currentPlayer = 'white'), this.turn++);
    }
  }
}
