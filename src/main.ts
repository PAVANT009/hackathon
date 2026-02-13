import { prisma } from "./db";

async function main() {
  console.log("Performing CRUD operations...");

  const newUser = await prisma.crudUser.create({
    data: { name: "Alice", email: `alice-${Date.now()}@example.com` },
  });
  console.log("CREATE: New user created:", newUser);

  const foundUser = await prisma.crudUser.findUnique({
    where: { id: newUser.id },
  });
  console.log("READ: Found user:", foundUser);

  const updatedUser = await prisma.crudUser.update({
    where: { id: newUser.id },
    data: { name: "Alice Smith" },
  });
  console.log("UPDATE: User updated:", updatedUser);

  await prisma.crudUser.delete({ where: { id: newUser.id } });
  console.log("DELETE: User deleted.");

  console.log("CRUD operations completed successfully.");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
