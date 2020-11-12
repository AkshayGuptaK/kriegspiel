import autoBind from 'auto-bind';
import { Vector } from './vector';

export type Color = 'black' | 'white';

export function getOtherColor(color: Color): Color {
  return color == 'white' ? 'black' : 'white';
}

export abstract class Piece {
  protected hasMoved = false;
  constructor(protected readonly color: Color) {
    autoBind(this);
  }

  isColor(color: Color): boolean {
    return this.color == color;
  }

  setMoved(): void {
    this.hasMoved = true;
  }

  abstract canMove(vector: Vector): boolean;
  abstract readonly name: string;
}

export class King extends Piece {
  name = 'king';

  canMove(vector: Vector): boolean {
    return vector.hasMagnitudesOfAtMost(1, 1);
  }

  canCastle(vector: Vector): boolean {
    return !this.hasMoved && vector.hasMagnitudes(0, 2);
  }
}

export class Queen extends Piece {
  name = 'queen';
  canMove(vector: Vector): boolean {
    return vector.isStraight() || vector.isDiagonal();
  }
}

export class Rook extends Piece {
  name = 'rook';

  canMove(vector: Vector): boolean {
    return vector.isStraight();
  }

  canCastle(): boolean {
    return !this.hasMoved;
  }
}

export class Bishop extends Piece {
  name = 'bishop';
  canMove(vector: Vector): boolean {
    return vector.isDiagonal();
  }
}

export class Knight extends Piece {
  name = 'knight';
  canMove(vector: Vector): boolean {
    return vector.isL();
  }
}

export class Pawn extends Piece {
  name = 'pawn';
  hasMoved = false;

  canMove(vector: Vector): boolean {
    const extraMoveDistance = this.hasMoved ? 0 : 1;
    const isMovingInRightDirection =
      (this.color == 'white') == vector.isForwards();
    return (
      isMovingInRightDirection &&
      vector.hasMagnitudesOfAtMost(1 + extraMoveDistance, 0)
    );
  }

  canCapture(vector: Vector): boolean {
    const isMovingInRightDirection =
      (this.color == 'white') == vector.isForwards();
    return isMovingInRightDirection && vector.hasMagnitudes(1, 1);
  }
}
