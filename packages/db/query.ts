import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const lastGen = await prisma.generation.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(lastGen?.generatedCode));
}
main();
