// Packages
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import InstantSearch from "vue-instantsearch";

// Bootstrap
import { registerPlugins } from "./plugins";
import { createVuetify } from "@/plugins/vuetify";
import { createStore } from "@/store";
import { createRouter } from "@/router";
import { createI18n } from "@/plugins/i18n";
import { sync } from "vuex-router-sync";
import { Icon } from "leaflet";
import NProgress from "@/plugins/progress";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Service Worker
import "./registerServiceWorker";

// Application
import App from "./App.vue";

// Styles
import "@/assets/sass/main.sass";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "roboto-slab-fontface-kit/roboto-slab.css";
import "@mdi/font/css/materialdesignicons.css";
import "leaflet/dist/leaflet.css";

// Globals
import { IS_PROD } from "@/util/globals";

Vue.config.productionTip = false;
Vue.config.performance = !IS_PROD;

Vue.use(InstantSearch);
Vue.use(NProgress);

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
// eslint-disable-next-line no-unused-vars
export async function createApp({ start = () => {} } = {}, ssrContext) {
  // create store and router instances
  const store = createStore();
  const i18n = createI18n();
  const vuetify = createVuetify(store, i18n);
  const router = createRouter(vuetify, store, i18n);
  registerPlugins(Vue, i18n, store, router);
  const nprogress = new NProgress();
  store.dispatch("app/setVersion", Vuetify.version);

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    nprogress,
    router,
    store,
    i18n,
    vuetify,
    render: (h) => h(App),
  });

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  const entry = { app, router, store };

  await start(entry);

  return entry;
}
