<template>
  <component :is="`h${level}`" :class="['v-heading', map[level]]">
    <a
      v-if="href"
      :href="href"
      class="text-decoration-none text-right text-md-left"
      @click="onClick"
    >
      #
    </a>

    {{ content }}
  </component>
</template>

<script>
// Utilities
import { get } from "vuex-pathify";

export default {
  name: "AppHeading",

  props: {
    content: String,
    href: String,
    level: String,
    margin: {
      type: Boolean,
      default: true,
    },
  },

  data: (vm) => ({
    map: {
      1: `font-weight-bold display-serif-4 ${vm.margin ? "mb-4" : ""}`,
      2: `font-weight-bold display-serif-3 ${vm.margin ? "mb-3" : ""}`,
      3: `font-weight-bold display-serif-2 ${vm.margin ? "mb-2" : ""}`,
      4: `font-weight-bold display-serif-1 ${vm.margin ? "mb-2" : ""}`,
      5: `text-subtitle-1 font-weight-medium ${vm.margin ? "mb-2" : ""}`,
    },
  }),

  computed: { hash: get("route/hash") },

  methods: {
    onClick(e) {
      e.preventDefault();

      const hash = this.href;

      if (this.hash === hash) return;

      this.$router.push({ hash });
      this.$vuetify.goTo(hash);
    },
  },
};
</script>

<style lang="sass">
.v-heading
  display: inline-block
  position: relative

  > a
    bottom: 0
    display: inline-block
    left: 0
    margin: 0 -.7em
    position: absolute
    right: 0
    top: 0

    &:not(:hover):not(:focus)
      opacity: 0
</style>
