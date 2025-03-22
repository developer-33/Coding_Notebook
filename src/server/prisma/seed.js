const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: "password123",
      profile: {
        create: {
          bio: "Admin of Coding Notebook",
          avatar: "https://via.placeholder.com/150",
        },
      },
    },
  });

  const tag1 = await prisma.tag.create({ data: { name: "JavaScript" } });
  const tag2 = await prisma.tag.create({ data: { name: "Python" } });

  await prisma.snippet.create({
    data: {
      title: "Hello World in JS",
      code: "console.log('Hello World');",
      language: "JavaScript",
      description: "A simple JavaScript example.",
      authorId: user.id,
      tags: { connect: [{ id: tag1.id }] },
    },
  });

  await prisma.snippet.create({
    data: {
      title: "Hello World in Python",
      code: "print('Hello World')",
      language: "Python",
      description: "A simple Python example.",
      authorId: user.id,
      tags: { connect: [{ id: tag2.id }] },
    },
  });
}

main()
  .then(() => {
    console.log("Database seeded successfully ✅");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    prisma.$disconnect();
  });
