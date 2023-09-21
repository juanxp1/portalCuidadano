<script>
// Extensions
import SettingsGroup from "./Group";

// Utilities
import { sync } from "vuex-pathify";

export default {
  name: "SettingsRtl",

  extends: SettingsGroup,

  data: () => ({ path: "sidebar.direction" }),

  computed: {
    rtl: sync("user/rtl"),
    items() {
      return [
        {
          text: this.$t("sidebar.ltr"),
          icon: "mdi-format-text-direction-l-to-r",
        },
        {
          text: this.$t("sidebar.rtl"),
          icon: "mdi-format-text-direction-r-tol-",
        },
      ];
    },
    internalValue: {
      get() {
        return this.rtl ? "rtl" : "ltr";
      },
      set(val) {
        val = val === "rtl";

        this.rtl = val;
        this.$vuetify.rtl = val;
      },
    },
  },
};
</script>
