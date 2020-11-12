import autoBind from 'auto-bind';
import { Color, King, Piece } from './piece';
import { files, PosFile, Position, PosRank, ranks } from './position';
import { identity } from './utils';

interface Chessboard {
  removePieceFromSquare(square: Position): void;
  addPieceToSquare(piece: Piece, square: Position): void;
  getPieceInSquare(square: Position): Piece | null;
  isPieceInSquare(square: Position): boolean;
  isPieceInPath(path: Position[]): boolean;
  movePiece(from: Position, to: Position): void;
}

export class Mailbox implements Chessboard {
  protected mailbox: (Piece | null)[][];
  private kings: { [key in Color]: [number, number] };
  constructor() {
    this.mailbox = ranks.map(() => files.map(() => null));
    autoBind(this);
  }

  private convertFileToIndex(file: PosFile) {
    return files.indexOf(file);
  }

  private convertRankToIndex(rank: PosRank) {
    return rank - 1;
  }

  private convertSquareToIndexes(square: Position): [number, number] {
    return [
      this.convertRankToIndex(square.getRank()),
      this.convertFileToIndex(square.getFile()),
    ];
  }

  getPieceInSquare(square: Position): Piece | null {
    const indexes = this.convertSquareToIndexes(square);
    return this.mailbox[indexes[0]][indexes[1]];
  }

  addPieceToSquare(piece: Piece, square: Position): void {
    const indexes = this.convertSquareToIndexes(square);
    this.mailbox[indexes[0]][indexes[1]] = piece;
    if (piece instanceof King) {
      this.kings[piece.getColor()] = indexes;
    }
  }

  removePieceFromSquare(square: Position): void {
    const indexes = this.convertSquareToIndexes(square);
    this.mailbox[indexes[0]][indexes[1]] = null;
  }

  isPieceInSquare(square: Position): boolean {
    return !!this.getPieceInSquare(square);
  }

  isPieceInPath(path: Position[]): boolean {
    return path.map(this.isPieceInSquare).some(identity);
  }

  movePiece(from: Position, to: Position): void {
    this.addPieceToSquare(this.getPieceInSquare(from), to);
    this.removePieceFromSquare(from);
  }
}
