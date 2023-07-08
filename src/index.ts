// Import the necessary discord.js classes
import fs from 'node:fs'
import path from 'node:path'
import 'dotenv/config'

import { Client } from './shared/interfaces'
import { Events, GatewayIntentBits, Collection } from 'discord.js'

import { ClientReadyEvent } from './events/client-ready.event'
import { InteractionCreateEvent } from './events/interaction-create.event'

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: string) => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  import(filePath)
    .then((command) => {
      if ('data' in command && 'execute' in command) {
        if (client.commands != null) {
          client.commands.set(command.data.name, command)
        }
      } else {
        console.warn(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property. It was not added to the command list.`
        )
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

client.once(Events.ClientReady, (client) => {
  void ClientReadyEvent(client as Client)
})
client.on(Events.InteractionCreate, async (interaction) => {
  await InteractionCreateEvent(interaction)
})

client.login(process.env.token).catch((error) => {
  console.error('Error while logging in : ', error)
})
