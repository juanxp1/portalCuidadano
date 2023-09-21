<template>
  <div class="wrapper">
    <v-parallax :lazy-src="bg" :height="height" class="text-center" :src="bg">
      <v-overlay absolute :opacity="opacity">
        <v-row>
          <v-col cols="12">
            <h1 class="display-serif-2" v-text="$t(title)" />
          </v-col>
          <slot v-if="$slots.heading" name="heading" />
        </v-row>
      </v-overlay>
    </v-parallax>
    <slot v-if="customCard" />
    <v-card v-else class="main main-raised elevation-24 mb-12">
      <app-breadcrumbs />
      <slot />
    </v-card>
    <slot name="after-card" />
  </div>
</template>

<script>
export default {
  name: "DetailsPage",
  props: {
    title: String,
    customCard: Boolean,
    bg: {
      type: String,
      default: require("@/assets/img/landing/profile.jpg"),
    },
    opacity: {
      type: [String, Number],
      default: 0.6,
    },
    height: {
      type: [String, Number],
      default: "350",
    },
  },
};
</script>
