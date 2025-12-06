import { Config, writeConfig } from "./config";

const defaultConfig: Config = {
  dbUrl: "postgres://example",
  currentUserName: "Cody",
};

writeConfig(defaultConfig);
