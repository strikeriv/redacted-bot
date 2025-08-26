import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { EMPTY, forkJoin, from, map, switchMap } from "rxjs";
import { wordleService } from "../modules/wordle/wordle.service";
import { Command } from "../types/base.model";

const data = new SlashCommandBuilder()
  .setName("wordle")
  .setDescription("Force run the Wordle event")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client;

  console.log("\nRunning Wordle!");

  return from(interaction.deferReply())
    .pipe(
      switchMap(() => from(client.guilds.fetch(Bun.env.GUILD_ID))),
      switchMap((guild) =>
        forkJoin({
          channel: guild.channels.fetch(Bun.env.WORDLE_CHANNEL),
          wordleData: wordleService.getTodaysWordle(),
        })
      ),
      map(({ channel, wordleData }) => {
        if (!channel) return EMPTY;
        if (!channel.isTextBased()) return EMPTY;

        const { solution, days_since_launch, editor } = wordleData;

        const { data, iterations } = wordleService.runWordleIterations(solution);
        const { attempts, feedback, solves } = data;

        const bestSolveIndex = attempts.reduce((maxIdx, curr, idx, array) => (curr < array[maxIdx] ? idx : maxIdx), 0);

        const bestSolveFeedback = feedback[bestSolveIndex];
        const bestSolveSolved = solves[bestSolveIndex];

        const averageSolveAttempts = (attempts.reduce((acc, val) => acc + val, 0) / attempts.length).toFixed(2);
        const solvedPercentage = ((solves.filter((solved) => solved).length / iterations) * 100).toFixed(2);

        const embedColor = bestSolveSolved ? Colors.Green : Colors.Red;
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setTitle(`Wordle No. ${days_since_launch}`)
          .setFields(
            {
              name: "Statistics",
              value: `Using \`${iterations}\` random starting words, here are the statistics of todays puzzle:\n\nSolve Percentage: \`${solvedPercentage}%\`\nAverage Attempts (par): \`${averageSolveAttempts}\``,
            },
            {
              name: "Best Result",
              value: `${bestSolveFeedback.join("\n")}\n`,
            }
          )
          .setFooter({
            text: `Today's Wordle Editor: ${editor}`,
          });

        interaction.editReply({
          content: "The Wordle event has been force ran.",
          options: {
            ephemeral: true,
          },
        });

        channel.send({ embeds: [embed] });
      })
    )
    .subscribe();
}

export const command = {
  name: "wordle",
  data,
  execute,
} as Command;
