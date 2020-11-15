import autoBind from 'auto-bind';
import { AsciiBoard } from './ascii';
import { Board } from './board';
import { compose } from './fp-utils';
import { Move } from './move';
import { Color } from './piece';
import { promptMove } from './prompt';

export class Game {
  private turn = 1;
  private currentPlayer: Color = 'white';
  private board: Board;
  private checkmate = false;
  private previousMove = null;

  constructor() {
    this.board = new Board();
    autoBind(this);
  }

  async play(): Promise<void> {
    while (!this.checkmate) {
      await this.playTurn();
    }
  }

  advanceTurn(move: Move): void {
    console.log(new AsciiBoard(this.board.getBoard()).print());
    this.previousMove = move;
    this.currentPlayer == 'white'
      ? (this.currentPlayer = 'black')
      : ((this.currentPlayer = 'white'), this.turn++);
  }

  async playTurn(): Promise<void> {
    const response = await promptMove(this.currentPlayer);
    const { from, to, confirm } = response.confirm;
    if (!confirm) return;
    this.board
      .tryMove(this.currentPlayer, from, to, this.previousMove)
      .fold(console.log, compose(this.advanceTurn, this.board.doMove));
  }
}
