import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Command, CommandModule } from '../../types/base.model';

export default function parseCommands(
  commandsFolderPath: string
): Collection<string, Command> {
  console.log('Parsing commands.');

  const commands = new Collection<string, Command>();
  const commandFiles = fs.readdirSync(commandsFolderPath, {
    recursive: true,
    withFileTypes: true,
  });

  commandFiles.forEach((file) => {
    if (!file.isFile()) return;
    if (!file.name.endsWith('.command.ts')) return;

    const commandModule = require(path.join(
      commandsFolderPath,
      file.name
    )) as CommandModule;
    if (!commandModule) {
      console.error(`Command ${file.name} is undefined; skipping`);
      return;
    }

    const { command } = commandModule;
    if (!command?.data && !command?.execute) {
      console.error(
        `Command ${command.name} is missing data or execute method; skipping`
      );
      return;
    }

    commands.set(command.name, command);
  });

  console.log(`Successfully parsed ${commands.size} command(s).`);
  return commands;
}
