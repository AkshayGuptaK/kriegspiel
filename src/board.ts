import autoBind from 'auto-bind';
import { files, PosRank, PosFile, Position } from './position';
import { Color, Piece, Rook, Knight, King, Queen, Pawn, Bishop } from './piece';
import { identity } from './utils';

export class Board {
  private pieces: { white: Piece[]; black: Piece[] };
  constructor() {
    this.pieces = this.makePieces();
    autoBind(this);
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

  findPieceAt(color: Color, position: Position): Piece {
    return this.pieces[color].filter((piece) => piece.isAt(position))[0];
  }

  isPieceAt(position: Position): boolean {
    return !!(
      this.findPieceAt('white', position) || this.findPieceAt('black', position)
    );
  }

  isPieceInPath(path: Position[]): boolean {
    return path.map(this.isPieceAt).some(identity);
  }
}
