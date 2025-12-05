import {readConfig, type Config} from "./config"
import { setUser } from "./config.js"

// TODO - Update the main function to:
// TODO - Set the current user to "Lane" (actually, you should use your name instead) and update the config file on disk.
// TODO - Read the config file again, parse it into a config object and print it to the terminal.

function main() {
  let testConfig: Config = readConfig();
  testConfig = setUser("Jimbo", testConfig);
  // console.log(testConfig);
  console.log(readConfig())

}

main();
