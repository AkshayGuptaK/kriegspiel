import autoBind from 'auto-bind';
import { AsciiBoard } from './io/ascii';
import { Board } from './board';
import { compose } from './utils/fp-utils';
import { Move } from './movement/move';
import { Color, getOtherColor } from './piece';
import { promptMove } from './io/prompt';

export class Game {
  private turn = 1;
  private currentPlayer: Color = 'white';
  private board: Board;
  private checkmate = false;
  private previousMove = null;

  constructor() {
    this.board = new Board();
    this.board.makeArmies();
    autoBind(this);
  }

  async play(): Promise<void> {
    while (!this.checkmate) {
      await this.playTurn();
    }
  }

  advanceTurn(move: Move): void {
    if (move) {
      console.log(new AsciiBoard(this.board.getBoard()).print());
      this.previousMove = move;
      this.currentPlayer == 'white'
        ? (this.currentPlayer = 'black')
        : ((this.currentPlayer = 'white'), this.turn++);
    }
  }

  async playTurn(): Promise<void> {
    const response = await promptMove(this.currentPlayer);
    const { from, to, confirm } = response.confirm;
    if (!confirm) return;
    this.board
      .tryMove(this.currentPlayer, from, to, this.previousMove)
      .fold(console.log, compose(this.advanceTurn, this.board.check));
  }
}
