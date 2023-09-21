<template>
  <v-fade-transition name="fade" mode="out-in" appear>
    <router-view />
  </v-fade-transition>
</template>

<script>
// Utilities
import { call, get, sync } from "vuex-pathify";
import { genAppMetaInfo } from "@/util/metadata";
import { wait, waitForReadystate } from "@/util/helpers";
import { Api } from "./models/Api";

// Data
import metadata from "@/data/metadata";

export default {
  name: "App",

  metaInfo() {
    const prefix = this.$route.meta.title ? this.$route.meta.title + " — " : "";
    return {
      ...genAppMetaInfo(metadata),
      titleTemplate: (chunk) => `${prefix}${chunk}`,
    };
  },

  computed: {
    ...get("route", ["hash", "name"]),
    scrolling: sync("app/scrolling"),
  },

  async mounted() {
    await waitForReadystate();
    await this.init();
    await this.csfr();
    if (!this.hash) return;

    await wait(500);

    this.scrolling = true;

    try {
      await this.$vuetify.goTo(this.hash);
    } catch (e) {
      console.log(e);
    }

    this.scrolling = false;
  },

  methods: {
    init: call("app/init"),
    csfr() {
      return new Promise((resolve) => {
        this.axios
          .get(Api.END_POINTS.CSFR())
          .then(() => {
            const cookie = this.$cookies
              ? this.$cookies.get("XSRF-TOKEN")
              : null;
            if (cookie) {
              this.axios.defaults.headers.common["X-XSRF-TOKEN"] = cookie;
            }
            resolve();
          })
          .catch(() => {
            this.$router.push({ name: "Maintenance" });
            resolve();
          });
      });
    },
  },
};
</script>
