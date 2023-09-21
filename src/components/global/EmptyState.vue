<template>
  <v-scale-transition origin="center center">
    <div
      class="v-empty-state"
      :class="[emptyStateClasses]"
      :style="emptyStateStyles"
    >
      <div class="v-empty-state-container">
        <template v-if="icon">
          <v-icon class="v-empty-state-icon">{{ icon }}</v-icon>
        </template>
        <strong class="v-empty-state-label grey--text" v-if="label">{{
          label
        }}</strong>
        <p class="v-empty-state-description grey--text" v-if="description">
          {{ description }}
        </p>
        <slot />
      </div>
    </div>
  </v-scale-transition>
</template>

<script>
export default {
  name: "VEmptyState",
  props: {
    rounded: Boolean,
    size: {
      type: Number,
      default: 420,
    },
    icon: String,
    label: String,
    description: String,
  },

  computed: {
    emptyStateClasses() {
      return {
        "v-rounded": this.rounded && this.$vuetify.breakpoint.mdAndUp,
      };
    },
    emptyStateStyles() {
      if (this.rounded) {
        const size = this.size + "px";

        return {
          width: size,
          height: size,
        };
      }
      return {};
    },
  },
};
</script>
