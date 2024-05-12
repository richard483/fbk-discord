import dotenv from 'dotenv';

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  GUILD_ID,
  API_HOST,
  NUMBER_OF_API_RETRY,
  TIME_TO_REPLY,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !GUILD_ID ||
  !API_HOST ||
  !NUMBER_OF_API_RETRY ||
  !TIME_TO_REPLY
) {
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  GUILD_ID,
  API_HOST,
  NUMBER_OF_API_RETRY,
  TIME_TO_REPLY,
};
