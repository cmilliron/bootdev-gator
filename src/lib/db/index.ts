import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { readConfig } from "../../config";

const config = readConfig();

// console.log(`connecting to db at ${config.dbUrl}`);
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema }); // , { schema }
