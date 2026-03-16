import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  datasource: {
    url: "file:" + path.resolve(__dirname, "birthdaiii.db"),
  },
});
