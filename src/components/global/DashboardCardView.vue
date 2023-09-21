<template>
  <v-container fluid tag="section">
    <v-row>
      <slot name="beforeCard" />
      <v-col cols="12">
        <material-card color="primary" :icon="cardIcon">
          <template #toolbar>
            <app-card-toolbar
              :title-i18n="cardTitleI18n"
              :title="cardTitle"
              :loading="loading"
              :requested-at="requestedAt"
              :items="cardToolbarActions"
            />
          </template>
          <slot />
        </material-card>
      </v-col>
      <slot name="afterCard" />
    </v-row>
    <slot name="afterRow" />
  </v-container>
</template>

<script>
export default {
  name: "DashboardCardView",
  props: {
    cardIcon: {
      type: String,
      default: "mdi-card-text-outline",
    },
    cardTitleI18n: {
      type: String,
      default: undefined,
    },
    cardTitle: {
      type: String,
      default: undefined,
    },
    cardToolbarActions: {
      type: [Array, Object],
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    requestedAt: {
      type: String,
      default: undefined,
    },
  },
};
</script>
