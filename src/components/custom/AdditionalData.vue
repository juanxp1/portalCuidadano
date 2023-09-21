<template>
  <v-row dense>
    <v-skeleton-loader
      :loading="loading"
      type="list-item-avatar-three-line@6"
      width="100%"
    >
      <v-col v-for="(key, i) in data" :key="i" cols="12" md="12" sm="12">
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon v-text="`mdi-${icon}`"></v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="key"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-skeleton-loader>
  </v-row>
</template>

<script>
export default {
  name: "AdditionalData",
  props: {
    data: {
      type: [Array, Object],
      default: () => ({}),
    },
    icon: {
      type: String,
      default: "text",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
