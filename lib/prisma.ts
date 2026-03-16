import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: "file:" + path.resolve(process.cwd(), "birthdaiii.db"),
  });
  return new PrismaClient({ adapter });
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
