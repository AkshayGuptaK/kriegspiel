import autoBind from 'auto-bind';
import { Vector } from './movement/vector';

export type Color = 'black' | 'white';
export type pieceSymbol = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

export function getOtherColor(color: Color): Color {
  return color == 'white' ? 'black' : 'white';
}

export abstract class Piece {
  protected hasMoved = false;
  constructor(protected readonly color: Color) {
    autoBind(this);
  }

  getColor(): Color {
    return this.color;
  }

  isColor(color: Color): boolean {
    return this.color == color;
  }

  setMoved(): void {
    this.hasMoved = true;
  }

  canCapture(vector: Vector): boolean {
    return this.canMove(vector);
  }

  abstract canMove(vector: Vector): boolean;
  abstract readonly symbol: pieceSymbol;
}

export class King extends Piece {
  symbol: pieceSymbol = 'k';

  canMove(vector: Vector): boolean {
    return vector.hasMagnitudesOfAtMost(1, 1);
  }

  canCastle(vector: Vector): boolean {
    return !this.hasMoved && vector.hasMagnitudes(0, 2);
  }
}

export class Queen extends Piece {
  symbol: pieceSymbol = 'q';
  canMove(vector: Vector): boolean {
    return vector.isStraight() || vector.isDiagonal();
  }
}

export class Rook extends Piece {
  symbol: pieceSymbol = 'r';

  canMove(vector: Vector): boolean {
    return vector.isStraight();
  }

  canCastle(): boolean {
    return !this.hasMoved;
  }
}

export class Bishop extends Piece {
  symbol: pieceSymbol = 'b';
  canMove(vector: Vector): boolean {
    return vector.isDiagonal();
  }
}

export class Knight extends Piece {
  symbol: pieceSymbol = 'n';
  canMove(vector: Vector): boolean {
    return vector.isL();
  }
}

export class Pawn extends Piece {
  symbol: pieceSymbol = 'p';
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
