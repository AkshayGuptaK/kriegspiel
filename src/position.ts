import { literalArray } from './type-utils';

export const files = literalArray<string>()([
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
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
  constructor(private file: PosFile, private rank: PosRank) {}
  distanceFrom(position: Position): Distance {
    return {
      rank: Math.abs(position.rank - this.rank),
      file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0)),
    };
  }
}
