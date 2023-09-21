<template>
  <v-dialog
    v-model="model"
    :fullscreen="fullscreen || $vuetify.breakpoint.smAndDown"
    :max-width="$vuetify.breakpoint.smAndDown ? undefined : maxWidth"
    transition="dialog-bottom-transition"
    scrollable
    v-bind="$attrs"
    @click:outside="close"
  >
    <template #activator="props">
      <slot name="action" :props="props"></slot>
    </template>
    <v-card>
      <v-toolbar dark :color="color" max-height="60">
        <v-toolbar-title v-text="header" />
        <v-spacer />
        <app-btn
          path="buttons.Close"
          icon
          icon-text="mdi-close"
          dark
          @click="close"
        />
      </v-toolbar>
      <v-card-text class="mt-4">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VFormDialog",
  props: {
    fullscreen: Boolean,
    color: {
      type: String,
      default: "primary",
    },
    maxWidth: {
      type: [String, Number],
      default: 600,
    },
    useI18n: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "buttons.Create",
    },
  },
  data: () => ({
    model: false,
    resolve: null,
    reject: null,
  }),
  computed: {
    header() {
      return this.useI18n ? this.$t(this.title) : this.title;
    },
  },
  methods: {
    open() {
      this.model = true;
      return Promise.resolve(true);
    },
    close() {
      this.model = false;
      this.$emit("close:dialog");
    },
  },
};
</script>
