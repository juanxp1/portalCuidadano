/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import { loadFonts } from "./webfontloader";
import { registerComponents } from "./app";
import { useAxios } from "./vue-axios";
import { useMeta } from "./vue-meta";
import { useVuetify } from "./vuetify";
import { useCookies } from "./vue-cookies";
import { useVeeValidate } from "./vee-validate";
import { useSnackbarQueue } from "./snackbar";
import { useMoment } from "@/plugins/moment";
import { useAuth } from "@/plugins/auth";
import { useBus } from "@/plugins/bus";
import { useLodash } from "@/plugins/lodash";
import { tawkToPlugin } from "@/plugins/tawk.to";
import { useParticles } from "@/plugins/particles";
import { useTour } from "@/plugins/vue-tour";

export function registerPlugins(app, i18n, store, router) {
  registerComponents(app);
  loadFonts(app);
  useBus(app);
  useLodash(app);
  useVeeValidate(app, i18n);
  useMeta(app);
  useCookies(app);
  useVuetify(app);
  useSnackbarQueue(app);
  useMoment(app);
  useAuth(app, store);
  useAxios(app, router, store, i18n);
  tawkToPlugin(app);
  useParticles(app);
  useTour(app);
}
