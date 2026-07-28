import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "../../src/generated/prisma";

const ADMIN_USERS = [
  {
    email: process.env.ADMIN_EMAIL || "admin@hacksmiths.dev",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
    name: process.env.ADMIN_NAME || "HackSmiths Core Admin",
  },
  {
    email: "mohdaatifkhan2801@gmail.com",
    password: "A@tif2801",
    name: "Mohd Aatif Khan",
  },
  {
    email: "singhantariksh212@gmail.com",
    password: "Singh@212",
    name: "Antriksh Singh",
  },
];

export async function seedAdminUsers(prisma: PrismaClient) {
  console.log(`🌱 Seeding 3 OrganizationUser (Admin) accounts...`);

  for (const adminData of ADMIN_USERS) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const admin = await prisma.organizationUser.upsert({
      where: { email: adminData.email },
      update: {
        role: Role.ADMIN,
        password: hashedPassword,
        name: adminData.name,
      },
      create: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: Role.ADMIN,
      },
    });

    console.log(`   ✅ Admin: ${admin.email} (ID: ${admin.id})`);
  }
}