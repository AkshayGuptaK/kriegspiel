import autoBind from 'auto-bind';
import { Chessboard } from '../model/mailbox';
import { Piece } from '../piece';
import { files, Position, PosRank, ranks } from '../movement/position';

export class AsciiBoard {
  constructor(private board: Chessboard) {
    autoBind(this);
  }

  private padWithSpace(str: string): string {
    return ` ${str} `;
  }

  private getPieceRepresentation(piece: Piece | null): string {
    if (!piece) return '.';
    return piece.isColor('white')
      ? piece.symbol.toUpperCase()
      : piece.symbol.toLowerCase();
  }

  private getRankRepresentation(rank: PosRank): string {
    const rankLabel = ` ${rank} |`;
    const endBorder = '|\n';
    const piecesArray = files
      .map((file) => new Position(file, rank))
      .map(this.board.getPieceInSquare)
      .map(this.getPieceRepresentation)
      .map(this.padWithSpace);
    return [rankLabel, ...piecesArray, endBorder].join('');
  }

  toString(): string {
    const border = '   +------------------------+\n';
    const fileLabels = '     a  b  c  d  e  f  g  h\n';
    const ranksArray = ranks.slice().reverse().map(this.getRankRepresentation);
    return [border, ...ranksArray, border, fileLabels].join('');
  }
}
