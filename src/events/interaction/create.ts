import { Interaction, CacheType, MessageFlags } from 'discord.js';

export default async function create(
  interaction: Interaction<CacheType>
): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch {
    interaction.reply({
      content:
        'An internal error occured while executing this command. Please try again later.',
      flags: MessageFlags.Ephemeral,
    });
  }
}
