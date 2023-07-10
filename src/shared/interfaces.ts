import { Client as DiscordClient, type Collection, type Interaction, type SlashCommandBuilder, type If } from 'discord.js'

export class Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
  commands!: If<Ready, Collection<string, Command>>
}

export class Command {
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  execute: (interaction: Interaction) => Promise<void>

  constructor (data: SlashCommandBuilder, execute: (interaction: any) => Promise<void>) {
    this.data = data
    this.execute = execute
  }
}
