export type Score = {
  name: string;
  score: number;
  createdAt: Date;
}

export class Ranking {
  private ranking: Score[] = [];

  add(score: Score): void {
    this.ranking.push(score);
    this.ranking = this.ranking.sort((a, b) => b.score - a.score);
  }

  get(rank: number): Score {
    return this.ranking[rank];
  }

  toString(): string {
    if (this.ranking.length === 0) {
      return "-# ※スコアが記録されると、ここにランキングが表示されます";
    }

    let msg = "【ランキング】\n";
    for (let i = 0; i < 10; i++) {
      const score = this.get(i);
      if (!score) {
        break;
      }

      const formattedTime = score.createdAt.toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      });
      msg += `${i + 1}. ${score.name} - ${score.score} pt. (${formattedTime})\n`;
    }
    return msg;
  }
}
