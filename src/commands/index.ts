import { AskCommand } from './impl/ask-command.impl';
import { PingCommand } from './impl/ping-command.impl';
import { PromptCommand } from './impl/prompt-command.impl';
import { ResetCommand } from './impl/reset-command.impl';
import { ServerCommand } from './impl/server-command.impl';
import { UserCommand } from './impl/user-command.impl';

export default [
  AskCommand,
  PingCommand,
  PromptCommand,
  ResetCommand,
  ServerCommand,
  UserCommand,
];
