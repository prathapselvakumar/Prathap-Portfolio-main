import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: (self.__SW_MANIFEST ?? []).filter(
    (entry) => !String(typeof entry === 'string' ? entry : entry.url).includes('Leo-rover')
  ),
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    // Add custom runtime caching for AI models (ONNX, WASM, YOLO weights, etc.)
    {
      matcher: ({ url }) => url.pathname.match(/\.(onnx|wasm|bin|weights|pb)$/i),
      handler: "CacheFirst",
      options: {
        cacheName: "ai-models-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
