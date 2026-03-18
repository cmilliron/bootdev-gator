import { CommandHandler } from "src/commands/commands";
import { readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

type UserCommanderHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

// type middlewareLoggedIn = (handler: UserCommanderHandler) => CommandHandler;

export function middlewareLoggedIn(
  handler: UserCommanderHandler,
): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const { currentUserName } = readConfig();
    const user: User = await getUserByName(currentUserName);
    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}
