<template>
  <v-snackbar
    :value="snackbar"
    bottom
    class="v-snackbar--pwa"
    left
    timeout="-1"
    vertical
  >
    <app-md class="mb-n4" tag="p">
      {{ $t("pwa.new-content-available") }}
    </app-md>
    <template #action="{ attrs }">
      <app-btn
        path="pwa.ignore"
        text
        class="mx-2"
        v-bind="attrs"
        @click="ignore"
      >
      </app-btn>
      <app-btn
        path="pwa.refresh"
        color="primary"
        v-bind="attrs"
        @click="update"
      >
      </app-btn>
    </template>
  </v-snackbar>
</template>

<script>
// Utilities
import { wait } from "@/util/helpers";
import { call, sync } from "vuex-pathify";

export default {
  name: "VPwaSnackbar",
  computed: {
    ...sync("user", ["pwaRefresh"]),
    ...sync("pwa", ["snackbar", "sw"]),
  },

  watch: {
    async snackbar(val) {
      // Snackbar is closing, unregister with application
      if (!val) {
        this.$vuetify.application.unregister(this._uid, "snackbar");

        return;
      }

      await this.$nextTick();

      const wrapper = this.$el.querySelector(
        ".v-snackbar--pwa > .v-snack__wrapper"
      );

      // Register the snackbar element's height
      this.$vuetify.application.register(
        this._uid,
        "snackbar",
        wrapper.clientHeight
      );
    },
    "sw.update": {
      immediate: true,
      async handler(val) {
        if (!val || !this.pwaRefresh) return;

        await wait(5000);

        this.snackbar = true;
      },
    },
  },

  created() {
    // Add snackbar property to application service
    this.$set(this.$vuetify.application, "snackbar", 0);
    this.$set(this.$vuetify.application.application, "snackbar", {});
  },

  methods: {
    update: call("pwa/update"),
    ignore() {
      this.pwaRefresh = false;
      this.snackbar = false;
    },
  },
};
</script>

<style lang="sass">
.v-snack.v-snackbar--pwa
  p
    line-height: normal // v-snackbar__content sets this to 1.25rem 🤔
    margin-bottom: 0 !important
</style>
