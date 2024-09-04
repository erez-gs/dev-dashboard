import react from "@vitejs/plugin-react";
import { UserConfig, ConfigEnv } from "vite";
import { join } from "path";

const mainRoot = join(__dirname, "./");
const srcRoot = join(__dirname, "src");

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === "serve") {
    return {
      root: srcRoot,
      base: "/",
      plugins: [react()],
      resolve: {
        alias: {
          "/@": srcRoot,
        },
      },
      build: {
        outDir: join(mainRoot, "/main/out"),
        emptyOutDir: true,
        rollupOptions: {},
      },
      server: {
        port: process.env.PORT === undefined ? 3008 : +process.env.PORT,
      },
      optimizeDeps: {
        exclude: ["path"],
      },
    };
  }
  // PROD
  return {
    root: srcRoot,
    base: "./",
    plugins: [react()],
    resolve: {
      alias: {
        "/@": srcRoot,
      },
    },
    build: {
      outDir: join(mainRoot, "/main/out"),
      emptyOutDir: true,
      rollupOptions: {},
    },
    server: {
      port: process.env.PORT === undefined ? 3008 : +process.env.PORT,
    },
    optimizeDeps: {
      exclude: ["path"],
    },
  };
};
