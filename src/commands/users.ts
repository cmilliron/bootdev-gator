import { setUser } from "../config";

export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (!args[0] || !cmdName) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  console.log(args[0]);
  setUser(args[0]);
  console.log(`${args[0]} is the currrent active user.`);
}
