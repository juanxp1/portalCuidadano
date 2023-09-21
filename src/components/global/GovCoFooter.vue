<template>
  <v-footer color="#3366cc">
    <v-container fluid class="flex-direction-row">
      <v-row dense no-gutters justify="space-between" align="center">
        <v-col cols="auto" class="d-flex">
          <v-icon aria-label="Colombia" size="50" right>
            $vuetify.icons.colombia
          </v-icon>
          <v-divider dark vertical class="mx-4" />
          <v-img
            :src="logo"
            :lazy-src="logo"
            alt="Gov Co"
            contain
            max-width="150"
            eager
          />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "GovCoFooter",
  computed: {
    logo() {
      return require("@/assets/img/landing/logo-header-gov.png");
    },
    href() {
      return process.env.VUE_APP_FOOTER_LINK;
    },
    name() {
      return process.env.VUE_APP_FOOTER_LINK_NAME;
    },
  },
};
</script>

<style scoped>

</style>