import { defineConfig } from 'drizzle-kit'
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
      },
      verbose: true,
  strict: true,
})