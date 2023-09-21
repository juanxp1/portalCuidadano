<template>
  <div>
    <app-title v-if="path" :path="path" class="mb-0 pl-1" />

    <v-item-group
      v-model="internalValue"
      class="mx-auto row row--dense"
      mandatory
    >
      <v-col v-for="{ icon, text } in items" :key="text" cols="6">
        <v-item :value="text">
          <template #default="{ active, toggle }">
            <v-card
              :color="active ? 'primary' : ``"
              :dark="!dark && active"
              class="v-card--group py-3 px-4 text-center position-relative cursor-pointer d-flex align-center justify-space-between"
              rounded
              @click="toggle"
            >
              <i18n :path="text" />

              <v-icon :size="iconSize" v-text="icon" />
            </v-card>
          </template>
        </v-item>
      </v-col>
    </v-item-group>
  </div>
</template>

<script>
// Mixins
import Proxyable from "vuetify/lib/mixins/proxyable";

// Utilities
import { get } from "vuex-pathify";

export default {
  name: "SettingsGroup",
  mixins: [Proxyable],

  data: () => ({ path: "" }),

  computed: {
    fontSize: get("app/fontSize"),
    iconSize() {
      return this.fontSize > 20 && this.fontSize < 26 ? this.fontSize : 20;
    },
    dark: get("user/theme@dark"),
    items: () => [],
  },
};
</script>

<style lang="sass">
// Bug in Vuetify, ripple isn't inheriting border-radius
.v-card--group::before
  border-radius: inherit
</style>
