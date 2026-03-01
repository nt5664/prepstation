import { config } from "dotenv";
import { join } from "path";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/_data/index.js";

config({ path: join(process.cwd(), ".env.local3") });
const USER = process.env.POSTGRES_USER;
const PASS = process.env.POSTGRES_PASSWORD;
const HOST = process.env.POSTGRES_HOST || "localhost";
const PORT = process.env.POSTGRES_PORT || "5432";
const DB = process.env.POSTGRES_DB;
const DB_URL = `postgresql://${USER}:${PASS}@${HOST}:${PORT}/${DB}`;

const adapter = new PrismaPg({ connectionString: DB_URL });
const prisma = new PrismaClient({ adapter });

async function promote() {
  const name = process.argv[2];
  if (!name) {
    console.log("Usage: ./scripts/promote.mjs <USERNAME>");
    return;
  }

  // the name isn't unique so updateMany must be used
  const { count } = await prisma.user.updateMany({
    where: { name: { equals: name, mode: "insensitive" } },
    data: { role: "ADMIN" },
  });

  console.log(
    count
      ? `Success! ${name} has been promoted to admin.`
      : `Failure! Could not promote ${name}. Check the name and try again.`,
  );
}

console.log("PROMOTE");
await promote();
