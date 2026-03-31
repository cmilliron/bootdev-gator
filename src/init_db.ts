import { Config, writeConfig } from "./config";
import { createUser } from "./lib/db/queries/users";

const defaultConfig: Config = {
  dbUrl: "postgres://example",
  currentUserName: "Default",
};

writeConfig(defaultConfig);
// await createUser(defaultConfig.currentUserName);
