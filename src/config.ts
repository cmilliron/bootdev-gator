import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName;
  writeConfig(config);
}

export function readConfig() {
  const filePath = getConfigFilePath();
  const data = fs.readFileSync(filePath, "utf8");
  const jsonData = JSON.parse(data);
  // console.log(jsonData);
  return validateConfig(jsonData);
}

function getConfigFilePath(): string {
  const filename = ".gatorconfig.json";
  const filePath = path.join(os.homedir(), filename);
  return filePath;
}

export function writeConfig(cfg: Config): void {
  const filepath = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const data = JSON.stringify(rawConfig);
  fs.writeFileSync(filepath, data, { encoding: "utf8" });
}

function validateConfig(rawConfig: any): Config {
  // used by readConfig to validate the result of JSON.parse.
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name required in config file");
  }
  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}
