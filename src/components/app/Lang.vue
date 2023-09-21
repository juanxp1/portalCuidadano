<script>
// Extensions
import SettingsGroup from "./Group";

// Utilities
import { sync } from "vuex-pathify";
export default {
  name: "AppLang",
  extends: SettingsGroup,
  data: () => ({ path: "sidebar.language" }),
  computed: {
    lang: sync("user/lang"),
    items() {
      return [
        {
          icon: "$vuetify.icons.es",
          text: "ES",
        },
        {
          icon: "$vuetify.icons.en",
          text: "EN",
        },
      ];
    },
    internalValue: {
      get() {
        return this.lang ? this.lang : "es";
      },
      set(val) {
        const l = (val || "es").toString().trim().toLowerCase();
        this.$moment.locale(l);
        this.$i18n.locale = l;
        this.lang = l;
      },
    },
  },
};
</script>
