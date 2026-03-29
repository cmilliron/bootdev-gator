import { User } from "src/lib/db/schema";

export async function browseHandler(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit = args[0] ?? 2;

  //
}
