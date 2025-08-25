import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from 'discord.js';
import { Command } from '../types/base.model';

const data = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('Suggest a quote to archive.')
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('messageid')
      .setDescription('The message ID to quote.')
      .setRequired(true)
  );

async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const messageId = interaction.options.getString('messageid');
    if (messageId == null) {
      return await interaction.reply({
        content: 'The message ID is not valid.',
        ephemeral: true,
      });
    }

    const guild = interaction.guild;
    if (guild == null || interaction.channel == null) {
      return await interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
    }

    const message = await interaction.channel.messages.fetch(messageId);

    // Message validation
    if (message == null) {
      return await interaction.reply({
        content:
          "The given message could not be found.\nMake sure you're running this command in the channel that the message is located in.",
        ephemeral: true,
      });
    }

    if (message.author.bot) {
      return await interaction.reply({
        content: 'You cant quote a bot message.',
        ephemeral: true,
      });
    }

    if (message.author === interaction.user) {
      return await interaction.reply({
        content:
          'You cant quote your own message. That would be self-plagiarism, believe it or not.',
        ephemeral: true,
      });
    }

    // Construct the embed that is sent
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Quoted Out of Context')
      .setDescription(`**"${message.content}"** - ${message.author.toString()}`)
      .setFooter({ text: `Quoted by: @${interaction.user.username}` })
      .setTimestamp();

    // Send the embed
    const quotesChannel = (await guild.channels.fetch(
      process.env.quotes_channel ?? ''
    )) as GuildTextBasedChannel;
    await quotesChannel.send({ embeds: [embed] });
    return await interaction.reply({
      content: 'The quote has been quoted.',
      ephemeral: true,
    });
  } catch (error) {
    console.log(error);

    return await interaction.reply({
      content:
        'Something went wrong while running this command. Contact @strikeriv',
      ephemeral: true,
    });
  }
}

export const command = {
  name: 'quote',
  data,
  execute,
} as Command;
