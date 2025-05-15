import dotenv from 'dotenv';

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  GUILD_ID,
  API_HOST,
  NUMBER_OF_API_RETRY,
  TIME_TO_RETRY,
  PORT,
  LLM_PROVIDER,
} = process.env;

let DISCORD_LLM_PROVIDER;

if (
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !GUILD_ID ||
  !API_HOST ||
  !NUMBER_OF_API_RETRY ||
  !TIME_TO_RETRY ||
  !PORT
) {
  throw new Error('Missing environment variables');
}

if (!LLM_PROVIDER) {
  console.warn(
    'LLM_PROVIDER is not set. Defaulting to "gemini". This may cause issues if you are using a different provider.',
  );
  DISCORD_LLM_PROVIDER = 'gemini';
} else {
  DISCORD_LLM_PROVIDER = LLM_PROVIDER;
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  GUILD_ID,
  API_HOST,
  NUMBER_OF_API_RETRY,
  TIME_TO_RETRY,
  PORT,
  LLM_PROVIDER,
  DISCORD_LLM_PROVIDER,
};
