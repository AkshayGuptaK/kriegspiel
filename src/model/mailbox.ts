import autoBind from 'auto-bind';
import { Color, King, Piece } from '../piece';
import { files, PosFile, Position, PosRank, ranks } from '../movement/position';
import { identity } from '../utils/utils';

export interface Chessboard {
  removePieceFromSquare(square: Position): void;
  addPieceToSquare(piece: Piece, square: Position): void;
  getPieceInSquare(square: Position): Piece | null;
  isPieceInSquare(square: Position): boolean;
  isPieceInPath(path: Position[]): boolean;
  movePiece(from: Position, to: Position | null): void;
  getPositionOfKing(color: Color): Position;
  clone(): Chessboard;
}

export class Mailbox implements Chessboard {
  constructor(
    protected mailbox: (Piece | null)[][] = ranks.map(() =>
      files.map(() => null)
    ),
    private kings: { [key in Color]?: [number, number] } = {}
  ) {
    autoBind(this);
  }

  private convertFileToIndex(file: PosFile) {
    return files.indexOf(file);
  }

  private convertRankToIndex(rank: PosRank) {
    return rank - 1;
  }

  private convertIndexToFile(index: number): PosFile {
    return files[index];
  }

  private convertIndexToRank(index: number): PosRank {
    return (index + 1) as PosRank;
  }

  private convertSquareToIndexes(square: Position): [number, number] {
    return [
      this.convertRankToIndex(square.getRank()),
      this.convertFileToIndex(square.getFile()),
    ];
  }

  private convertIndexesToSquare(indexes: [number, number]): Position {
    const [rankIndex, fileIndex] = indexes;
    return new Position(
      this.convertIndexToFile(fileIndex),
      this.convertIndexToRank(rankIndex)
    );
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

  movePiece(from: Position, to: Position | null): void {
    to && this.addPieceToSquare(this.getPieceInSquare(from), to);
    this.removePieceFromSquare(from);
  }

  getPositionOfKing(color: Color): Position {
    return this.convertIndexesToSquare(this.kings[color]);
  }

  clone(): Mailbox {
    return new Mailbox(
      this.mailbox.map((rank) => [...rank]),
      this.kings
    );
  }
}
