import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (!args[0]) {
    throw new Error("You need a user name.");
  }
  console.log(args[0]);
  setUser(args[0]);
  console.log(`${args[0]} has successfully login in.`);
}

// This function registers a new handler function for a command name.
export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

// This function runs a given command with the provided state if it exists.
export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const command = registry[cmdName];
  command(cmdName, ...args);
}
