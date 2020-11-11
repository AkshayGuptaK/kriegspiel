import autoBind from 'auto-bind';
import { Position, PosFile, PosRank } from './position';

export type Color = 'black' | 'white';

export function getOtherColor(color: Color): Color {
  return color == 'white' ? 'black' : 'white';
}

export abstract class Piece {
  protected position: Position;
  constructor(protected readonly color: Color, file: PosFile, rank: PosRank) {
    this.position = new Position(file, rank);
    autoBind(this);
  }

  getPosition(): Position {
    return this.position;
  }

  moveTo(position: Position): void {
    this.position = position;
  }

  isAt(position: Position): boolean {
    return this.position.isSamePosition(position);
  }

  abstract canMoveTo(position: Position): boolean;
  abstract readonly name: string;
}

export class King extends Piece {
  name = 'king';
  private hasMoved = false;

  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank <= 1 && distance.file <= 1;
  }

  canCastleTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank == 0 && distance.file == 2 && !this.hasMoved;
  }

  moveTo(position: Position): void {
    super.moveTo(position);
    if (!this.hasMoved) this.hasMoved = true;
  }
}

export class Queen extends Piece {
  name = 'queen';
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return (
      distance.rank == 0 || distance.file == 0 || distance.rank == distance.file
    );
  }
}

export function isRook(piece: Piece): piece is Rook {
  return piece.name == 'rook';
}

export class Rook extends Piece {
  name = 'rook';
  hasMoved = false;

  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank == 0 || distance.file == 0;
  }

  canCastleTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    const extraMoveDistance = this.position.isQueenSide() ? 1 : 0;
    return (
      distance.rank == 0 &&
      distance.file == 2 + extraMoveDistance &&
      !this.hasMoved
    );
  }

  moveTo(position: Position): void {
    super.moveTo(position);
    if (!this.hasMoved) this.hasMoved = true;
  }
}

export class Bishop extends Piece {
  name = 'bishop';
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank == distance.file;
  }
}

export class Knight extends Piece {
  name = 'knight';
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return (
      (distance.rank == 1 || distance.rank == 2) &&
      distance.file == 3 - distance.rank
    );
  }
}

export class Pawn extends Piece {
  name = 'pawn';
  hasMoved = false;

  canMoveTo(position: Position): boolean {
    const vector = this.position.vectorTo(position);
    const extraMoveDistance = this.hasMoved ? 0 : 1;
    const isMovingInRightDirection =
      this.color == 'white' ? vector.rank > 0 : vector.rank < 0;
    return (
      isMovingInRightDirection &&
      Math.abs(vector.rank) <= 1 + extraMoveDistance &&
      vector.file == 0
    );
  }

  canCapture(position: Position): boolean {
    const vector = this.position.vectorTo(position);
    const distance = this.position.distanceFrom(position);
    const isMovingInRightDirection =
      this.color == 'white' ? vector.rank > 0 : vector.rank < 0;
    return isMovingInRightDirection && distance.rank == 1 && distance.file == 1;
  }

  moveTo(position: Position): void {
    super.moveTo(position);
    if (!this.hasMoved) this.hasMoved = true;
  }
}
