import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  handlerResetDatabase,
} from "./commands/users";
import { readConfig } from "./config";
import { argv } from "process";

async function main() {
  const [command, ...args] = argv.slice(2);

  const cfg = readConfig();
  console.log(`dbURl: ${cfg.dbUrl}\nCurrent User: ${cfg.currentUserName}`);
  const commandRegistry: CommandsRegistry = {};

  registerCommand(commandRegistry, "login", handlerLogin);
  registerCommand(commandRegistry, "register", handlerRegister);
  registerCommand(commandRegistry, "reset", handlerResetDatabase);

  try {
    await runCommand(commandRegistry, command, ...args);
    console.log("finished");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  process.exit(0);
}

main();
