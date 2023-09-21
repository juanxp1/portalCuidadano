<template>
  <v-app>
    <dashboard-app-bar />
    <dashboard-drawer />
    <v-main>
      <app-breadcrumbs />
      <v-container class="" fluid tag="section">
        <v-responsive class="mx-auto overflow-visible">
          <v-fade-transition hide-on-leave>
            <router-view />
          </v-fade-transition>
        </v-responsive>
      </v-container>
    </v-main>
    <v-snackbar-queue @remove="$snackbar.remove" center bottom :items="items" />
    <v-pwa-snackbar />
    <dashboard-settings />
  </v-app>
</template>

<script>
import { get } from "vuex-pathify";
import DashboardAppBar from "@/layouts/dashboard/components/AppBar";
import DashboardSettings from "@/layouts/dashboard/components/Settings";
import VPwaSnackbar from "@/components/global/PwaSnackbar";
import VSnackbarQueue from "@/components/global/Snackbar";
import DashboardDrawer from "@/layouts/dashboard/components/Drawer";
import AppBreadcrumbs from "@/components/app/Breadcrumbs";
export default {
  name: "DashboardLayout",
  components: {
    AppBreadcrumbs,
    DashboardDrawer,
    VSnackbarQueue,
    VPwaSnackbar,
    DashboardSettings,
    DashboardAppBar,
  },
  computed: {
    items: get("snackbar/items"),
  },
};
</script>
