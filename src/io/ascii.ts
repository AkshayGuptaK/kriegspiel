import autoBind from 'auto-bind';
import { Chessboard } from '../model/mailbox';
import { Piece } from '../piece';
import { files, Position, PosRank, ranks } from '../movement/position';

export class AsciiBoard {
  constructor(private board: Chessboard) {
    autoBind(this);
  }

  private pad(str: string): string {
    return ` ${str} `;
  }

  private printPiece(piece: Piece | null): string {
    if (!piece) return '.';
    return piece.isColor('white')
      ? piece.symbol.toUpperCase()
      : piece.symbol.toLowerCase();
  }

  private printRank(rank: PosRank): string {
    const rankStr = ` ${rank} |`;
    const endStr = '|\n';
    return [
      rankStr,
      ...files
        .map((file) => new Position(file, rank))
        .map(this.board.getPieceInSquare)
        .map(this.printPiece)
        .map(this.pad),
      endStr,
    ].join('');
  }

  print(): string {
    const border = '   +------------------------+\n';
    const filesStr = '     a  b  c  d  e  f  g  h\n';
    return [
      border,
      ...ranks.slice().reverse().map(this.printRank),
      border,
      filesStr,
    ].join('');
  }
}
