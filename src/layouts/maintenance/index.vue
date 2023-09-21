<template>
  <v-app v-scroll="onScroll">
    <v-fade-transition name="fade" mode="out-in" appear>
      <app-system-bar v-if="system" />
    </v-fade-transition>
    <router-view></router-view>
    <app-settings />
    <gov-co-footer />
    <v-snackbar-queue @remove="$snackbar.remove" center bottom :items="items" />
    <v-pwa-snackbar />
  </v-app>
</template>

<script>
import { get } from "vuex-pathify";
import AppSettings from "@/layouts/dashboard/components/Settings";
import AppFooter from "@/components/global/Footer";
import GovCoFooter from "@/components/global/GovCoFooter";
import VSnackbarQueue from "@/components/global/Snackbar";
import VPwaSnackbar from "@/components/global/PwaSnackbar";
import AppSystemBar from "@/layouts/landing/components/SystemBar";
import AppBar from "@/layouts/landing/components/AppBar";
export default {
  name: "MaintenanceLayout",
  components: {
    AppSystemBar,
    VPwaSnackbar,
    VSnackbarQueue,
    GovCoFooter,
    AppSettings,
  },
  computed: {
    items: get("snackbar/items"),
  },
  data: () => ({
    system: true,
  }),
  methods: {
    onScroll() {
      this.system = window.scrollY <= 50;
    },
  },
};
</script>

<style scoped></style>
