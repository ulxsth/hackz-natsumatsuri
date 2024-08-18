import { Client, GatewayIntentBits, IntentsBitField, REST, Routes } from 'discord.js';

const TOKEN: string = process.env.DISCORD_TOKEN!;
const CLIENT_ID: string = process.env.DISCORD_CLIENT_ID!;

const rest = new REST({ version: '10' }).setToken(TOKEN);
const gatewayIntentValues = Object.values(GatewayIntentBits) as number[];
const intents: number = gatewayIntentValues.reduce((a, b) => a | b);
const client = new Client({ intents });

client.once('ready', () => {
  console.log(`Logged in as ${client.user!.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.content === "!ping") {
    msg.reply("Pong!");
  }
});

client.login(TOKEN);
