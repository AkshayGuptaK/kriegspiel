import autoBind from 'auto-bind';
import { Position, files, PosRank } from './movement/position';
import {
  Color,
  getOtherColor,
  King,
  Queen,
  Rook,
  Bishop,
  Knight,
  Pawn,
} from './piece';
import { Move } from './movement/move';
import { Chessboard, Mailbox } from './model/mailbox';
import { binaryMap, constructClass, zip } from './utils/utils';
import { Either } from './utils/either';
import {
  ifContinueElseDo,
  ifContinueElseError,
  ifAnyDoElseError,
} from './utils/if';
import { all, compose } from './utils/fp-utils';

export class Board {
  private chessboard: Chessboard;
  constructor() {
    autoBind(this);
    this.chessboard = new Mailbox();
    this.makeArmies();
  }

  getBoard(): Chessboard {
    return this.chessboard;
  }

  private addPawns(color: Color, rank: PosRank): void {
    binaryMap(
      this.chessboard.addPieceToSquare,
      files.map((file) => [new Pawn(color), new Position(file, rank)])
    );
  }

  private addPieces(color: Color, rank: PosRank): void {
    const pieces = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
    binaryMap(
      this.chessboard.addPieceToSquare,
      binaryMap(
        (piece, file) => [
          constructClass(piece, color),
          new Position(file, rank),
        ],
        zip(pieces, files)
      )
    );
  }

  private makeArmies(): void {
    this.addPieces('white', 1);
    this.addPawns('white', 2);
    this.addPieces('black', 8);
    this.addPawns('black', 7);
  }

  private doesPlayerOwnPieceAt(move: Move): boolean {
    return move.piece && move.piece.isColor(move.player);
  }

  private canPieceNormallyMakeThisMove(move: Move): boolean {
    return move.piece.canMove(move.getMoveVector());
  }

  private isCapture(player: Color, to: Position): boolean {
    const opponent = getOtherColor(player);
    const destinationPiece = this.chessboard.getPieceInSquare(to);
    return destinationPiece && destinationPiece.isColor(opponent);
  }

  private isEnPassantCapture(previousMove: Move, to: Position): boolean {
    return previousMove.isDoublePawnMove() && previousMove.isInMovePath(to);
  }

  private tryPawnCapture(move: Move): Move | null {
    const { player, piece, to, previousMove } = move;

    if (piece instanceof Pawn && piece.canCapture(move.getMoveVector())) {
      const normalPawnCapture = this.isCapture(player, to);
      const enPassantCapture = this.isEnPassantCapture(previousMove, to);
      if (normalPawnCapture) return move;
      if (enPassantCapture)
        return move.associateMove(
          new Move(
            getOtherColor(player),
            previousMove.piece,
            previousMove.to,
            null
          )
        );
    }
    return null;
  }

  private tryCastle(move: Move): Move | null {
    const { player, piece, to } = move;
    const moveVector = move.getMoveVector();

    if (piece instanceof King && piece.canCastle(moveVector)) {
      const isKingside = moveVector.isRightwards();
      const rookRank = player == 'white' ? 1 : 8;
      const rookFile = isKingside ? 'h' : 'a';
      const rookFrom = new Position(rookFile, rookRank);
      const castlingRook = this.chessboard.getPieceInSquare(rookFrom);
      if (castlingRook instanceof Rook && castlingRook.canCastle()) {
        const rookTo = isKingside ? to.getLeftOf() : to.getRightOf();
        return move.associateMove(
          new Move(player, castlingRook, rookFrom, rookTo)
        );
      }
    }
    return null;
  }

  private isNotObstructed(move: Move): boolean {
    const { player, piece, to } = move;
    const isPathObstructed = this.chessboard.isPieceInPath(move.getMovePath());

    const destinationPiece = this.chessboard.getPieceInSquare(to);
    const isDestinationObstructed =
      destinationPiece &&
      (destinationPiece.isColor(player) ||
        (piece instanceof Pawn && !piece.canCapture(move.getMoveVector())));

    return !(isPathObstructed || isDestinationObstructed);
  }

  private tryCapture(move: Move): Move {
    const { player, to } = move;
    if (this.isCapture(player, to)) {
      const opponent = getOtherColor(player);
      const capturedPiece = this.chessboard.getPieceInSquare(to);
      return move.associateMove(new Move(opponent, capturedPiece, to, null));
    }
    return move;
  }

  tryMove(
    player: Color,
    from: Position,
    to: Position,
    previousMove: Move
  ): Either {
    const piece = this.chessboard.getPieceInSquare(from);
    const move = new Move(player, piece, from, to, previousMove);
    return Either.of(move)
      .chain(
        ifContinueElseError(
          this.doesPlayerOwnPieceAt,
          'You do not control any piece at that position'
        )
      )
      .chain(
        ifContinueElseDo(
          this.canPieceNormallyMakeThisMove,
          ifAnyDoElseError(
            [this.tryPawnCapture, this.tryCastle],
            `That piece cannot make that kind of move`
          )
        )
      )
      .chain(
        ifContinueElseError(
          compose(all, this.isNotObstructed),
          'That move is obstructed'
        )
      )
      .map(this.tryCapture);
    // is this move illegal because it would put me in check?
    // i need to execute the move and try all the enemy piece attacks
  }

  doMove(move: Move): Move {
    const { player, piece, from, to } = move;
    move.getAssociatedMoves().map(this.doMove);
    this.chessboard.movePiece(from, to);
    const isCapture = piece.isColor(getOtherColor(player));
    isCapture ? console.log(`Capture at ${to.toString()}`) : piece.setMoved();
    return move;
  }
}
