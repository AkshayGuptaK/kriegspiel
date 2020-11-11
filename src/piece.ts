import autoBind from 'auto-bind';
import { Position, PosFile, PosRank } from './position';

export type Color = 'black' | 'white';

export abstract class Piece {
  protected position: Position;
  constructor(private readonly color: Color, file: PosFile, rank: PosRank) {
    this.position = new Position(file, rank);
    autoBind(this);
  }
  moveTo(position: Position): void {
    this.position = position;
  }
  isAt(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank + distance.file == 0;
  }
  abstract canMoveTo(position: Position): boolean;
  abstract readonly name: string;
}

export class King extends Piece {
  name = 'king';
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2;
  }
}

export class Queen extends Piece {
  name = 'queen';
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2; // needs implementing
  }
}

export class Rook extends Piece {
  name = 'rook';
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank == 0 || distance.file == 0;
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
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2; // needs implementing
  }
}
