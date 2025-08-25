import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import { EMPTY, forkJoin, from, map, switchMap } from 'rxjs';
import { wotdService } from '../modules/wotd/wotd.service';
import { Command } from '../types/base.model';

const data = new SlashCommandBuilder()
  .setName('wotd')
  .setDescription('Force run the WOTD event')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client;

  console.log('\nRunning the word of the day!');

  return from(client.guilds.fetch(Bun.env.GUILD_ID))
    .pipe(
      switchMap((guild) =>
        forkJoin({
          channel: guild.channels.fetch(Bun.env.WOTD_CHANNEL),
          wotd: wotdService.getTodaysWordOfTheDay(),
        })
      ),
      map(({ channel, wotd }) => ({
        channel,
        wotd: new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Word Of The Day')
          .setDescription(`The word of the day is \`${wotd.word}\`.`)
          .addFields(
            { name: 'Definition', value: `\`${wotd.definitions[0].text}\`` },
            { name: 'Example', value: `\`${wotd.examples[0].text}\`` }
          )
          .setFooter({ text: wotd.note }),
      })),
      switchMap(({ channel, wotd }) => {
        if (!channel) return EMPTY;
        if (!channel.isTextBased()) return EMPTY;

        return channel.send({ embeds: [wotd] });
      })
    )
    .subscribe(() => {
      interaction.reply({
        content: 'The WOTD event has been force ran.',
        flags: MessageFlags.Ephemeral,
      });
    });
}

export const command = {
  name: 'wotd',
  data,
  execute,
} as Command;
