import { ChatInputCommandInteraction, Client } from 'discord.js';
import runAtTime from '.././../util/functions/run-at-time.function';
import { command } from '../../commands/wotd.command';

export default function ready(client: Client<true>) {
  console.log(`\nBot is ready.`);

  runAtTime('8:00 AM', () =>
    command.execute({
      client,
    } as unknown as ChatInputCommandInteraction)
  );
}
