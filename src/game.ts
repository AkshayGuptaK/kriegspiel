import autoBind from 'auto-bind';
import { Board } from './board';
import { Color } from './piece';
import { promptMove } from './prompt';

export class Game {
  private turn = 1;
  private currentPlayer: Color = 'white';
  private board: Board;
  private checkmate = false;

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
    const piece = this.board.findPieceAt(this.currentPlayer, from);
    if (!piece)
      return console.log('You do not control any piece at that position');
    if (!piece.canMoveTo(to))
      return console.log(`Your ${piece.name} cannot move there`);
    const path = from.pathTo(to);
    if (this.board.isPieceInPath(path))
      return console.log('That path is obstructed');
    piece.moveTo(to);
    // check if capture is effected
    this.currentPlayer == 'white'
      ? (this.currentPlayer = 'black')
      : ((this.currentPlayer = 'white'), this.turn++);
  }
}
