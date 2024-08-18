import { Client, REST, Routes, GatewayIntentBits, Events } from "discord.js";
import fs from "fs";
import path from "path";

const TOKEN: string = process.env.DISCORD_TOKEN!;
const CLIENT_ID: string = process.env.DISCORD_CLIENT_ID!;

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(foldersPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath).default;
  console.log(command);

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

client.once("ready", () => {
  console.log(`Logged in as ${client.user!.tag}`);
});

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isCommand()) return;
  interaction.reply("yo")
})

client.login(TOKEN);
