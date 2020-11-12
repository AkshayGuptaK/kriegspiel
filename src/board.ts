import autoBind from 'auto-bind';
import { Position, files, PosRank } from './position';
import {
  Color,
  getOtherColor,
  Piece,
  King,
  Queen,
  Rook,
  Bishop,
  Knight,
  Pawn,
} from './piece';
import { Move, MoveData } from './history';
import { Mailbox } from './mailbox';
import { binaryMap, constructClass, zip } from './utils';

export class Board {
  private chessboard: Mailbox;
  constructor() {
    autoBind(this);
    this.chessboard = new Mailbox();
    this.makeArmies();
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

  private isObstructed(
    player: Color,
    from: Position,
    to: Position,
    piece: Piece
  ): boolean {
    const path = from.pathTo(to);
    const isPathObstructed = this.chessboard.isPieceInPath(path);

    const destinationPiece = this.chessboard.getPieceInSquare(to);
    const isDestinationObstructed =
      destinationPiece &&
      (destinationPiece.isColor(player) || piece instanceof Pawn);

    return isPathObstructed || isDestinationObstructed;
  }

  private isCapture(player: Color, to: Position): boolean {
    const opponent = getOtherColor(player);
    const destinationPiece = this.chessboard.getPieceInSquare(to);
    return destinationPiece && destinationPiece.isColor(opponent);
  }

  private isEnPassantCapture(previousMove: Move, to: Position): boolean {
    return previousMove.isDoublePawnMove() && previousMove.isInMovePath(to);
  }

  private isPawnCapture(
    player: Color,
    to: Position,
    previousMove: Move
  ): boolean {
    const normalPawnCapture = this.isCapture(player, to);
    const enPassantCapture = this.isEnPassantCapture(previousMove, to);

    return normalPawnCapture || enPassantCapture;
  }

  private capture(to: Position): void {
    this.chessboard.removePieceFromSquare(to);
  }

  private tryCastle(
    player: Color,
    king: King,
    from: Position,
    to: Position
  ): MoveData | void {
    const moveVector = from.vectorTo(to);
    if (king.canCastle(moveVector)) {
      const isKingside = moveVector.isRightwards();
      const rookRank = player == 'white' ? 1 : 8;
      const rookFile = isKingside ? 'h' : 'a';
      const rookFrom = new Position(rookFile, rookRank);
      const castlingRook = this.chessboard.getPieceInSquare(rookFrom);
      if (castlingRook instanceof Rook && castlingRook.canCastle()) {
        const rookTo = isKingside ? to.getLeftOf() : to.getRightOf();
        if (
          this.isObstructed(player, from, to, king) ||
          this.isObstructed(player, rookFrom, rookTo, castlingRook)
        ) {
          console.log('That move is obstructed');
          return;
        }
        this.chessboard.movePiece(from, to);
        king.setMoved();
        this.chessboard.movePiece(rookFrom, rookTo);
        castlingRook.setMoved();
        return [player, king, from, to];
      }
    }
    console.log(`Your ${king.name} cannot move there`);
    return;
  }

  tryMove(
    player: Color,
    from: Position,
    to: Position,
    previousMove: Move
  ): MoveData | void {
    const piece = this.chessboard.getPieceInSquare(from);
    const doesPlayerOwnPieceAtFrom = !piece || !piece.isColor(player);
    if (doesPlayerOwnPieceAtFrom) {
      console.log('You do not control any piece at that position');
      return;
    }
    const moveVector = from.vectorTo(to);
    if (!piece.canMove(moveVector)) {
      if (piece instanceof King) {
        return this.tryCastle(player, piece, from, to);
      }
      if (
        piece instanceof Pawn &&
        piece.canCapture(moveVector) &&
        this.isPawnCapture(player, to, previousMove)
      ) {
        this.capture(to);
        console.log(`Capture at ${to.toString()}`);
        this.chessboard.movePiece(from, to);
        piece.setMoved();
        return [player, piece, from, to];
      }
      console.log(`Your ${piece.name} cannot move there`);
      return;
    }
    if (this.isObstructed(player, from, to, piece)) {
      console.log('That move is obstructed');
      return;
    }
    if (this.isCapture(player, to)) {
      this.capture(to);
      console.log(`Capture at ${to.toString()}`);
    }
    this.chessboard.movePiece(from, to);
    piece.setMoved();
    return [player, piece, from, to];
  }
}
