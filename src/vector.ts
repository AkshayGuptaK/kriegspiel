export class Vector {
  constructor(private rank: number, private file: number) {}

  private toDistance() {
    return {
      rank: Math.abs(this.rank),
      file: Math.abs(this.file),
    };
  }

  isAlongFile(): boolean {
    return this.file != 0;
  }

  isAlongRank(): boolean {
    return this.rank != 0;
  }

  isStraight(): boolean {
    return this.rank == 0 || this.file == 0;
  }

  isDiagonal(): boolean {
    const distance = this.toDistance();
    return distance.rank == distance.file;
  }

  isL(): boolean {
    const distance = this.toDistance();
    return (
      (distance.rank == 1 || distance.rank == 2) &&
      distance.file == 3 - distance.rank
    );
  }

  hasMagnitudes(rankMagnitude: number, fileMagnitude: number): boolean {
    const distance = this.toDistance();
    return distance.rank == rankMagnitude && distance.file == fileMagnitude;
  }

  hasMagnitudesOfAtMost(rankMagnitude: number, fileMagnitude: number): boolean {
    const distance = this.toDistance();
    return distance.rank <= rankMagnitude && distance.file <= fileMagnitude;
  }

  isForwards(): boolean {
    return this.rank > 0;
  }

  isRightwards(): boolean {
    return this.file > 0;
  }
}
