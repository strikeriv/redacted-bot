import path from 'node:path';

import {
  CacheType,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
} from 'discord.js';

import ready from './src/events/client/ready';
import create from './src/events/interaction/create';
import parseCommands from './src/util/commands/parse-commands';

async function init(): Promise<void> {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  console.log('Initializing.\n');

  client.commands = parseCommands(path.join(__dirname, 'src/commands'));

  // set up events
  client.once(Events.ClientReady, (client) => ready(client));

  client.on(Events.InteractionCreate, (interaction: Interaction<CacheType>) =>
    create(interaction)
  );

  await client.login(Bun.env.BOT_TOKEN);
}

await init();
