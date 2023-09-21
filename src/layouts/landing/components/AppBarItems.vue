<template>
  <div>
    <v-menu
      v-for="(item, i) in items"
      :key="i"
      offset-y
      origin="center center"
      left
      transition="slide-y-transition"
      min-height="auto"
      max-height="auto"
      min-width="auto"
      max-width="auto"
      :open-on-hover="true"
    >
      <template #activator="{ on: menu, attrs: menuAttrs }">
        <v-btn
          tag="a"
          :href="item.href ? item.href : undefined"
          :to="item.to ? item.to : undefined"
          tabindex="-1"
          min-height="48"
          min-width="40"
          class="mr-1 hidden-sm-and-down"
          :exact="item.exact"
          :text="!!!item.color"
          :color="item.color"
          :aria-label="$t(item.text)"
          v-bind="{ ...menuAttrs }"
          v-on="{ ...menu }"
          @click="onClick(item.action)"
        >
          <v-icon
            :left="$vuetify.breakpoint.mdAndUp"
            :size="fontSize > 20 && fontSize < 26 ? fontSize : 20"
            v-text="item.icon"
          />
          <span v-text="$t(item.text)" />
        </v-btn>
      </template>
      <v-card
        v-if="item.items && item.items.length"
        class="mx-auto w-100"
      >
        <v-card-text>
          <v-container>
            <v-row justify="start" align="start" no-gutters>
              <v-col
                v-for="(list, j) in item.items"
                :key="`menu-toolbar-${j}`"
                cols="12"
                sm="12"
                md="4"
                class="pa-1"
              >
                <v-list dense nav color="transparent">
                  <v-list-item dense :to="list.to" :exact="true">
                    <v-list-item-content>
                      <v-list-item-title>
                        <i18n
                          tag="h5"
                          class="display-serif-1"
                          :path="list.text"
                        />
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <app-item
                    v-for="(menu, j) in list.items"
                    :key="`card-toolbar-${j}`"
                    dense
                    class="w-100"
                    exact-active-class="primary white--text"
                    :item="menu"
                    :text="!menu.icon"
                    @click="onClick(menu.action)"
                  />
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { get } from "vuex-pathify";

export default {
  name: "AppBarItems",
  methods: {
    onLogout() {
      this.$auth.logout().finally(() => {
        this.$router.push({
          name: "Home",
        });
      });
    },
    onClick(fn = null) {
      if (typeof fn === "function") {
        fn();
      }
    },
  },
  computed: {
    fontSize: get("app/fontSize"),
    menus() {
      return [
        {
          icon: "mdi-format-list-text",
          text: "Portal",
          exact: true,
          items: [
            {
              icon: "mdi-apps",
              text: "Servicios",
              exact: true,
              to: {
                name: "Home",
                hash: "#servicios",
              },
              items: [
                {
                  icon: "mdi-soccer-field",
                  title: "Canchas Sintéticas",
                  exact: true,
                  to: {
                    name: "SyntheticFields",
                  },
                },
                {
                  icon: "mdi-grill",
                  title: "Asadores",
                  exact: true,
                  to: {
                    name: "Grills",
                  },
                },
              ],
            },
            {
              icon: "mdi-apps",
              text: "Actividades",
              to: {
                name: "CitizenActivities",
              },
              items: [
                {
                  icon: "mdi-run",
                  title: "Recreación",
                  exact: true,
                  to: {
                    name: "OtherActivities",
                  },
                },
                {
                  icon: "mdi-soccer",
                  title: "Deportes",
                  exact: true,
                  to: {
                    name: "SportActivities",
                  },
                },
                {
                  icon: "mdi-calendar",
                  title: "Agenda",
                  exact: true,
                  to: {
                    name: "AgendaEvents",
                  },
                },
              ],
            },
            {
              icon: "mdi-pine-tree",
              text: "Parques",
              to: {
                name: "Search",
              },
              items: [
                {
                  icon: "mdi-map",
                  title: "Mapa",
                  exact: true,
                  to: {
                    name: "Map",
                  },
                },
                {
                  icon: "mdi-map-marker",
                  title: "Localidades",
                  exact: true,
                  to: {
                    name: "ParkLocalities",
                  },
                },
                {
                  icon: "mdi-layers",
                  title: "Escalas",
                  exact: true,
                  to: {
                    name: "SearchType",
                  },
                },
                {
                  icon: "mdi-image-search-outline",
                  title: "Diagramas",
                  exact: true,
                  to: {
                    name: "ParkDiagrams",
                  },
                },
              ],
            },
          ],
        },
      ];
    },
    items() {
      const dash = {
        icon: "mdi-apps",
        text: "menu.dashboard",
        to: { name: "Dashboard" },
        action: () => {},
      };
      const logout = {
        icon: "mdi-exit-to-app",
        text: "menu.logout",
        action: this.onLogout,
      };
      const login = {
        icon: "mdi-fingerprint",
        text: "menu.login",
        to: { name: "Login" },
        action: () => {},
      };
      const register = {
        icon: "mdi-account-plus",
        text: "menu.register",
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
              text: "menu.home",
              exact: true,
              action: () => {
                if (this.$route.hash) {
                  this.$router.push({ hash: "" });
                }
                this.$vuetify.goTo(0);
              },
            }
          : {
              icon: "mdi-home",
              text: "menu.home",
              to: { name: "Home" },
              exact: true,
              action: () => {},
            };
      return [home, ...this.menus, ...menu];
    },
  },
};
</script>
