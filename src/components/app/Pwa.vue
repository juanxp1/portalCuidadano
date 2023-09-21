<template>
  <div class="px-1">
    <app-btn
      :text="false"
      block
      color="grey darken-4"
      depressed
      :aria-label="$t('pwa.install')"
      @click="install"
    >
      <span class="white--text">
        {{ $t("pwa.install") }}
        <v-icon right size="20"> mdi-plus-circle </v-icon>
      </span>
    </app-btn>
  </div>
</template>

<script>
// Utilities
import { call } from "vuex-pathify";

export default {
  name: "SettingsPwa",

  methods: { install: call("pwa/install") },
};
</script>
