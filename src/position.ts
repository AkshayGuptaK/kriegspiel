import autoBind from 'auto-bind';
import { literalArray } from './type-utils';
import { getNextElementsOfArray, zip } from './utils';

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

  distanceFrom(position: Position): Distance {
    return {
      rank: Math.abs(position.rank - this.rank),
      file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0)),
    };
  }

  pathTo(position: Position): Position[] {
    const distance = this.distanceFrom(position);
    if (distance.rank == 0 && distance.file > 1) {
      return getNextElementsOfArray(distance.file - 1, files, this.file).map(
        (file) => new Position(file, this.rank)
      );
    }
    if (distance.file == 0 && distance.rank > 1) {
      return getNextElementsOfArray(distance.rank - 1, ranks, this.rank).map(
        (rank) => new Position(this.file, rank)
      );
    }
    if (distance.rank == distance.file && distance.rank > 1) {
      return zip(
        getNextElementsOfArray(distance.file - 1, files, this.file),
        getNextElementsOfArray(distance.rank - 1, ranks, this.rank)
      ).map((pos) => new Position(...pos));
    }
    return [];
  }
}
