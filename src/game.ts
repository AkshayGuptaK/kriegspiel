class Game {}

class Position {
  constructor(private file: PosFile, private rank: PosRank) {}
  distanceFrom(position: Position) {
    return {
      rank: Math.abs(position.rank - this.rank),
      file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0)),
    };
  }
}

abstract class Piece {
  protected position: Position;
  constructor(private readonly color: Color, file: PosFile, rank: PosRank) {
    this.position = new Position(file, rank);
  }
  moveTo(position: Position) {
    this.position = position;
  }
  abstract canMoveTo(position: Position): boolean;
}

class King extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2;
  }
}

class Queen extends Piece {}

class Rook extends Piece {}

class Bishop extends Piece {}

class Knight extends Piece {}

class Pawn extends Piece {}

type Color = "Black" | "White";
type PosFile = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type PosRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
