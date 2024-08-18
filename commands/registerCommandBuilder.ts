import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("新しいスコアを登録します"),

  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("Hello, World!");
  },
};
