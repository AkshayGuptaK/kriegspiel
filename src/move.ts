import autoBind from 'auto-bind';
import { Functor } from './fp-utils';
import { Color, Pawn, Piece } from './piece';
import { Position } from './position';
import { Vector } from './vector';

export class Move implements Functor<Move> {
  constructor(
    public player: Color,
    public piece: Piece,
    public from: Position | null,
    public to: Position | null,
    public previousMove: Move | null = null,
    private associatedMoves: Move[] = []
  ) {
    autoBind(this);
  }

  map(fn: (...moves: Move[]) => unknown): unknown {
    return fn(this, ...this.associatedMoves);
  }

  associateMove(move: Move): Move {
    this.associatedMoves.push(move);
    return this;
  }

  isDoublePawnMove(): boolean {
    const vector = this.from.vectorTo(this.to);
    return this.piece instanceof Pawn && vector.hasMagnitudes(2, 0);
  }

  isInMovePath(position: Position): boolean {
    return this.from
      .pathTo(this.to)
      .some((pathPosition) => pathPosition.isSamePosition(position));
  }

  getMoveVector(): Vector {
    return this.from.vectorTo(this.to);
  }

  getMovePath(): Position[] {
    return this.from.pathTo(this.to);
  }
}
