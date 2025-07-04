import { Events, Message, TextChannel } from 'discord.js';
import { config } from '../../config';
import helper from '../../util/helper';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { DiscordEvent } from '../discord-event';

export class MessageCreateEvent implements DiscordEvent {
  public name: string;
  private self: MessageCreateEvent | undefined;
  private isTyping: boolean = false;
  private maxLength = 2000;

  constructor() {
    this.name = Events.MessageCreate;
  }

  public getInstance(): DiscordEvent {
    if (!this.self) {
      this.self = new MessageCreateEvent();
    }
    return this.self;
  }

  public async execute(interaction: Message) {
    if (
      interaction.mentions.repliedUser?.id != config.DISCORD_CLIENT_ID &&
      !helper.isCallingBot(interaction.content) &&
      !interaction.mentions?.users.has(config.DISCORD_CLIENT_ID)
    )
      return;
    let q = interaction.content?.replace('beb, ', '');
    q = q.replace(/<[^>]*>/g, '');
    let channel = interaction.channel as TextChannel;
    this.isTyping = true;
    this.typing(channel);

    try {
      axiosRetry(axios, {
        retries: Number(config.NUMBER_OF_API_RETRY),
        retryDelay: (count) => {
          console.log('[RETRY API CALL] Retry attempt: ', count);
          return count * Number(config.TIME_TO_RETRY);
        },
        retryCondition: (error) => {
          return Number(error.response?.status).toString().startsWith('5');
        },
      });
      const answer = await axios.post(
        String(config.API_HOST + config.DISCORD_LLM_PROVIDER + '/chat'),
        {
          text: q,
          model: 'llama3.2:latest',
        },
      );
      this.isTyping = false;
      let isFirstInteraction = true;
      this.finalizeLLMOutput(answer.data.data.response).forEach(async (str) => {
        if (isFirstInteraction) {
          isFirstInteraction = false;
          await interaction.reply(str);
        } else {
          await interaction.channel.send(str);
        }
      });
    } catch (e) {
      console.error(`Error when executing axios : ${e}`);
      this.isTyping = false;
      await interaction.react('😵');
    }
  }

  private async typing(channel: TextChannel) {
    while (this.isTyping) {
      await channel.sendTyping();
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  private finalizeLLMOutput(answer: string): string[] {
    const outputChunks: string[] = [];
    let tempString = answer;
    while (tempString.length > this.maxLength) {
      let splitIndex = this.maxLength;
      const enterCheck = tempString.lastIndexOf("\n\n", this.maxLength);
      let isEnterSplitted = false;

      if (enterCheck != -1) {
        splitIndex = enterCheck;
        isEnterSplitted = true;
      } else {
        const fullStopCheck = tempString.lastIndexOf(". ", this.maxLength);
        if (fullStopCheck != -1) {
          splitIndex = fullStopCheck;
        }
      }

      const outputChunk = tempString.slice(0, splitIndex + 1).trim();
      outputChunks.push(outputChunk);
      if (isEnterSplitted) {
        tempString = "_ _\n" + tempString.slice(splitIndex + 1).trim();
      } else {
        tempString = tempString.slice(splitIndex + 1).trim();
      }
    }

    if (tempString.length > 0) {
      outputChunks.push(tempString);
    }
    return outputChunks;
  }

}
