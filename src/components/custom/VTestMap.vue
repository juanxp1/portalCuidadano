<template>
  <div v-bind="$attrs" ref="esri" class="mapdiv">
    <div id="actions" :style="style">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VTestMap'
}
</script>

<style scoped>

</style>