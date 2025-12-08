import { setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[])  {
  if (!args[0] || !cmdName) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  console.log(args[0]);
  setUser(args[0]);
  console.log(`${args[0]} is the currrent active user.`);
}
