<template>
  <details-page :opacity="0.6" :title="$t('landing.index.interactive.title')">
    <v-card-text>
      <v-map-svg />
    </v-card-text>
  </details-page>
</template>

<script>
export default {
  name: "ParkLocalities",
};
</script>
