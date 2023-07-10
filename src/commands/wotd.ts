import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  type SlashCommandStringOption,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  type BaseInteraction,
  type StringSelectMenuInteraction,
  type Collection
} from 'discord.js'

import testData from './test.json'
import { ActionRowBuilder } from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wotd')
    .setDescription('Display another word of the day.')
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName('word')
        .setDescription('The word to display.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute (interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      if (interaction.guild == null || interaction.channel == null) {
        await interaction.reply({
          content: 'This command can only be run in a guild.',
          ephemeral: true
        })
      }

      const word = interaction.options.getString('word')
      if (word == null) {
        await interaction.reply({
          content: 'The word to display is required.',
          ephemeral: true
        })
      }

      if (testData.length === 0) {
        await interaction.reply({
          content: 'No definitions for this word were found.',
          ephemeral: true
        })
      }

      const evaluateDefinition = await new Promise<string | null>((resolve) => {
        if (testData.length === 1) {
          resolve(testData[0].text)
        }

        if (testData.length > 1) {
          const defintionSelect = new StringSelectMenuBuilder()
            .setCustomId('defintion-select')
            .setPlaceholder('Choose a definition')

          const dropdownOptions: StringSelectMenuOptionBuilder[] = []
          const definitions = new Map<string, string>()

          testData.forEach((definition, index) => {
            definitions.set(`definition-${index + 1}`, definition.text)

            const definitionText =
              definition.text.length > 100
                ? `${definition.text.substring(0, 97)}...`
                : definition.text
            dropdownOptions.push(
              new StringSelectMenuOptionBuilder()
                .setLabel(`Definition ${index + 1}`)
                .setValue(`definition-${index + 1}`)
                .setDescription(definitionText)
            )
          })

          defintionSelect.addOptions(dropdownOptions)

          const row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              defintionSelect
            )

          interaction
            .reply({
              content: 'Choose the definition to display',
              ephemeral: true,
              components: [row.toJSON()]
            })
            .then(async (choiceDropdown): Promise<void> => {
              const collector = choiceDropdown.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 3_600_000
              })

              collector.on(
                'collect',
                async (i: StringSelectMenuInteraction<'cached'>) => {
                  const selection: string = i.values[0]
                  resolve(definitions.get(selection) ?? '')
                }
              )

              collector.on(
                'end',
                async (collected: Collection<string, BaseInteraction>) => {
                  if (collected.size === 0) {
                    await interaction.followUp({
                      content: 'No definition was selected.',
                      ephemeral: true
                    })
                  }
                }
              )
            }).catch(async (error): Promise<void> => {
              console.log(error)

              await interaction.followUp({
                content:
                        'Something went wrong while running this command. Contact @strikeriv',
                ephemeral: true
              })
            })
        }
      })

      if (evaluateDefinition == null) {
        await interaction.reply({
          content: 'No definition was selected.',
          ephemeral: true
        })
      }

      await interaction.followUp({
        content:
                `Selected definition: \`${evaluateDefinition ?? ''}\``,
        ephemeral: true
      })
    } catch (error) {
      console.log(error)

      await interaction.reply({
        content:
          'Something went wrong while running this command. Contact @strikeriv',
        ephemeral: true
      })
    }
    // // query the API for the word
    // axios.request({
    //   method: 'GET',
    //   url: `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${process.env.wordnik_api_key ?? ''}`
    // }).then(async function ({ data }: { data: { word: string, note: string, definitions: [{ text: string }], examples: [{ text: string }] } }) {
    //   const wotdEmbed = new EmbedBuilder()
    //     .setColor('#0099ff')
    //     .setTitle('Word of the day')
    //     .setDescription(`The word of the day is \`${data.word}\`.`)
    //     .addFields(
    //       { name: 'Definition', value: `\`${data.definitions[0].text}\`` },
    //       { name: 'Example', value: `\`${data.examples[0].text}\`` }
    //     )
    //     .setFooter({ text: data.note })

    //   if (interaction.channel == null) return

    //   await interaction.channel.send({ embeds: [wotdEmbed] })
    // }).catch(function (error: any) { console.error(error) })
  }
}
