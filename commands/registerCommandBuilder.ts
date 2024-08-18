import { CommandInteraction, CommandInteractionOptionResolver, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { ranking, rankingMsg } from "..";

const MANAGE_ROLE_ID = process.env.DISCORD_MANAGE_ROLE_ID!;

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
    const roles = interaction.member!.roles;
    if (!(roles instanceof GuildMemberRoleManager)) {
      throw new Error("roles is not of type GuildMemberRoleManager");
    }
    if (!roles.cache.has(MANAGE_ROLE_ID)) {
      await interaction.reply({
        content: "このコマンドを実行する権限がありません",
        ephemeral: true,
      });
      return;
    }

    const options = interaction.options as CommandInteractionOptionResolver;
    if (!(options instanceof CommandInteractionOptionResolver)) {
      throw new Error("options is not of type CommandInteractionOptionResolver");
    }

    const name = options.getString("name")!;
    const score = options.getInteger("score")!;
    const createdAt = new Date();

    if (score < 0) {
      await interaction.reply({
        content: "スコアは0以上の値である必要があります",
        ephemeral: true,
      });
      return;
    }

    ranking.upsert({ name, score, createdAt });
    rankingMsg?.edit(ranking.toString());
    await interaction.reply({
      content: "スコアを登録しました",
      ephemeral: true,
    });
  },
};
