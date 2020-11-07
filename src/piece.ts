import { Position, PosFile, PosRank } from './position';

export type Color = 'black' | 'white';

export abstract class Piece {
  protected position: Position;
  constructor(private readonly color: Color, file: PosFile, rank: PosRank) {
    this.position = new Position(file, rank);
    this.color = color;
  }
  moveTo(position: Position): void {
    this.position = position;
  }
  abstract canMoveTo(position: Position): boolean;
}

export class King extends Piece {
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2;
  }
}

export class Queen extends Piece {
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2;
  }
}

export class Rook extends Piece {
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank == 0 || distance.file == 0;
  }
}

export class Bishop extends Piece {
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank == distance.file;
  }
}

export class Knight extends Piece {
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return (
      (distance.rank == 1 || distance.rank == 2) &&
      distance.file == 3 - distance.rank
    );
  }
}

export class Pawn extends Piece {
  canMoveTo(position: Position): boolean {
    const distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2; // needs implementing
  }
}
