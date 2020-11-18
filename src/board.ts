import autoBind from 'auto-bind';
import { Position, files, PosRank, ranks } from './movement/position';
import {
  Color,
  getOtherColor,
  King,
  Queen,
  Rook,
  Bishop,
  Knight,
  Pawn,
  Piece,
} from './piece';
import { Move } from './movement/move';
import { Chessboard, Mailbox } from './model/mailbox';
import { binaryMap, constructClass, identity, noop, zip } from './utils/utils';
import { Either } from './utils/either';
import {
  ifContinueElseDo,
  ifContinueElseError,
  ifAnyDoElseError,
} from './utils/if';
import { all, compose } from './utils/fp-utils';
import { isNotNullish } from './utils/type-utils';

export class Board {
  constructor(private chessboard: Chessboard = new Mailbox()) {
    autoBind(this);
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

  makeArmies(): void {
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
  }

  isPlayerInCheck(player: Color, previousMove: Move): Piece[] {
    const opponent = getOtherColor(player);
    const kingPosition = this.chessboard.getPositionOfKing(player);
    const squares = files
      .map((file) => ranks.map((rank) => new Position(file, rank)))
      .flat();
    const pieces = squares.map(this.chessboard.getPieceInSquare);
    return zip(pieces, squares)
      .filter(([piece, _position]) => piece && piece.isColor(opponent))
      .map(([_piece, position]) =>
        this.tryMove(opponent, position, kingPosition, previousMove)
      )
      .map((either) => either.fold(noop, identity))
      .filter(isNotNullish)
      .map((move: Move) => move.piece);
  }

  check(move: Move): Move | void {
    const trialBoard = this.clone();
    trialBoard.doMove(move);
    const threats = trialBoard.isPlayerInCheck(move.player, move);
    if (threats.length) return console.log('That move is not legal');
    this.doMoveForReal(move);

    const checks = this.isPlayerInCheck(getOtherColor(move.player), move);
    if (checks.length) console.log('Check!');
    return move;
  }

  checkmate(checks: Piece[]): boolean {
    return false;
    // try all king moves
    // try all capture for each checking piece
    // get move path for checking piece, check for moving into that
  }

  doMove(move: Move): Move {
    const { from, to } = move;
    move.getAssociatedMoves().map(this.doMove);
    this.chessboard.movePiece(from, to);
    return move;
  }

  doMoveForReal(move: Move): Move {
    this.doMove(move);
    move.getAssociatedMoves().map(({ player, piece, to }) => {
      const isCapture = piece.isColor(getOtherColor(player));
      isCapture ? console.log(`Capture at ${to.toString()}`) : piece.setMoved();
    });
    return move;
  }

  clone(): Board {
    return new Board(this.chessboard.clone());
  }
}
