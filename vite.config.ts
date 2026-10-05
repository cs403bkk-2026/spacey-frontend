import dns from "node:dns";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type ProxyOptions } from "vite";

import { appBasename } from "./src/lib/app-path.ts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const publicResolver = new dns.Resolver();
publicResolver.setServers(["8.8.8.8"]);

// The system resolver returns NXDOMAIN for spacey.cs403bkk26.space. Node's
// HTTPS agent asks for every address (`options.all`), so the callback must
// return `{ address, family }[]` in that case.
const lookup: dns.LookupFunction = (hostname, options, callback) => {
  publicResolver.resolve4(hostname, (err, addresses) => {
    if (err || !addresses?.[0]) {
      callback(err, options.all ? [] : "");
      return;
    }

    if (options.all) {
      callback(
        null,
        addresses.map((address) => ({ address, family: 4 })),
      );
      return;
    }

    callback(null, addresses[0], 4);
  });
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = (env.VITE_API_BASE_URL || "https://spacey.cs403bkk26.space").replace(/\/$/, "");
  const apiProxy: ProxyOptions = {
    target: apiTarget,
    changeOrigin: true,
    agent: new https.Agent({ lookup }),
  };

  return {
    base: `${appBasename}/`,
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
      },
    },
    server: {
      proxy: {
        "/spaces": apiProxy,
        "/bookings": apiProxy,
        "/login": apiProxy,
        "/register": apiProxy,
        "/logout": apiProxy,
        "/metrics": apiProxy,
        "/health": apiProxy,
        "/members": apiProxy,
      },
    },
  };
});
