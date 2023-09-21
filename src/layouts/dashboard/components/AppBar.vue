<template>
  <v-app-bar
    id="app-bar-dashboard"
    :color="dark ? undefined : 'white'"
    app
    fixed
    height="45"
    v-bind="{ [`clipped-${rtl ? 'left' : 'right'}`]: true }"
  >
    <v-app-bar-nav-icon @click="onDrawer" />
    <v-app-bar-title class="font-weight-light" v-text="title" />
    <v-spacer />
    <div class="flex-1-1-auto d-flex align-center justify-end">
      <v-dialog v-model="fab" persistent fullscreen>
        <template #activator="{ on, attrs }">
          <v-text-field
            v-if="$vuetify.breakpoint.mdAndUp"
            type="search"
            :placeholder="$t('buttons.Search')"
            autocomplete="off"
            class="mx-2"
            :background-color="!theme.isDark ? 'grey lighten-4' : 'grey darken-3'"
            style="min-width: 450px"
            readonly
            dense
            hide-details
            solo
            v-on="on"
            v-bind="attrs"
          >
            <template #prepend-inner>
              <v-icon color="grey" class="ml-1 mr-2"> mdi-magnify </v-icon>
            </template>
          </v-text-field>
        </template>
        <v-sheet class="text-center h-100" color="rgba(0, 0, 0, 0.4)">
          <v-row dense>
            <v-col cols="12" sm="12" md="8" class="mx-auto">
              <v-card flat class="ma-1">
                <v-card-title>
                  {{ $t("input.search") }}
                  <v-spacer></v-spacer>
                  <v-btn icon @click="fab = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <app-search />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-dialog>
      <app-notifications />
      <app-btn
        v-if="$vuetify.breakpoint.smAndDown"
        :tooltip-attrs="{ bottom: true }"
        icon
        icon-text="mdi-magnify"
        path="buttons.Search"
        @click="fab = true"
      />
      <app-user />
      <v-divider vertical class="my-3" />
      <app-btn
        :tooltip-attrs="{ bottom: true }"
        icon
        icon-text="mdi-cog-outline"
        path="sidebar.Settings"
        @click="settings = !settings"
      />
    </div>
  </v-app-bar>
</template>

<script>
// Utilities
import { sync } from "vuex-pathify";
import AppBtn from "@/components/app/Btn";
import AppNotifications from "@/components/app/Notifications";
import AppUser from "@/components/app/User";

export default {
  name: "DashboardAppBar",
  inject: ["theme"],
  components: { AppUser, AppNotifications, AppBtn },
  data: () => ({
    fab: false,
  }),
  methods: {
    onDrawer() {
      return this.$vuetify.breakpoint.smAndDown
        ? (this.drawer = !this.drawer)
        : (this.drawerMini = !this.drawerMini);
    },
  },
  computed: {
    placeholder() {
      let placeholder = this.$t("search.placeholder");
      if (!this.$vuetify.breakpoint.mobile) {
        placeholder += " " + this.$t("search.key-hint");
      }
      return placeholder;
    },
    title() {
      return this.$route.meta.title;
    },
    ...sync("app", ["drawer", "settings"]),
    ...sync("user", ["theme@dark", "rtl", "drawerMini"]),
  },
};
</script>
