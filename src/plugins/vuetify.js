/**
 * plugins/vuetify.js
 *
 * Vuetify documentation: https://vuetifyjs.com/
 */

// Imports
import Vuetify from "vuetify/lib/framework";
// Icons
import Bogota from "@/components/icons/Bogota";
import IDRD from "@/components/icons/IDRD";
import IDRDAnimated from "@/components/icons/IDRDAnimated";
import Google from "@/components/icons/Google";
import Facebook from "@/components/icons/Facebook";
import Es from "@/components/icons/Es";
import En from "@/components/icons/En";
import Pse from "@/components/icons/Pse";
import PseFull from "@/components/icons/PseFull";
import Colombia from "@/components/icons/Colombia";
import Actions from "@/components/icons/Actions";
import GovCo from "@/components/icons/GovCo";
import Android from "@/components/icons/Android";
import Ios from "@/components/icons/Ios";
import IDRDLogo from "@/components/icons/IDRDLogo";
import IDRDLogoColor from "@/components/icons/IDRDLogoColor";
import DaviPlata from "@/components/icons/DaviPlata";

// Globals
import { IN_BROWSER } from "@/util/globals";

const theme = {
  primary: "#594d95",
  secondary: "#704691",
  tertiary: "#D7D460",
  accent: "#D7C060",
  success: "#4caf50",
  info: "#00cae3",
  warning: "#fb8c00",
  error: "#FF5252",
};

export function useVuetify(app) {
  app.use(Vuetify);
}

export function createVuetify(store, i18n) {
  const vuetify = new Vuetify({
    options: {
      customProperties: true,
    },
    icons: {
      iconfont: "mdi",
      values: {
        idrd_logo_color: {
          component: IDRDLogoColor,
        },
        idrd_logo: {
          component: IDRDLogo,
        },
        idrd: {
          component: IDRD,
        },
        idrd_animated: {
          component: IDRDAnimated,
        },
        bogota: {
          component: Bogota,
        },
        es: {
          component: Es,
        },
        en: {
          component: En,
        },
        pse: {
          component: Pse,
        },
        pse_full: {
          component: PseFull,
        },
        daviplata: {
          component: DaviPlata,
        },
        colombia: {
          component: Colombia,
        },
        google: {
          component: Google,
        },
        facebook: {
          component: Facebook,
        },
        actions: {
          component: Actions,
        },
        android: {
          component: Android,
        },
        ios: {
          component: Ios,
        },
        gov_co: {
          component: GovCo,
        },
      },
    },
    theme: {
      dark: store.state.user.theme.dark,
      options: {
        minifyTheme: IN_BROWSER
          ? require("minify-css-string").default
          : undefined,
        variations: false,
      },
      themes: {
        light: theme,
        dark: theme,
      },
    },
    lang: {
      t: (key, ...params) => i18n.t(key, params),
    },
    rtl: store.state.user.rtl,
  });

  if (IN_BROWSER) {
    store.watch(
      (state) => state.user.theme.dark,
      (val) => {
        vuetify.framework.theme.dark = val;
      }
    );
  }

  return vuetify;
}
