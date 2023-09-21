<template>
  <div>
    <app-title v-if="path" :path="path" class="mb-0 pl-1" />

    <v-item-group class="mx-auto row row--dense" mandatory>
      <v-col cols="12">
        <v-item>
          <template #default="{ active }">
            <v-card
              :color="active ? 'primary' : ``"
              :dark="!dark && active"
              class="v-card--group py-3 px-4 text-center position-relative cursor-pointer d-flex align-center justify-space-between"
              rounded
              @click="onIncrease"
            >
              <i18n path="sidebar.increase" />
              <v-badge color="error" overlap :value="show" :content="fontSize">
                <v-icon
                  :size="iconSize"
                  v-text="'mdi-format-font-size-increase'"
                />
              </v-badge>
            </v-card>
          </template>
        </v-item>
      </v-col>
      <v-col cols="12">
        <v-item>
          <template #default="{ active }">
            <v-card
              :color="active ? 'primary' : ``"
              :dark="!dark && active"
              class="v-card--group py-3 px-4 text-center position-relative cursor-pointer d-flex align-center justify-space-between"
              rounded
              @click="onDecrease"
            >
              <i18n path="sidebar.decrease" />

              <v-icon
                :size="iconSize"
                v-text="'mdi-format-font-size-decrease'"
              />
            </v-card>
          </template>
        </v-item>
      </v-col>
    </v-item-group>
  </div>
</template>

<script>
// Utilities
import { get, sync } from "vuex-pathify";

export default {
  name: "SettingsFontSize",
  data: () => ({
    path: "sidebar.font",
    show: 0,
  }),

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
    dark: get("user/theme@dark"),
    fontSize: sync("app/fontSize"),
    iconSize() {
      return this.fontSize > 20 && this.fontSize < 26 ? this.fontSize : 20;
    },
  },
};
</script>
