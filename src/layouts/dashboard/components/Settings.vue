<template>
  <v-navigation-drawer
    id="settings-drawer"
    v-model="settings"
    :color="dark ? '#272727' : undefined"
    :right="!rtl"
    disable-route-watcher
    fixed
    temporary
    width="300"
  >
    <v-toolbar :src="img" fixed flat height="80" class="elevation-0">
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          :alt="$t('sidebar.Settings')"
          aspect-ratio="16/9"
          gradient="to top right, rgba(89,77,149,.3), rgba(89,77,149,.5)"
        ></v-img>
      </template>
      <v-toolbar-title>
        <i18n
          tag="h4"
          class="white--text m-0 flex-grow-1 mr-3"
          path="sidebar.Settings"
        />
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <app-btn
          :tooltip-attrs="{ left: true }"
          path="buttons.Close"
          icon
          dark
          icon-text="mdi-close"
          @click="settings = !settings"
        />
      </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <template v-if="!!install">
        <settings-pwa />
        <div class="mt-2 mb-3 mx-n3">
          <v-divider />
        </div>
      </template>
      <settings-theme />
      <div class="mt-4 mb-3 mx-n3">
        <v-divider />
      </div>
      <app-title class="mb-0 pl-1" path="sidebar.filters" />
      <v-item-group v-model="color">
        <v-item v-for="c in colors" :key="c" :value="c">
          <template #default="{ active, toggle }">
            <v-avatar
              :class="active && 'v-settings__item--active'"
              :color="c"
              class="v-settings__item mx-1"
              size="20"
              @click="toggle"
            />
          </template>
        </v-item>
      </v-item-group>
      <div class="mt-4 mb-3 mx-n3">
        <v-divider />
      </div>
      <app-title class="mb-0 pl-1" path="sidebar.background" />
      <v-item-group v-model="scrim">
        <v-item
          v-for="screen in scrims"
          :key="screen"
          :value="screen"
          class="mx-1"
        >
          <template #default="{ active, toggle }">
            <v-avatar
              :class="active && 'v-settings__item--active'"
              :color="screen"
              class="v-settings__item"
              size="24"
              @click="toggle"
            />
          </template>
        </v-item>
      </v-item-group>
      <div class="mt-4 mb-3 mx-n3">
        <v-divider />
      </div>
      <settings-rtl />
      <div class="mt-4 mb-3 mx-n3">
        <v-divider />
      </div>
      <app-title class="mb-0 pl-1" path="sidebar.images" />
      <v-item-group v-model="image" class="d-flex justify-space-between mb-3">
        <v-item v-for="img in images" :key="img" :value="img" class="mx-1">
          <template #default="{ active, toggle }">
            <v-sheet
              :class="active && 'v-settings__item--active'"
              class="d-inline-block v-settings__item"
              @click="toggle"
            >
              <v-img :src="img" height="100" width="50" />
            </v-sheet>
          </template>
        </v-item>
      </v-item-group>
      <div class="mt-4 mb-3 mx-n3">
        <v-divider />
      </div>
      <settings-font-size />
      <div class="mt-4 mb-3 mx-n3">
        <v-divider />
      </div>
      <app-lang />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { get, sync } from "vuex-pathify";
import SettingsTheme from "@/components/app/Theme";
import SettingsPwa from "@/components/app/Pwa";
import SettingsFontSize from "@/components/app/FontSize";
import AppBtn from "@/components/app/Btn";
import SettingsRtl from "@/components/app/Rtl";

export default {
  name: "DashboardSettings",
  components: {
    SettingsRtl,
    AppBtn,
    SettingsFontSize,
    SettingsPwa,
    SettingsTheme,
  },
  computed: {
    ...get("user", ["rtl", "theme@dark"]),
    settings: sync("app/settings"),
    install: get("pwa/sw@install"),
    color: sync("user/activeColor"),
    scrim: sync("user/drawerColor"),
    image: sync("user/drawerImage"),
  },
  data: () => ({
    colors: [
      "primary",
      "red",
      "pink",
      "purple",
      "indigo",
      "blue",
      "light-blue",
      "teal",
      "cyan",
      "green",
      "lime",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "grey",
      "blue-grey",
      "black",
    ],
    img: require("@/assets/img/dashboard/menus/notificatios.jpg"),
    scrims: [
      "rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)",
      "rgba(228, 226, 226, 0.3), rgba(255, 255, 255, 0.8)",
      "rgba(244, 67, 54, .3), rgba(244, 67, 54, .8)",
      "rgba(39, 167, 54, .3), rgba(39, 167, 54, .8)",
      "rgba(33, 147, 176, .2), rgba(109, 213, 237, .6)",
    ],
    images: [
      require("@/assets/img/dashboard/sidebar/sidebar-1.jpg"),
      require("@/assets/img/dashboard/sidebar/sidebar-2.jpg"),
      require("@/assets/img/dashboard/sidebar/sidebar-3.jpg"),
      require("@/assets/img/dashboard/sidebar/sidebar-4.jpg"),
    ],
  }),
  watch: {
    color(val) {
      if (!val) {
        this.color = "primary";
      }
    },
    scrim(val) {
      if (!val) {
        this.scrim = "rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)";
      }
    },
  },
};
</script>
