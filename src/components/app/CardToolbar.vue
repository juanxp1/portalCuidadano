<template>
  <v-toolbar dense flat color="transparent">
    <v-toolbar-title class="text-h5 font-weight-light">
      <i18n v-if="titleI18n" :path="titleI18n" />
      <span v-if="title" v-text="title" />
    </v-toolbar-title>
    <v-spacer />
    <app-time-ago
      :loading="loading"
      :prefix="prefix"
      classes="caption grey--text font-weight-light hidden-sm-and-down"
      :date-time="requestedAt"
    />
    <app-menu v-if="items.length" :id="menuId" :items="items" />
    <slot />
  </v-toolbar>
</template>

<script>
export default {
  name: "AppCardToolbar",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    menuId: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
    titleI18n: {
      type: String,
      default: undefined,
    },
    requestedAt: {
      type: String,
      default: undefined,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    prefix() {
      return this.$t("buttons.Updated");
    },
  },
};
</script>
