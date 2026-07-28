import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../src/generated/prisma";
import { seedAdminUsers } from "./admin_fetch";
import { seedAdminSettings } from "./admin_settings";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting database seeding pipeline...\n");

  await seedAdminSettings(prisma);
  await seedAdminUsers(prisma);

  console.log("\n🎉 All database seeds executed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });