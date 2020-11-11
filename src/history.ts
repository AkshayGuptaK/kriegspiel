import autoBind from 'auto-bind';
import { Color, Pawn, Piece } from './piece';
import { Position } from './position';

export type MoveData = [
  player: Color,
  piece: Piece,
  from: Position,
  to: Position
];

export class Move {
  constructor(
    private turn: number,
    private player: Color,
    private piece: Piece,
    private from: Position,
    private to: Position
  ) {
    autoBind(this);
  }

  getMovingPiece(): Piece {
    return this.piece;
  }

  isDoublePawnMove(): boolean {
    return (
      this.piece instanceof Pawn && this.to.distanceFrom(this.from).rank == 2
    );
  }

  isInMovePath(position: Position): boolean {
    return this.from
      .pathTo(this.to)
      .some((pathPosition) => pathPosition.isSamePosition(position));
  }
}

export class History {
  private history: Move[] = [];

  addMove(move: Move): void {
    this.history.push(move);
  }

  getPreviousMove(): Move {
    return this.history[this.history.length - 1];
  }
}
