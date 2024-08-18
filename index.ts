import { Client, REST, Routes, GatewayIntentBits, Events, WebhookClient, Message, GuildChannel, TextChannel } from "discord.js";
import fs from "fs";
import path from "path";

const TOKEN: string = process.env.DISCORD_TOKEN!;
const CLIENT_ID: string = process.env.DISCORD_CLIENT_ID!;
const RANKING_CHANNEL_ID: string = process.env.DISCORD_RANKING_CHANNEL_ID!;

interface Score {
  name: string;
  score: number;
}

export let ranking: Score[] = [];
export let rankingMsg: Message | null = null;

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(foldersPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath).default;

  if (command.data && command.execute) {
    commands.push(command.data.toJSON());
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
      body: commands,
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
      rankingMsg = await textChannel.send("【ランキング】");
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
  interaction.reply("yo")
})

client.login(TOKEN);
