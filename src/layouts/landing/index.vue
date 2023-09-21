<template>
  <v-app v-scroll="onScroll">
    <v-fade-transition name="fade" mode="out-in" appear>
      <app-system-bar v-if="system" />
    </v-fade-transition>
    <app-bar />
    <app-parallax v-if="showParallax">
      <v-video-bg
        v-if="with_video && $vuetify.breakpoint.mdAndUp"
        :img="bg"
        :sources="[video]"
      >
        <v-container class="fill-height white--text">
          <v-row dense class="text-center">
            <v-col cols="12" sm="12" md="8" class="mx-auto">
              <h1 class="display-serif-4 font-weight-black mt-12">
                {{ $t("subtitle") }}
              </h1>
              <v-icon size="120">$vuetify.icons.values.idrd_logo</v-icon>
            </v-col>
            <v-col class="mx-auto hidden-sm-and-down" cols="12" sm="12" md="9">
              <v-card id="v-step-desktop-0" flat>
                <v-card-text>
                  <!--
                  <app-search-bar
                    :show.sync="fab"
                    @onCloseSearchBar="onCloseSearchBar"
                  />
                  -->
                  <app-search />
                </v-card-text>
              </v-card>
              <v-btn
                aria-label="Bajar"
                icon
                dark
                outlined
                class="mt-5"
                @click="$vuetify.goTo('#seivices-card')"
              >
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-video-bg>
      <app-jumbotron v-else :src="bg" opacity="0.3">
        <v-container class="fill-height justify-center" tag="section">
          <v-row align="center" class="text-center" justify="center">
            <v-col class="mb-10">
              <h1 :class="classes">
                {{ $t("subtitle") }}
              </h1>
              <h3 :class="classesSubHeading">
                {{ subtitle }}
              </h3>
              <v-icon size="120">$vuetify.icons.values.idrd_logo</v-icon>
            </v-col>
            <v-col class="mx-auto hidden-sm-and-down" cols="12" sm="12" md="8">
              <v-card id="v-step-desktop-0" flat>
                <v-card-text>
                  <!--
                  <app-search-bar
                    :show.sync="fab"
                    @onCloseSearchBar="onCloseSearchBar"
                  />
                  -->
                  <app-search />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </app-jumbotron>
    </app-parallax>
    <router-view />
    <app-footer />
    <gov-co-footer />
    <app-settings />
    <mobile-menu v-if="$vuetify.breakpoint.smAndDown" />
    <v-snackbar-queue @remove="$snackbar.remove" center bottom :items="items" />
    <v-pwa-snackbar />
    <v-sticky-toolbar />
    <v-dialog v-model="fab" persistent fullscreen>
      <template #activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            :aria-label="$t('input.search')"
            id="v-step-mobile-0"
            class="hidden-md-and-up"
            color="primary"
            dark
            fixed
            bottom
            right
            fab
            v-on="on"
            v-bind="attrs"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <v-sheet class="text-center h-100" color="rgba(0, 0, 0, 0.4)">
        <v-card flat class="ma-1">
          <v-card-title>
            {{
              $vuetify.breakpoint.smAndDown
                ? $t("input.search")
                : $t("input.more_options")
            }}
            <v-spacer></v-spacer>
            <v-btn icon @click="fab = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <app-search />
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-dialog>
  </v-app>
</template>

<script>
import VPwaSnackbar from "@/components/global/PwaSnackbar";
import VSnackbarQueue from "@/components/global/Snackbar";
import AppBar from "./components/AppBar";
import { get } from "vuex-pathify";
import AppSettings from "@/layouts/dashboard/components/Settings";
import AppParallax from "@/layouts/landing/components/Parallax";
import VVideoBg from "./components/VideoBg";
import AppJumbotron from "@/layouts/landing/components/Jumbotron";
import AppSearchBar from "@/layouts/landing/components/SearchBar";
import AppFooter from "@/components/global/Footer";
import AppSystemBar from "@/layouts/landing/components/SystemBar";
import GovCoFooter from "@/components/global/GovCoFooter";
import MobileMenu from "@/layouts/landing/components/MobileMenu";
import VStickyToolbar from "@/components/app/StickyToolbar";
export default {
  name: "LandingLayout",
  components: {
    VStickyToolbar,
    MobileMenu,
    GovCoFooter,
    AppSystemBar,
    AppFooter,
    AppSearchBar,
    AppJumbotron,
    VVideoBg,
    AppParallax,
    AppSettings,
    VSnackbarQueue,
    VPwaSnackbar,
    AppBar,
  },
  computed: {
    items: get("snackbar/items"),
    classes: function () {
      return this.$vuetify.breakpoint.smAndDown
        ? "display-4 font-weight-black mb-10"
        : "brand";
    },
    classesSubHeading: function () {
      return this.$vuetify.breakpoint.smAndDown
        ? "display-serif-2 font-weight-bold"
        : "subtitle";
    },
  },
  props: ["showParallax", "showFab"],
  data: () => ({
    system: true,
    fab: false,
    subtitle: "Instituto Distrital de Recreación y Deporte",
    bg: require("@/assets/img/landing/bg.jpeg"),
    video: require("@/assets/img/landing/intro.mp4"),
    with_video: true,
  }),
  methods: {
    onScroll() {
      this.system = window.scrollY <= 50;
    },
    onCloseSearchBar: function (val) {
      this.fab = val;
    },
  },
};
</script>

<style lang="sass" scoped>
.brand
  font-size: 6rem
  font-weight: 600
  display: inline-block
  position: relative
  text-shadow: 0 15px 102.86px rgba(0,0,0,.7), 0 15px 40.02px rgba(0,0,0,.21)
.subtitle
  font-family: "Roboto Slab", "Times New Roman", serif
  font-size: 1.5rem
  max-width: 500px
  margin: 0px auto 0
  text-shadow: 0 15px 102.86px rgba(0,0,0,.7), 0 15px 40.02px rgba(0,0,0,.21)
</style>
