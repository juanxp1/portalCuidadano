<template>
  <details-page :opacity="0.6" :title="$t('menu.parkdiagram')">
    <v-card-text>
      <image-sectors />
    </v-card-text>
  </details-page>
</template>

<script>
export default {
  name: "ParkDiagram",
};
</script>
