import autoBind from 'auto-bind';
import { literalArray } from './type-utils';
import { getElementsInBetween, getFirstFractionOfArray, zip } from './utils';

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
  return files.includes(file as any);
}

export function isRank(rank: number): rank is PosRank {
  return ranks.includes(rank as any);
}

interface Distance {
  rank: number;
  file: number;
}

export class Position {
  constructor(private file: PosFile, private rank: PosRank) {
    autoBind(this);
  }

  vectorTo(position: Position): Distance {
    return {
      rank: position.rank - this.rank,
      file: position.file.charCodeAt(0) - this.file.charCodeAt(0),
    };
  }

  isSamePosition(position: Position): boolean {
    const vector = this.vectorTo(position);
    return vector.rank == 0 && vector.file == 0;
  }

  getLeftOf(by = 1): Position {
    return new Position(files[files.indexOf(this.file) - by], this.rank);
  }

  getRightOf(by = 1): Position {
    return new Position(files[files.indexOf(this.file) + by], this.rank);
  }

  distanceFrom(position: Position): Distance {
    const vector = this.vectorTo(position);
    return {
      rank: Math.abs(vector.rank),
      file: Math.abs(vector.file),
    };
  }

  pathTo(position: Position): Position[] {
    const distance = this.distanceFrom(position);
    if (distance.rank == distance.file) {
      return zip(
        getElementsInBetween(files, this.file, position.file),
        getElementsInBetween(ranks, this.rank, position.rank)
      ).map((pos) => new Position(...pos));
    }
    if (distance.file > 0) {
      return getElementsInBetween(files, this.file, position.file).map(
        (file) => new Position(file, this.rank)
      );
    }
    if (distance.rank > 0) {
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
