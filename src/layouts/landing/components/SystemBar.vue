<template>
  <v-system-bar dark fixed app color="#3366cc" height="30">
    <v-container fluid class="flex-direction-row">
      <v-row dense justify="space-between" no-gutters align="center">
        <v-col cols="auto" class="d-flex">
          <v-img
            :src="logo"
            :lazy-src="logo"
            alt="Gov Co"
            max-height="20"
            contain
          />
        </v-col>
        <v-col cols="auto" class="d-flex">
          <app-menu
            menu-icon="mdi-translate"
            menu-icon-color="white"
            tooltip-text="Idioma"
            :items="items"
          >
          </app-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-system-bar>
</template>

<script>
import AppMenu from "@/components/app/Menu";
export default {
  name: "AppSystemBar",
  components: { AppMenu },
  computed: {
    logo() {
      return require("@/assets/img/landing/logo-header-gov.png");
    },
    items() {
      const that = this;
      return [
        {
          icon: "$vuetify.icons.es",
          text: "ES",
          action: () => {
            that.$moment.locale("es");
            that.$i18n.locale = "es";
          },
        },
        {
          icon: "$vuetify.icons.en",
          text: "EN",
          action: () => {
            that.$moment.locale("en");
            that.$i18n.locale = "en";
          },
        },
      ];
    },
  },
};
</script>

<style scoped></style>
