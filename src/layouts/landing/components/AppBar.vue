<template>
  <v-app-bar
    v-bind="$attrs"
    :dark="dark"
    elevate-on-scroll
    v-scroll="onScroll"
    app
    fixed
    :color="color"
  >
    <v-container class="px-0 text-right d-flex align-center">
      <v-btn
        tabindex="-1"
        :aria-label="$t('buttons.back')"
        icon
        v-if="$route.name !== 'Home'"
        @click="goBack"
      >
        <v-icon :size="fontSize > 20 && fontSize < 26 ? fontSize : 20"
          >mdi-arrow-left</v-icon
        >
      </v-btn>
      <app-btn
        v-if="$vuetify.breakpoint.smAndDown"
        tabindex="-1"
        icon
        path="Menu"
        @click="mobileMenu = !mobileMenu"
      >
        <v-icon>mdi-menu</v-icon>
      </app-btn>
      <v-toolbar-title
        class="font-weight-light hidden-xs-only"
        v-text="title"
      />
      <v-spacer />
      <app-bar-items />
      <app-notifications v-if="$auth.isLoggedIn()" />
      <app-user v-if="$auth.isLoggedIn()" />
      <app-btn icon path="sidebar.Settings" @click="settings = !settings">
        <v-icon>mdi-cog-outline</v-icon>
      </app-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
import { sync } from "vuex-pathify";
import AppNotifications from "@/components/app/Notifications";
import AppBarItems from "@/layouts/landing/components/AppBarItems";

export default {
  name: "AppBar",
  components: { AppBarItems, AppNotifications },
  props: {
    isLanding: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    dark: true,
    tab: 0,
    show: 0,
    color: "transparent",
  }),
  mounted() {
    if (!this.isLanding) {
      this.color = "";
      this.dark = this.isLanding;
    }
    if (this.fontSize > 15 && this.fontSize < 26) {
      document.documentElement.style = `font-size: ${this.fontSize}px;`;
    }
  },
  methods: {
    onScroll: function () {
      if (this.isLanding) {
        let color = this.$vuetify.theme.isDark ? "" : "white";
        this.color = window.scrollY > 100 ? color : "transparent";
        this.dark = !(window.scrollY > 100);
      } else {
        this.color = "";
        this.dark = this.isLanding;
      }
    },
    goBack() {
      if (this.$route.name === "Search") {
        this.$router.push({ name: "Home" });
      } else if (this.$route.name === "Park") {
        this.$router.push({ name: "Search" });
      } else if (
        this.$route.name === "Social" ||
        this.$route.name === "Activities"
      ) {
        this.$router.push({
          name: "Park",
          params: { id: this.$route.params.id },
        });
      } else {
        this.$router.push({ name: "Home" });
      }
    },
  },
  computed: {
    title() {
      return this.$route.meta.title;
    },
    fontSize: sync("app/fontSize"),
    mobileMenu: sync("app/mobileMenu"),
    settings: sync("app/settings"),
  },
};
</script>
