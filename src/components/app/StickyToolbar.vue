<template>
  <div v-if="!settings" :title="$t('sidebar.title')">
    <ul
      class="sticky-toolbar elevation-1 hidden-sm-and-down nav flex-column px-2 py-3 mt-4 primary"
    >
      <v-tooltip left>
        <template #activator="{ on }">
          <li class="nav-item mb-2" v-on="on">
            <v-btn
              :aria-label="$t('sidebar.Settings')"
              dark
              tile
              icon
              small
              @click="settings = !settings"
            >
              <v-icon small>mdi-cog</v-icon>
            </v-btn>
          </li>
        </template>
        <i18n path="sidebar.Settings" />
      </v-tooltip>
      <v-tooltip left>
        <template #activator="{ on }">
          <li class="nav-item mb-2" v-on="on">
            <v-btn
              :aria-label="$t('sidebar.increase')"
              dark
              tile
              icon
              small
              @click="onIncrease"
            >
              <v-icon small>mdi-format-font-size-increase</v-icon>
            </v-btn>
          </li>
        </template>
        <i18n path="sidebar.increase" />
      </v-tooltip>
      <v-tooltip left>
        <template #activator="{ on }">
          <li class="nav-item mb-2" v-on="on">
            <v-btn
              :aria-label="$t('sidebar.decrease')"
              dark
              tile
              icon
              small
              @click="onDecrease"
            >
              <v-icon small>mdi-format-font-size-decrease</v-icon>
            </v-btn>
          </li>
        </template>
        <i18n path="sidebar.decrease" />
      </v-tooltip>
      <v-tooltip left>
        <template #activator="{ on }">
          <li class="nav-item" v-on="on">
            <v-btn
              :aria-label="$t('sidebar.relayCenter')"
              href="https://centroderelevo.gov.co/632/w3-channel.html"
              target="_blank"
              tile
              icon
              dark
              small
            >
              <v-icon small>mdi-hand-wave</v-icon>
            </v-btn>
          </li>
        </template>
        <i18n path="sidebar.relayCenter" />
      </v-tooltip>
    </ul>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  name: "VStickyToolbar",
  methods: {
    onIncrease: function () {
      this.fontSize++;
      if (this.fontSize > 15 && this.fontSize < 26) {
        this.show = this.fontSize;
        document.documentElement.style = `font-size: ${this.fontSize}px;`;
      } else if (this.fontSize > 25) {
        this.fontSize = 25;
      }
    },
    onDecrease: function () {
      this.fontSize--;
      if (this.fontSize > 15 && this.fontSize < 26) {
        this.show = this.fontSize;
        document.documentElement.style = `font-size: ${this.fontSize}px;`;
      } else if (this.fontSize < 15) {
        this.fontSize = 15;
        this.show = 0;
      }
    },
  },
  computed: {
    settings: sync("app/settings"),
    fontSize: sync("app/fontSize"),
  },
};
</script>

<style scoped lang="scss">
.sticky-toolbar {
  width: 46px;
  position: fixed;
  top: 30%;
  right: 0;
  list-style: none;
  z-index: 95;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-top-left-radius: 0.42rem;
  border-bottom-left-radius: 0.42rem;
}
</style>
