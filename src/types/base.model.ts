import type {
  ChatInputCommandInteraction,
  Collection,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { Subscription } from 'rxjs';

// modify type for bun to include .env stuff
declare module 'bun' {
  interface Env {
    BOT_TOKEN: string;
    BOT_ID: string;
    GUILD_ID: string;
    QUOTES_CHANNEL: string;
    WORDLE_CHANNEL: string;
    WOTD_CHANNEL: string;
    WOTD_API_KEY: string;
  }
}

// modify the type for discord.js to type commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

// define a type for the export of commands
export type CommandModule = {
  command: Command;
};

// the command type that is constructed for each command
export type Command = {
  name: string;
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (
    interaction: ChatInputCommandInteraction
  ) => Promise<Subscription | InteractionResponse>;
};
