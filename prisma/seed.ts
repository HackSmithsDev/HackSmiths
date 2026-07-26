import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const DEFAULT_CONFIGS = [
  // Operational & Recruitment
  { key: 'RECRUITMENT_OPEN', value: 'true' },
  { key: 'CURRENT_COHORT_NAME', value: 'Season 2026-27' },
  { key: 'MAX_APPLICATIONS_CAP', value: '500' },
  { key: 'SUPPORT_EMAIL', value: 'support@hacksmiths.dev' },

  // Security & Authentication
  { key: 'OTP_EXPIRATION_SECONDS', value: '300' },
  { key: 'JWT_EXPIRY_DURATION', value: '7d' },
  { key: 'RATE_LIMIT_PER_MINUTE', value: '10' },

  // SMTP & Mailers
  { key: 'SMTP_SENDER_IDENTITY', value: 'HackSmiths Core <noreply@hacksmiths.dev>' },
  { key: 'SMTP_REPLY_TO', value: 'contact@hacksmiths.dev' },
  { key: 'ENABLE_APPLICATION_RECEIVED_EMAIL', value: 'true' },
  { key: 'ENABLE_STATUS_CHANGE_EMAILS', value: 'true' },

  // Social & Community Links
  { key: 'LINK_GITHUB_ORG', value: 'https://github.com/hacksmiths' },
  { key: 'LINK_DISCORD_INVITE', value: 'https://discord.gg/hacksmiths' },
];

async function main() {
  console.log('🌱 Seeding default AdminConfig parameters...');

  for (const config of DEFAULT_CONFIGS) {
    await prisma.adminConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log('✅ AdminConfig seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });