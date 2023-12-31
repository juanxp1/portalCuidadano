// Imports
import { precacheAndRoute, matchPrecache } from "workbox-precaching";
import {
  registerRoute,
  setDefaultHandler,
  setCatchHandler,
} from "workbox-routing";
import { NetworkOnly, CacheFirst } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST);

const cacheFirst = new CacheFirst();
const networkOnly = new NetworkOnly();

registerRoute(
  ({ url, request }) =>
    url.origin === self.location.origin &&
    request.destination !== "document" &&
    url.pathname.startsWith("/portal-ciudadano/"),
  cacheFirst
);

setDefaultHandler(networkOnly);

setCatchHandler(async ({ url, request }) => {
  if (
    url.origin === self.location.origin &&
    request.destination === "document"
  ) {
    return matchPrecache("/_fallback.html");
  }

  return Response.error();
});

self.addEventListener("message", (event) => {
  if (event.data === "sw:update") self.skipWaiting();
});
