// Import the necessary discord.js classes
import fs from 'node:fs'
import path from 'node:path'
import 'dotenv/config'
import { Command } from 'commander'

import { Client } from './shared/interfaces'
import { Events, GatewayIntentBits, Collection } from 'discord.js'

import { ClientReadyEvent } from './events/client-ready.event'
import { InteractionCreateEvent } from './events/interaction-create.event'
import { deploy } from './util/deploy'

async function init (): Promise<void> {
// Create a new client instance
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })
  const program = new Command()

  client.commands = new Collection()

  const commandsPath = path.join(__dirname, 'commands')
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) => file.endsWith('.js'))

  for await (const file of commandFiles) {
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

  program.option(
    '-d, --deploy'
  ).parse(process.argv)

  if (program.opts().deploy != null) {
    await deploy(client.commands)
  }
  client.once(Events.ClientReady, (client) => {
    void ClientReadyEvent(client as Client)
  })
  client.on(Events.InteractionCreate, async (interaction) => {
    await InteractionCreateEvent(interaction)
  })

  client.login(process.env.token).then(_ => {
    console.log('Logged in!')
  }).catch((error) => {
    console.error('Error while logging in : ', error)
  })
}

init().then(_ => {
  console.log('Initialized!')
}).catch((error) => {
  console.error('Error while initializing : ', error)
})
