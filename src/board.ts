import autoBind from 'auto-bind';
import { files, PosRank, PosFile, Position } from './position';
import {
  Color,
  getOtherColor,
  Piece,
  Rook,
  Knight,
  King,
  Queen,
  Pawn,
  Bishop,
} from './piece';
import { identity, removeItemFromArray } from './utils';

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

  capture(color: Color, piece: Piece): void {
    this.pieces[color] = removeItemFromArray(this.pieces[color], piece);
  }

  tryMove(player: Color, from: Position, to: Position): boolean {
    const piece = this.findPieceAt(player, from);
    if (!piece) {
      console.log('You do not control any piece at that position');
      return false;
    }
    if (!piece.canMoveTo(to)) {
      console.log(`Your ${piece.name} cannot move there`);
      return false;
    }
    const path = from.pathTo(to);
    if (this.isPieceInPath(path)) {
      console.log('That move is obstructed');
      return false;
    }
    if (this.findPieceAt(player, to)) {
      console.log('That destination is obstructed');
      return false;
    }
    const opponent = getOtherColor(player);
    const capturedPiece = this.findPieceAt(opponent, to);
    if (capturedPiece) {
      console.log(`Capture at ${to}`);
      this.capture(opponent, capturedPiece);
    }
    piece.moveTo(to);
    return true;
  }
}
