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
      this.sanitizeLLMOutput(answer.data.data.response).forEach(async (str) => {
        await interaction.reply(str);
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

  private sanitizeLLMOutput(answer: string): string[] {
    let sanitizeOutput = [];
    let tempString = answer;
    while (tempString.length > 2000) {
      sanitizeOutput.push(tempString.substring(0, 1999) + '-');
      tempString = tempString.substring(1999, tempString.length - 1);
    }

    sanitizeOutput.push(tempString);
    return sanitizeOutput;
  }
}
