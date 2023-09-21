<template>
  <v-card flat>
    <v-card-title>
      <app-md>{{ text.title }}</app-md>
      <slot name="header"></slot>
    </v-card-title>
    <v-card-text style="height: 300px; overflow-y: scroll">
      <v-divider class="my-2" />
      <v-skeleton-loader :loading="loading" type="article">
        <app-md v-text="text.text" />
      </v-skeleton-loader>
    </v-card-text>
    <v-card-actions class="text-right">
      <slot></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Privacy } from "@/models/services/portal/Privacy";

export default {
  name: "TermsAndConditions",
  data: () => ({
    loading: false,
    privacy: new Privacy(),
    text: {
      title: null,
      text: null,
    },
  }),
  created() {
    this.onTerms();
  },
  methods: {
    onTerms() {
      this.loading = true;
      this.privacy
        .index()
        .then((response) => {
          this.text = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>

</style>