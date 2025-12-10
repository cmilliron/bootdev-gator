import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  listUsersHandler,
  loginUserHandler,
  registerUserHandler,
  resetDatabaseHandler,
} from "./commands/users";

import { readConfig } from "./config";
import { argv } from "process";

async function main() {
  const [command, ...args] = argv.slice(2);

  const cfg = readConfig();
  console.log(`dbURl: ${cfg.dbUrl}\nCurrent User: ${cfg.currentUserName}`);
  const commandRegistry: CommandsRegistry = {};

  registerCommand(commandRegistry, "login", loginUserHandler);
  registerCommand(commandRegistry, "register", registerUserHandler);
  registerCommand(commandRegistry, "reset", resetDatabaseHandler);
  registerCommand(commandRegistry, "users", listUsersHandler);

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
