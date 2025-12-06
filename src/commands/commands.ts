export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

// This function registers a new handler function for a command name.
export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void {
  registry[cmdName] = handler;
}

// This function runs a given command with the provided state if it exists.
export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const commandHandler = registry[cmdName];

  if (!commandHandler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  commandHandler(cmdName, ...args);
}
