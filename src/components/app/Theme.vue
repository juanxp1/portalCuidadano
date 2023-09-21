<script>
// Extensions
import SettingsGroup from "./Group";

// Utilities
import { sync } from "vuex-pathify";

// Globals
import { IN_BROWSER } from "@/util/globals";

export default {
  name: "SettingsTheme",

  extends: SettingsGroup,

  data: () => ({
    path: "sidebar.theme",
    timer: null,
  }),

  computed: {
    ...sync("user", ["theme@dark", "theme@mixed", "theme@system"]),
    items() {
      const that = this;
      return [
        {
          text: "light",
          icon: "mdi-white-balance-sunny",
          cb: () => that.setTheme(),
        },
        {
          text: "dark",
          icon: "mdi-weather-night",
          cb: () => that.setTheme(true),
        },
        {
          text: "system",
          icon: "mdi-desktop-tower-monitor",
          cb: () => that.setSystemTheme(),
        },
        {
          text: "mixed",
          icon: "mdi-theme-light-dark",
          cb: () => that.autoTheme(),
        },
      ];
    },
    internalValue: {
      get() {
        if (this.mixed) return "mixed";
        if (this.system) return "system";

        return this.dark ? "dark" : "light";
      },
      set(val) {
        const set = this.items.find((item) => item.text === val);

        set.cb();
      },
    },
  },

  watch: {
    "$vuetify.theme.dark"(val) {
      if (this.dark === val) return;

      this.dark = val;
    },
    dark(val) {
      if (this.$vuetify.theme.dark === val) return;

      this.$vuetify.theme.dark = val;
    },
  },

  created() {
    const matchMedia = this.getMatchMedia();
    if (!matchMedia) return;

    if (this.internalValue === "system") {
      this.clearTimeOut();
      this.dark = matchMedia.matches;
    }

    if (this.internalValue === "mixed") {
      this.autoTheme();
    }

    matchMedia.onchange = ({ matches }) => {
      if (this.system) {
        this.clearTimeOut();
        this.dark = matches;
      }
    };
  },

  methods: {
    getMatchMedia() {
      return IN_BROWSER && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : false;
    },
    setTheme(dark = false, mixed = false, system = false) {
      this.dark = dark;
      this.mixed = mixed;
      this.system = system;
    },
    setSystemTheme() {
      const matchMedia = this.getMatchMedia();
      if (!matchMedia) return;
      this.clearTimeOut();
      this.setTheme(matchMedia.matches, this.mixed, true);
    },
    autoTheme() {
      this.setTheme(false, true);
      const startAt = this.normalizeTime("06:00");
      const endAt = this.normalizeTime("18:00");
      const now = new Date().getTime();
      const result =
        (endAt < now && now > startAt) || (startAt > now && now < endAt);
      if (this.internalValue === "mixed") {
        this.dark = result;
        this.clearTimeOut();
        this.timer = setTimeout(this.autoTheme, 1000 * 60);
      } else {
        this.clearTimeOut();
      }
    },
    normalizeTime(time) {
      const date = new Date();
      const normalized = time.split(":");
      return date.setHours(normalized[0], normalized[1], 0, 0);
    },
    clearTimeOut() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },

  beforeDestroy() {
    this.clearTimeOut();
  },
};
</script>
