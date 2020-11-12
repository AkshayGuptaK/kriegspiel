import autoBind from 'auto-bind';
import { files, Position } from './position';
import {
  Color,
  getOtherColor,
  Rook,
  Knight,
  King,
  Queen,
  Pawn,
  Bishop,
} from './piece';
import { Move, MoveData } from './history';
import { Mailbox } from './mailbox';

export class Board {
  private chessboard: Mailbox;
  constructor() {
    autoBind(this);
    this.chessboard = new Mailbox();
    this.makeArmies();
  }

  private makePawns(color: Color) {
    return files.map(() => new Pawn(color));
  }

  private makePieces(color: Color) {
    return [
      new Rook(color),
      new Knight(color),
      new Bishop(color),
      new Queen(color),
      new King(color),
      new Bishop(color),
      new Knight(color),
      new Rook(color),
    ];
  }

  private makeArmies() {
    this.chessboard.setPiecesForRank(this.makePieces('white'), 1);
    this.chessboard.setPiecesForRank(this.makePawns('white'), 2);
    this.chessboard.setPiecesForRank(this.makePieces('black'), 8);
    this.chessboard.setPiecesForRank(this.makePawns('black'), 7);
  }

  capture(to: Position): void {
    this.chessboard.removePieceFromSquare(to);
    console.log(`Capture at ${to.toString()}`);
  }

  isObstructed(player: Color, from: Position, to: Position): boolean {
    const path = from.pathTo(to);
    if (this.chessboard.isPieceInPath(path)) {
      console.log('That move is obstructed');
      return true;
    }
    const destinationPiece = this.chessboard.getPieceInSquare(to);
    if (destinationPiece && destinationPiece.isColor(player)) {
      console.log('That move is obstructed');
      return true;
    }
    return false;
  }

  checkCapture(player: Color, to: Position): boolean {
    const opponent = getOtherColor(player);
    const destinationPiece = this.chessboard.getPieceInSquare(to);
    if (destinationPiece && destinationPiece.isColor(opponent)) {
      this.capture(to);
      return true;
    }
    return false;
  }

  checkPawnCapture(player: Color, to: Position, previousMove: Move): boolean {
    const normalCapture = this.checkCapture(player, to);
    if (normalCapture) return true;
    if (previousMove.isDoublePawnMove() && previousMove.isInMovePath(to)) {
      this.capture(to);
      return true;
    }
    return false;
  }

  tryMove(
    player: Color,
    from: Position,
    to: Position,
    previousMove: Move
  ): MoveData | void {
    const piece = this.chessboard.getPieceInSquare(from);
    const moveVector = from.vectorTo(to);
    if (!piece || !piece.isColor(player)) {
      console.log('You do not control any piece at that position');
      return;
    }
    if (!piece.canMove(moveVector)) {
      if (piece instanceof King) {
        return this.tryCastle(player, piece, from, to);
      }
      if (
        piece instanceof Pawn &&
        piece.canCapture(moveVector) &&
        this.checkPawnCapture(player, to, previousMove)
      ) {
        this.chessboard.movePiece(from, to);
        piece.setMoved();
        return [player, piece, from, to];
      }
      console.log(`Your ${piece.name} cannot move there`);
      return;
    }
    if (this.isObstructed(player, from, to)) {
      return;
    }
    this.checkCapture(player, to);
    this.chessboard.movePiece(from, to);
    piece.setMoved();
    return [player, piece, from, to];
  }

  tryCastle(
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
          this.isObstructed(player, from, to) ||
          this.isObstructed(player, rookFrom, rookTo)
        ) {
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
}
