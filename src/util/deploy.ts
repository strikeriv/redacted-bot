/* eslint-disable @typescript-eslint/no-floating-promises */
// Deploy the slash commands to discord
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import { type Command } from '../shared/interfaces'
import { type Collection, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js'

export async function deploy (commands: Collection<string, Command>): Promise<void> {
  try {
    const rest = new REST().setToken(process.env.token ?? '')
    const jsonCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

    commands.map(command => command.data.toJSON()).forEach(command => jsonCommands.push(command));
    (async () => {
      try {
        console.log(`Deploying ${jsonCommands.length} application (/) commands.)}`)

        // The put method is used to fully refresh all commands in the guild with the current set
        await rest.put(
          Routes.applicationCommands(process.env.client_id ?? ''),
          { body: jsonCommands }
        )

        console.log(`Successfully reloaded ${jsonCommands.length} application (/) commands.`)
      } catch (error) {
      // And of course, make sure you catch and log any errors!
        console.error(error)
      }
    })()
  } catch (error) {
    console.error(error)
  }
}
