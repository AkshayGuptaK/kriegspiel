import autoBind from 'auto-bind';
import { Piece } from './piece';
import { files, PosFile, Position, PosRank, ranks } from './position';
import { identity } from './utils';

interface Chessboard {
  removePieceFromSquare(square: Position): void;
  addPieceToSquare(piece: Piece, square: Position): void;
  setPiecesForRank(pieces: Piece[], rank: PosRank): void;
  getPieceInSquare(square: Position): Piece | null;
  isPieceInSquare(square: Position): boolean;
  isPieceInPath(path: Position[]): boolean;
  movePiece(from: Position, to: Position): void;
}

export class Mailbox implements Chessboard {
  protected mailbox: (Piece | null)[][];
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

  private convertSquareToIndexes(square: Position) {
    return [
      this.convertRankToIndex(square.getRank()),
      this.convertFileToIndex(square.getFile()),
    ];
  }

  removePieceFromSquare(square: Position): void {
    const indexes = this.convertSquareToIndexes(square);
    this.mailbox[indexes[0]][indexes[1]] = null;
  }

  addPieceToSquare(piece: Piece, square: Position): void {
    const indexes = this.convertSquareToIndexes(square);
    this.mailbox[indexes[0]][indexes[1]] = piece;
  }

  setPiecesForRank(pieces: Piece[], rank: PosRank): void {
    this.mailbox[this.convertRankToIndex(rank)] = pieces;
  }

  getPieceInSquare(square: Position): Piece | null {
    const indexes = this.convertSquareToIndexes(square);
    return this.mailbox[indexes[0]][indexes[1]];
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
