import { createUser, getUser, deleteAllUsers } from "src/lib/db/queries/users";
import { setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args[0] || !cmdName) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const userName = args[0];
  console.log(userName);
  const user = await getUser(userName);
  if (!user) {
    throw new Error(`User ${userName} not registered`);
  }
  setUser(user.name);
  console.log(`${user.name} is the currrent active user.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  console.log("In Register Command");
  if (!args[0] || !cmdName) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  console.log(`Trying to create users - ${args[0]}`);

  const user = await getUser(args[0]);
  if (user) {
    console.log(`${user.name} with ${user.id} ID already exists`);
    throw new Error("User Already Exists");
  }

  const newUser = await createUser(args[0]);
  setUser(newUser.name);
  console.log(`${newUser.name} has been registered.\n`);
}

export async function handlerResetDatabase(cmdName: string, ...args: string[]) {
  await deleteAllUsers();
  console.log("User database has been reset");
}
