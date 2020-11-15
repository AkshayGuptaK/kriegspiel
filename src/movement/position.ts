import autoBind from 'auto-bind';
import { literalArray } from '../utils/type-utils';
import {
  getElementsInBetween,
  getFirstFractionOfArray,
  zip,
} from '../utils/utils';
import { Vector } from './vector';

export const files = literalArray<string>()([
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
]);
export const ranks = literalArray<number>()([1, 2, 3, 4, 5, 6, 7, 8]);
export type PosFile = typeof files[number];
export type PosRank = typeof ranks[number];

export function isFile(file: string): file is PosFile {
  return files.includes(file as never);
}

export function isRank(rank: number): rank is PosRank {
  return ranks.includes(rank as never);
}

export class Position {
  constructor(private file: PosFile, private rank: PosRank) {
    autoBind(this);
  }

  getRank(): PosRank {
    return this.rank;
  }

  getFile(): PosFile {
    return this.file;
  }

  isSamePosition(position: Position): boolean {
    return this.file == position.file && this.rank == position.rank;
  }

  vectorTo(to: Position): Vector {
    return new Vector(
      to.rank - this.rank,
      to.file.charCodeAt(0) - this.file.charCodeAt(0)
    );
  }

  getLeftOf(by = 1): Position {
    return new Position(files[files.indexOf(this.file) - by], this.rank);
  }

  getRightOf(by = 1): Position {
    return new Position(files[files.indexOf(this.file) + by], this.rank);
  }

  pathTo(position: Position): Position[] {
    const vector = this.vectorTo(position);
    if (vector.isDiagonal()) {
      return zip(
        getElementsInBetween(files, this.file, position.file),
        getElementsInBetween(ranks, this.rank, position.rank)
      ).map((pos) => new Position(...pos));
    }
    if (vector.isAlongFile()) {
      return getElementsInBetween(files, this.file, position.file).map(
        (file) => new Position(file, this.rank)
      );
    }
    if (vector.isAlongRank()) {
      return getElementsInBetween(ranks, this.rank, position.rank).map(
        (rank) => new Position(this.file, rank)
      );
    }
    return [];
  }

  isQueenSide(): boolean {
    return getFirstFractionOfArray(files, 2).includes(this.file);
  }

  toString(): string {
    return `${this.file}${this.rank}`;
  }
}
