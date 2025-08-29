import { ChatInputCommandInteraction, Client } from 'discord.js';
import runAtTime from '.././../util/functions/run-at-time.function';
import { command as wotdCommand } from '../../commands/wotd.command';
import { command as wordleCommand } from '../../commands/wordle.command';

export default function ready(client: Client<true>) {
  console.log(`\nBot is ready.`);

  runAtTime('8:00 AM', () =>
    wotdCommand.execute({
      client,
      reply: () => Promise.resolve(),
    } as unknown as ChatInputCommandInteraction)
  );

  runAtTime('8:00 AM', () =>
    wordleCommand.execute({
      client,
      deferReply: () => Promise.resolve(),
      editReply: () => Promise.resolve(),
    } as unknown as ChatInputCommandInteraction)
  );
}
