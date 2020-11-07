import { files, PosRank, PosFile } from './position';
import { Color, Rook, Knight, King, Queen, Pawn, Bishop } from './piece';

export class Game {
  private pieces = Game.makePieces();

  private static makePawns(color: Color, pawnRank: PosRank) {
    return files.map((file: PosFile) => new Pawn(color, file, pawnRank));
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
