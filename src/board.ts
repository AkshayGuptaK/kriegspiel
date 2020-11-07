import { files, PosRank, PosFile } from './position';
import { Color, Piece, Rook, Knight, King, Queen, Pawn, Bishop } from './piece';

export class Board {
  private pieces: { white: Piece[]; black: Piece[] };
  constructor() {
    this.pieces = this.makePieces();
  }

  private makePawns(color: Color, pawnRank: PosRank) {
    return files.map((file: PosFile) => new Pawn(color, file, pawnRank));
  }

  private makeArmy(color: Color, pieceRank: PosRank, pawnRank: PosRank) {
    return [
      new Rook(color, 'a', pieceRank),
      new Knight(color, 'b', pieceRank),
      new Bishop(color, 'c', pieceRank),
      new Queen(color, 'd', pieceRank),
      new King(color, 'e', pieceRank),
      new Bishop(color, 'f', pieceRank),
      new Knight(color, 'g', pieceRank),
      new Rook(color, 'h', pieceRank),
      ...this.makePawns(color, pawnRank),
    ];
  }

  private makePieces() {
    return {
      white: this.makeArmy('white', 1, 2),
      black: this.makeArmy('black', 8, 7),
    };
  }
}
