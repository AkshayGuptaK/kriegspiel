class Game {
  private pieces = Game.makePieces();

  private static makePawns(color: Color, pawnRank: PosRank) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(
      (file: PosFile) => new Pawn(color, file, pawnRank)
    );
  }

  private static makeArmy(color: Color, pieceRank: PosRank, pawnRank: PosRank) {
    return [
      new Rook(color, 'A', pieceRank),
      new Knight(color, 'B', pieceRank),
      new Bishop(color, 'C', pieceRank),
      new Queen(color, 'D', pieceRank),
      new King(color, 'E', pieceRank),
      new Bishop(color, 'F', pieceRank),
      new Knight(color, 'G', pieceRank),
      new Rook(color, 'H', pieceRank),
      ...this.makePawns(color, pawnRank),
    ];
  }

  private static makePieces() {
    return [...this.makeArmy('White', 1, 2), ...this.makeArmy('Black', 8, 7)];
  }
}

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

class Queen extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2;
  }
}

class Rook extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position);
    return distance.rank == 0 || distance.file == 0;
  }
}

class Bishop extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position);
    return distance.rank == distance.file;
  }
}

class Knight extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position);
    return (
      (distance.rank == 1 || distance.rank == 2) &&
      distance.file == 3 - distance.rank
    );
  }
}

class Pawn extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position);
    return distance.rank < 2 && distance.file < 2; // needs implementing
  }
}

type Color = 'Black' | 'White';
type PosFile = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
type PosRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
