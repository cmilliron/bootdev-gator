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
} from "./handlers/users";
import {
  addFeedHandler,
  feedsHandler,
  getFeedHandler,
  followFeedHandler,
  followingFeedHandler,
} from "./handlers/feed";
import { middlewareLoggedIn } from "./middleware/user";

import { argv } from "process";

async function main() {
  const [command, ...args] = argv.slice(2);

  const commandRegistry: CommandsRegistry = {};

  registerCommand(commandRegistry, "login", loginUserHandler);
  registerCommand(commandRegistry, "register", registerUserHandler);
  registerCommand(commandRegistry, "reset", resetDatabaseHandler);
  registerCommand(commandRegistry, "users", listUsersHandler);
  registerCommand(commandRegistry, "agg", getFeedHandler);
  registerCommand(commandRegistry, "feeds", feedsHandler);

  // Protected Feeds
  registerCommand(
    commandRegistry,
    "addfeed",
    await middlewareLoggedIn(addFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "follow",
    await middlewareLoggedIn(followFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "following",
    await middlewareLoggedIn(followingFeedHandler),
  );

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
