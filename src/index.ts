import {
  CommandsRegistry,
  handlerLogin,
  registerCommand,
  runCommand,
} from "./commandHandler";
import { readConfig, setUser } from "./config";
import { argv } from "process";

function main() {
  const cfg = readConfig();
  const commandRegistry: CommandsRegistry = {};
  // console.log("register Commands");
  registerCommand(commandRegistry, "login", handlerLogin);
  const [command, ...args] = argv.slice(2);
  // console.log(command);
  // console.log(args);
  // console.log("Process Commands");
  try {
    if (args.length < 1) {
      throw new Error("Not enough arguements were provided");
    }
    runCommand(commandRegistry, command, ...args);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
