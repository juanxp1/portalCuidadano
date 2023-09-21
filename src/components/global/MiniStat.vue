<template>
  <v-skeleton-loader :loading="loading" type="list-item-avatar-two-line">
    <div class="d-flex justify-center flex-lg-fill mr-5 mb-2">
      <span class="mr-4">
        <v-icon size="30" class="opacity-70" v-text="item.icon" />
      </span>
      <div class="d-flex flex-column text-right">
        <div class="body-3 grey--text font-weight-regular" v-text="item.text" />
        <h3
          v-if="isNotNumber"
          class="display-2 font-weight-light text--primary"
          v-text="item.value"
        />
        <v-animated-number
          class="display-2 font-weight-light text--primary"
          :delay="500"
          round
          :value="item.value"
          :format-value="nFormatter"
        />
      </div>
    </div>
  </v-skeleton-loader>
</template>

<script>
import VAnimatedNumber from "animated-number-vue";
export default {
  name: "AppMiniStat",
  components: { VAnimatedNumber },
  props: {
    loading: Boolean,
    noFormat: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    nFormatter(num) {
      if (!this.noFormat) {
        if (Math.abs(num) > 999 && Math.abs(num) <= 999999) {
          return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K";
        }
        if (Math.abs(num) > 999999) {
          return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "M";
        }
        return Math.sign(num) * Math.abs(num).toFixed(0);
      }
      return num;
    },
  },
  computed: {
    isNotNumber() {
      return Number.isNaN(this.item.value);
    },
  },
};
</script>
