import { env } from "@/common/env.config";
import type { Knex } from "knex";

import * as dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: env.DATABASE_URL,
    migrations: {
      extension: 'ts',
      directory: './src/database/migrations',
    },
    seeds: {
      extension: 'ts',
      directory: './src/database/seeds',
    }
  },

  test: {
    client: "pg",
    connection: env.TEST_DATABASE_URL,
    migrations: {
      extension: 'ts',
      directory: './src/database/migrations',
    },
    seeds: {
      extension: 'ts',
      directory: './src/database/seeds',
    }
  },

  production: {
    client: "pg",
    connection: env.DATABASE_URL,
    migrations: {
      extension: 'ts',
      directory: './src/database/migrations',
    },
    seeds: {
      extension: 'ts',
      directory: './src/database/seeds',
    }
  }

};

export default config;