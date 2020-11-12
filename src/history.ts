import autoBind from 'auto-bind';
import { Color, Pawn, Piece } from './piece';
import { Position } from './position';

export type MoveData = [
  player: Color,
  piece: Piece,
  from: Position,
  to: Position
];

abstract class MoveMonad {
  constructor(
    private actions: unknown[] | null = [],
    private message: string = ''
  ) {}

  protected compose(move: MoveMonad): Legal {
    return new Legal(
      [...this.actions, ...move.actions],
      this.message + ' ' + move.message
    );
  }

  abstract chain(move: MoveMonad): MoveMonad;
}

export class Illegal extends MoveMonad {
  constructor(message: string) {
    super(null, message);
  }

  chain(move: MoveMonad): Illegal {
    return this;
  }
}

export class Legal extends MoveMonad {
  constructor(action: unknown[] | null, message: string) {
    super(action, message);
  }

  chain(move: MoveMonad): MoveMonad {
    if (move instanceof Illegal) {
      return move;
    }
    return this.compose(move);
  }
}

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
    const vector = this.from.vectorTo(this.to);
    return this.piece instanceof Pawn && vector.hasMagnitudes(2, 0);
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
