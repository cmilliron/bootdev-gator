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
  unfollowFeedHandler,
} from "./handlers/feed";
import { middlewareLoggedIn } from "./middleware/user";

import { argv } from "process";
import { browseHandler } from "./handlers/posts";

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
    middlewareLoggedIn(addFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "follow",
    middlewareLoggedIn(followFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "following",
    middlewareLoggedIn(followingFeedHandler),
  );
  registerCommand(
    commandRegistry,
    "unfollow",
    middlewareLoggedIn(unfollowFeedHandler),
  );
  registerCommand(commandRegistry, "browse", middlewareLoggedIn(browseHandler));

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
