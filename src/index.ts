import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin } from "./commands/users";
import { readConfig } from "./config";
import { argv } from "process";

async function main() {
  const [command, ...args] = argv.slice(2);

  const cfg = readConfig();
  const commandRegistry: CommandsRegistry = {};

  registerCommand(commandRegistry, "login", handlerLogin);

  try {
    await runCommand(commandRegistry, command, ...args);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  process.exit(0)
}

main();
