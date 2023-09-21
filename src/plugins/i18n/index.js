import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "@/locales";

Vue.use(VueI18n);

export function createI18n() {
  return new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "es",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "es",
    messages,
    availableLocales: ["en", "es"],
    silentTranslationWarn: true,
    silentFallbackWarn: true,
  });
}
