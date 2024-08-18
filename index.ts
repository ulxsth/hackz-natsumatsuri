import { Client, REST, Routes, GatewayIntentBits, Events, WebhookClient, Message, GuildChannel, TextChannel, Collection, CommandInteraction, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { Ranking } from "./objects/Ranking";

const TOKEN: string = process.env.DISCORD_TOKEN!;
const CLIENT_ID: string = process.env.DISCORD_CLIENT_ID!;
const RANKING_CHANNEL_ID: string = process.env.DISCORD_RANKING_CHANNEL_ID!;

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
};

export let ranking = new Ranking();
export let rankingMsg: Message | null = null;

const commands: Command[] = [];
const foldersPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(foldersPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath).default;

  if (command.data && command.execute) {
    commands.push(command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const rest = new REST().setToken(TOKEN);
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const data = (await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands.map((cmd) => cmd.data.toJSON()),
    })) as any[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
  if (rankingMsg) {
    rankingMsg.edit("updated")
  } else {
    const channel = client.channels.cache.get(RANKING_CHANNEL_ID);
    if (channel) {
      const textChannel = channel as TextChannel;
      rankingMsg = await textChannel.send(ranking.toString());
    } else {
      console.log(
        `[WARNING] The channel with the ID ${RANKING_CHANNEL_ID} was not found.`
      );
    }
  }

  console.log(`Logged in as ${client.user!.tag}`);
});

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isCommand()) return;
  const command = commands.find(cmd => cmd.data.name === interaction.commandName);
  if (!command) return;

  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
})

client.login(TOKEN);
