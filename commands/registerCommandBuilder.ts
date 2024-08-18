import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from "discord.js";
import { ranking, rankingMsg } from "..";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("新しいスコアを登録します")
    .addStringOption((option) => {
      return option
        .setName("name")
        .setDescription("名前")
        .setRequired(true);
    })
    .addIntegerOption((option) => {
      return option
        .setName("score")
        .setDescription("スコア（トータルの値段を入力）")
        .setRequired(true);
    }),

  execute: async (interaction: CommandInteraction) => {
    const options = interaction.options as CommandInteractionOptionResolver;

    if (!(options instanceof CommandInteractionOptionResolver)) {
      throw new Error("options is not of type CommandInteractionOptionResolver");
    }

    const name = options.getString("name")!;
    const score = options.getInteger("score")!;
    const createdAt = new Date();

    if (score < 0) {
      await interaction.reply("スコアは0以上の値である必要があります");
      return;
    }

    ranking.add({ name, score, createdAt });
    rankingMsg?.edit(ranking.toString());
    await interaction.reply("スコアを登録しました");
  },
};
