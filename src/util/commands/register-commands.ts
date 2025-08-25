import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import path from 'path';
import parseCommands from './parse-commands';

interface CommandOptions {
  function: Function;
  args: any[];
}

async function registerCommands() {
  const routesCommandOptions: CommandOptions = {
    function: Routes.applicationGuildCommands,
    args: [Bun.env.BOT_ID, Bun.env.GUILD_ID],
  };

  const rest = new REST().setToken(Bun.env.BOT_TOKEN);

  console.log(`\nStarted refreshing application (/) commands.`);

  await rest
    .put(routesCommandOptions.function(...routesCommandOptions.args), {
      body: [],
    })
    .then(() => {
      const commands = parseCommands(
        path.join(__dirname, '../../commands')
      ).map((command) => command.data.toJSON());

      rest
        .put(routesCommandOptions.function(...routesCommandOptions.args), {
          body: commands,
        })
        .then((data: unknown) => {
          const slashCommands = data as SlashCommandBuilder[];
          console.log(
            `\nSuccessfully reloaded ${slashCommands.length} out of ${commands.length} application (/) commands.`
          );
        });
    });
}

registerCommands();
