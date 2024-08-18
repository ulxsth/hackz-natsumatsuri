export type Score = {
  name: string;
  score: number;
  createdAt: Date;
}

export class Ranking {
  private ranking: Score[] = [];

  upsert(score: Score): void {
    const index = this.ranking.findIndex((s) => s.name === score.name);
    if (index === -1) {
      this.ranking.push(score);
    } else {
      this.ranking[index] = score;
    }

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
