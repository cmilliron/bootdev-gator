import fs from "fs";
import os from "os";
import path from "path";

// TODO - Don't worry about adding current_user_name, that will be set by the application.

// TODO - Create a config.ts file. This is where we'll handle reading and writing the JSON file.
// TODO - Create a Config type that represents the JSON file structure. Keep the fields in camelCase even though the JSON keys are snake_case.
// TODO - This file should have the following functionality exported:

// TODO - Export a setUser function that writes a Config object to the JSON file after setting the current_user_name field.
// TODO - Export a readConfig function that reads the JSON file found at ~/.gatorconfig.json and returns a Config object. It should read the file from the HOME directory, then decode the JSON string into a new Config object.

// TODO - To read and write to JSON, I used:

// TODO - fs.readFileSync(path[,options]) and set the encoding to 'utf-8'.
// TODO - fs.writeFileSync(file, data[, options]) after using JSON.stringify
// TODO - To get the path to read and write to, I used:

// TODO - path.join([...paths]) and os.homedir

type Config = {
  dbURL: string;
  currentUserName?: string;
};

export function setUser(userName: string, currentConfig: Config): Config {
  currentConfig.currentUserName = userName;
  return currentConfig;
}

export function readConfig() {}

function getConfigFilePath(): string {
  return `${os.homedir}/.gatorconfig.json`;
}
function writeConfig(cfg: Config): void;
function validateConfig(rawConfig: any): Config; // used by readConfig to validate the result of JSON.parse.
