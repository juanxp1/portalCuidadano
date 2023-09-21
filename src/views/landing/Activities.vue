<template>
  <details-page custom-card :title="$t('menu.activities')">
    <material-card
      icon-avatar="mdi-pine-tree"
      class="main main-raised elevation-24 mb-12"
    >
      <app-breadcrumbs />
      <recreation-calendar></recreation-calendar>
    </material-card>
  </details-page>
</template>

<script>
export default {
  name: "RecreationActivities",
  metaInfo() {
    return {
      title: `${this.$t("menu.activities")} | ${this.$t("title")}`,
    };
  },
};
</script>
