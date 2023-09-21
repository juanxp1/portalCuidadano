<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="mobileMenu"
    :dark="theme"
    :right="$vuetify.rtl"
    :src="drawerImage"
    :expand-on-hover="drawerMini"
    app
    floating
    :mini-variant="drawerMini"
    mobile-breakpoint="960"
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <template #img="props">
      <v-img
        :src="props.src"
        :lazy-src="props.src"
        :gradient="`to bottom, ${drawerColor}`"
        :height="props.height"
      />
    </template>
    <v-divider class="my-1" />
    <keep-alive>
      <dashboard-list
        key="simple"
        v-mutate.once.child="onMutate"
        :items="items"
      />
    </keep-alive>
  </v-navigation-drawer>
</template>

<script>
import { sync } from "vuex-pathify";
import DashboardList from "@/layouts/dashboard/components/List";
import { IN_BROWSER } from "@/util/globals";

export default {
  name: "MobileMenu",
  components: { DashboardList },
  data: () => ({
    drawerItems: [
      {
        icon: "mdi-home",
        title: "Inicio",
        to: { name: "Home" },
        exact: true,
      },
      {
        icon: "mdi-view-dashboard",
        title: "dashboard",
        to: { name: "Dashboard" },
      },
      {
        icon: "mdi-account",
        title: "Beneficiarios",
        group: "beneficiarios",
        items: [
          {
            icon: "mdi-account",
            title: "Mis Beneficiarios",
            to: { name: "People" },
          },
          {
            icon: "mdi-soccer",
            title: "Mis Actividades",
            to: { name: "Subscriptions" },
          },
        ],
      },
      {
        icon: "mdi-book",
        title: "Reservas",
        group: "reservas",
        items: [
          {
            icon: "mdi-book",
            title: "Crear Reserva",
            to: { name: "Booking" },
          },
          {
            icon: "mdi-book",
            title: "Mis Reservas",
            to: { name: "Bookings" },
          },
        ],
      },
      {
        to: { name: "Payments" },
        icon: "mdi-currency-usd",
        title: "Pagos",
      },
    ],
  }),
  computed: {
    ...sync("app", ["mobileMenu", "settings"]),
    ...sync("user", [
      "theme@dark",
      "rtl",
      "drawerMini",
      "activeColor",
      "drawerColor",
      "drawerImage",
    ]),
    theme() {
      return (
        this.drawerColor !==
          "rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)" ||
        !this.$vuetify.theme.dark
      );
    },
    items() {
      const dash = {
        icon: "mdi-apps",
        title: this.$t("menu.dashboard"),
        to: { name: "Dashboard" },
        action: () => {},
      };
      const logout = {
        icon: "mdi-exit-to-app",
        title: this.$t("menu.logout"),
        action: this.onLogout,
      };
      const login = {
        icon: "mdi-fingerprint",
        title: this.$t("menu.login"),
        to: { name: "Login" },
        action: () => {},
      };
      const register = {
        icon: "mdi-account-plus",
        title: this.$t("menu.register"),
        color: "primary",
        to: { name: "Register" },
        action: () => {},
      };
      const route = this.$route.name.toLowerCase() || "home";
      const menu = this.$auth.isLoggedIn()
        ? route === "verify"
          ? [logout]
          : [dash]
        : [login, register];
      const home =
        route === "home"
          ? {
              icon: "mdi-home",
              title: this.$t("menu.home"),
              exact: true,
              action: () => {
                this.$vuetify.goTo(0);
              },
            }
          : {
              icon: "mdi-home",
              title: this.$t("menu.home"),
              to: { name: "Home" },
              exact: true,
              action: () => {},
            };
      return [home, ...menu];
    },
  },
  methods: {
    findActiveItem(children = []) {
      return [...children].reduce((acc, cur) => {
        // If we've found an item, just return it
        if (acc) {
          return acc;
          // If the current item is active, return as accumulator
        } else if (cur.classList.contains("v-list-item--active")) {
          return cur;
        }
        return this.findActiveItem(cur.children);
      }, null);
    },
    onMutate(mutationsList, observer) {
      // Cancel if drawer is not visible
      if (
        !this.drawer ||
        !IN_BROWSER ||
        typeof document.documentElement.scrollIntoView !== "function"
      )
        return;
      /* eslint-disable no-labels */
      // Iterate through all mutated items
      found: for (const record of mutationsList) {
        const nodes = [...record.addedNodes];
        // Find the active list group
        for (const node of nodes) {
          if (
            !node.classList.contains("v-list-group--active") ||
            node.children.length < 2
          )
            continue;
          // Find the active child
          const child = this.findActiveItem(node.children[1].children);
          if (!child) continue;
          child.scrollIntoView();
          // Break loop
          break found;
        }
      }
    },
    mapItem(item) {
      return {
        ...item,
        items: item.items ? item.items.map(this.mapItem) : undefined,
        title: item.title,
      };
    },
    onLogout() {
      this.$auth.logout(this.email).finally(() => {
        this.$router.push({
          name: "Home",
        });
      });
    },
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#app-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

    .v-list-group__header.v-list-item--active:before
      opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px
      +ltr()
        margin-right: 24px
        margin-left: 12px !important
      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2
        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
