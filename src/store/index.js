// Vue
import Vue from "vue";
import Vuex from "vuex";
import Cookies from "vue-cookies";

// Utilities
import { v4 as uuidv4 } from "uuid";
import Crypto from "crypto-js";
import pathify from "@/plugins/vuex-pathify";
import localForage from "localforage";
import VuexPersist from "vuex-persist";
import syncStateStorage from "vuex-state-storage-sync";

// Modules
import * as modules from "./modules";
const storageKey = process.env.VUE_APP_STORAGE_STATE;

Vue.use(Vuex);
Vue.use(Cookies);

export function createStore() {
  const debug = process.env.NODE_ENV !== "production";
  const cookieName = "citizen_application_id";
  // const encryptionToken = Vue.$cookies.get(cookieName) || uuidv4();
  const encryptionToken = process.env.VUE_APP_APPLICATION_KEY;
  const storageLocal = {
    getItem: () => {
      // Get the store from local storage.
      const store = window.localStorage.getItem(storageKey);
      if (store) {
        try {
          // Decrypt the store retrieved from local storage
          // using our encryption token stored in cookies.
          if (debug) {
            return JSON.parse(store);
          } else {
            const bytes = Crypto.AES.decrypt(store, encryptionToken);
            return JSON.parse(bytes.toString(Crypto.enc.Utf8));
          }
        } catch (e) {
          // The store will be reset if decryption fails.
          window.localStorage.removeItem(storageKey);
        }
      }
      return null;
    },
    setItem: (key, value) => {
      // Encrypt the store using our encryption token stored in cookies.
      let store = value;
      if (!debug) {
        store = Crypto.AES.encrypt(value, encryptionToken).toString();
      }
      // Save the encrypted store in local storage.
      return window.localStorage.setItem(storageKey, store);
    },
    removeItem: () => window.localStorage.removeItem(storageKey),
  };
  const stateKey = process.env.VUE_APP_STORAGE_STATE || "app_storage";
  const vuexPersistEmitter = () => {
    return (store) => {
      store.subscribe((mutation) => {
        if (mutation.type === "RESTORE_MUTATION") {
          store._vm.$root.$emit("storageReady");
        }
      });
    };
  };

  localForage.config({
    name: stateKey,
    version: 1.0,
    storeName: stateKey,
    description: "Store attributes in the browser for offline use.",
  });

  // Store data on IndexDB
  const vuexLocalStorage = new VuexPersist({
    strictMode: true,
    asyncStorage: true,
    key: stateKey,
    storage: localForage,
    modules: ["route", "selects", "search", "api"],
  });

  // Store Data on Local Storage
  const vuexLocalStorageSetting = new VuexPersist({
    strictMode: true,
    asyncStorage: false,
    key: stateKey,
    storage: storageLocal,
    modules: ["app", "user", "pwa", "auth", "snackbar"],
  });

  const store = new Vuex.Store({
    mutations: {
      RESTORE_MUTATION: vuexLocalStorage.RESTORE_MUTATION, // this mutation **MUST** be named "RESTORE_MUTATION"
    },
    modules,
    plugins: [
      pathify.plugin,
      syncStateStorage({
        storage: window.localStorage || window.sessionStorage || localForage, // Storage Types
        key: stateKey, // Storage Key Name
        path: [
          "app",
          "user",
          "auth",
          "pwa",
          "snackbar",
          "selects",
          "search",
          "api",
        ], // State data to be synchronized to storage
      }),
      vuexPersistEmitter(),
      vuexLocalStorage.plugin,
      vuexLocalStorageSetting.plugin,
    ],
    strict: debug,
  });

  store.subscribe((mutation) => {
    if (!mutation.type.startsWith("user/")) return;

    store.dispatch("user/update", mutation);
  });

  return store;
}

export const ROOT_DISPATCH = Object.freeze({ root: true });
