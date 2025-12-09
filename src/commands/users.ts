import { createUser } from "src/lib/db/queries/users";
import { setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args[0] || !cmdName) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  console.log(args[0]);
  setUser(args[0]);
  console.log(`${args[0]} is the currrent active user.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  console.log("In Register Command");
  if (!args[0] || !cmdName) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  try {
    console.log(`Trying to create users - ${args}`);
    const result = await createUser(args[0]);
    console.log(result);
    setUser(args[0]);
    console.log(`${args[0]} has been registered.\n${result}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
}
