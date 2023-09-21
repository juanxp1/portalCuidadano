// Imports
const { IN_BROWSER, IS_PROD } = require("./util/globals");
const log = "[sw:IDRD]";

if (IN_BROWSER && IS_PROD && navigator.serviceWorker) {
  const { register } = require("register-service-worker");

  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        log +
          " App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },

    registered(registration) {
      console.log(log + " Service worker has been registered.");

      // Routinely check for app updates by testing for a new service worker.
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60); // hourly checks
    },

    cached() {
      console.log(log + " Content has been cached for offline use.");
    },

    updatefound() {
      console.log(log + " New content is downloading...");
    },

    updated(registration) {
      console.log(log + " New content is available; please refresh.");

      const event = new CustomEvent("swupdatefound", { detail: registration });

      document.dispatchEvent(event);
    },

    offline() {
      console.log(
        log + " No internet connection found. App is running in offline mode."
      );
    },

    error(error) {
      console.error(log + " Error during service worker registration:", error);
    },
  });

  let refreshing;

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (refreshing) return;

    window.location.reload();

    refreshing = true;
  });
}
