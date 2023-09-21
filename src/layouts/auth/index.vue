<template>
  <v-app v-scroll="onScroll">
    <v-fade-transition name="fade" mode="out-in" appear>
      <app-system-bar v-if="system" />
    </v-fade-transition>
    <app-bar id="app-bar-dashboard" :is-landing="false" />
    <v-main class="intro" :style="mainStyles">
      <div
        class="header-auth position-relative pb-16 pt-12 pt-sm-16 border-radius-xl min-vh-75"
      >
        <v-container>
          <v-row>
            <v-col cols="12" lg="4" md="6" class="d-flex flex-column mx-auto">
              <v-slide-y-transition name="fade" mode="out-in" appear>
                <router-view />
              </v-slide-y-transition>
            </v-col>
            <v-col cols="12" md="6">
              <div
                class="oblique position-absolute top-0 h-100 d-md-block d-none me-n8"
              >
                <div
                  class="oblique-image position-absolute fixed-top ms-auto h-100 w-100 z-index-0 ms-n16"
                  :style="styles"
                >
                  <v-overlay absolute opacity="0.5" />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
    <app-settings />
    <app-footer class="mt-12" />
    <gov-co-footer />
    <app-settings />
    <v-snackbar-queue @remove="$snackbar.remove" center bottom :items="items" />
    <v-pwa-snackbar />
    <v-sticky-toolbar />
  </v-app>
</template>

<script>
import VSnackbarQueue from "@/components/global/Snackbar";
import VPwaSnackbar from "@/components/global/PwaSnackbar";
import { get } from "vuex-pathify";
import AppBar from "@/layouts/landing/components/AppBar";
import AppSettings from "@/layouts/dashboard/components/Settings";
import AppFooter from "@/components/global/Footer";
import AppSystemBar from "@/layouts/landing/components/SystemBar";
import GovCoFooter from "@/components/global/GovCoFooter";

export default {
  name: "AuthLayout",
  components: {
    GovCoFooter,
    AppSystemBar,
    AppFooter,
    AppSettings,
    AppBar,
    VSnackbarQueue,
    VPwaSnackbar,
  },
  data: () => ({
    system: true,
  }),
  methods: {
    onScroll() {
      this.system = window.scrollY <= 50;
    },
  },
  computed: {
    items: get("snackbar/items"),
    href() {
      return process.env.VUE_APP_FOOTER_LINK;
    },
    name() {
      return process.env.VUE_APP_FOOTER_LINK_NAME;
    },
    mainStyles() {
      return {
        padding: this.$vuetify.breakpoint.mdAndUp ? "0" : undefined,
        paddingTop: this.$vuetify.breakpoint.smAndDown ? "50px" : undefined,
      };
    },
    styles() {
      return {
        backgroundImage: `url('${require("@/assets/img/landing/bg.jpeg")}')`,
        // backgroundImage: `url('${require("@/assets/img/auth/login.jpg")}')`,
      };
    },
  },
};
</script>

<style scoped lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'
.v-application
  +ltr()
    .header-auth
      padding-top: 10rem
      padding-bottom: 8rem
    .border-radius-xl
      border-radius: 1rem!important
    .min-vh-75
      min-height: 75vh!important
    .card-padding
      padding: 1.5rem
    .h-100
      height: 100%!important
    .w-100
      width: 100%!important
    .top-0
      top: 0
    .z-index-0
      z-index: 0
    .fixed-top
      position: fixed
      top: 0
  +rtl()
    .header-auth
      padding-top: 10rem
      padding-bottom: 8rem
    .border-radius-xl
      border-radius: 1rem!important
    .min-vh-75
      min-height: 75vh!important
    .card-padding
      padding: 1.5rem
    .h-100
      height: 100%!important
    .w-100
      width: 100%!important
    .top-0
      top: 0
    .z-index-0
      z-index: 0
    .fixed-top
      position: fixed
      top: 0
      width: 100%

.theme--dark
  #auth-footer
    a
      color: #FFFFFF
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
.theme--light
  #auth-footer
    a
      color: #616161
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
