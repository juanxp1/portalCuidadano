<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="drawer"
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
      <v-img v-bind="props" :gradient="`to bottom, ${drawerColor}`" />
    </template>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-2">
          <i18n
            tag="span"
            path="dashboard.drawer.titleMini"
            class="logo-mini mr-3"
          />
          <i18n tag="span" path="dashboard.drawer.title" class="logo-normal" />
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="my-1" />
    <v-list dense nav>
      <default-list-group :item="profile" />
    </v-list>
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
import { sync, get } from "vuex-pathify";
import DashboardList from "@/layouts/dashboard/components/List";
import { IN_BROWSER } from "@/util/globals";
import DefaultListGroup from "@/layouts/dashboard/components/ListGroup";

export default {
  name: "DashboardDrawer",
  components: { DefaultListGroup, DashboardList },
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
        title: "Tablero",
        to: { name: "Dashboard" },
      },
      {
        icon: "mdi-magnify",
        title: "Actividades",
        to: { name: "SportActivities" },
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
            exact: true,
          },
          {
            icon: "mdi-soccer",
            title: "Mis Actividades",
            to: { name: "Subscriptions" },
            exact: true,
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
            exact: true,
          },
          {
            icon: "mdi-book",
            title: "Mis Reservas",
            to: { name: "Bookings" },
            exact: true,
          },
        ],
      },
      {
        icon: "mdi-currency-usd",
        title: "Pagos",
        group: "pagos",
        items: [
          {
            to: { name: "Payments" },
            icon: "mdi-currency-usd",
            title: "Mis Pagos",
            exact: true,
          },
          {
            to: { name: "Services" },
            icon: "mdi-currency-usd",
            title: "Pagar Otros Servicios",
            exact: true,
          },
        ],
      },
    ],
  }),
  computed: {
    ...sync("app", ["drawer", "settings"]),
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
    username: get("auth/user@name"),
    email: get("auth/user@email"),
    realName() {
      return (this.username || "").length > 4 ? this.username : this.email;
    },
    profile() {
      return {
        avatar: this.realName,
        group: "perfil",
        title: this.realName,
        items: [
          {
            title: this.$t("sidebar.Profile"),
            exact: true,
            to: { name: "Profile" },
          },
          {
            title: this.$t("notifications.Notifications"),
            exact: true,
            to: { name: "Notifications" },
          },
          {
            title: this.$t("sidebar.Settings"),
            href: undefined,
            callback: () => (this.settings = !this.settings),
          },
          {
            title: this.$t("sidebar.Logout"),
            href: undefined,
            callback: this.onLogout,
          },
        ],
      };
    },
    items() {
      return this.drawerItems.map(this.mapItem);
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
      this.$auth.logout().finally(() => {
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
