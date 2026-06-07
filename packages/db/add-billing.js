import { PrismaClient } from './generated/prisma/index.js';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst();
  if (user) {
    await prisma.billing.create({
      data: {
        userId: user.id,
        status: "success",
        plan: "pro",
        amount: 1000
      }
    });
    console.log("Added successful billing record for user:", user.email);
  } else {
    console.log("No users found in database.");
  }
}
main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
