<template>
  <div>
    <v-snackbar
      :absolute="absolute"
      :bottom="bottom"
      :color="item.color"
      :key="item.id"
      :left="left"
      :multi-line="multiLine"
      :right="right"
      :timeout="timeout"
      :top="top"
      :value="i === 0"
      :vertical="vertical"
      v-for="(item, i) in items"
    >
      <div class="d-flex align-start alert-notify">
        <span v-if="item.emoji" class="mr-2" v-text="item.emoji" />
        <v-icon v-else-if="item.icon" color="white" class="mr-3">
          {{ item.icon }}
        </v-icon>
        <app-md class="mb-n4" v-text="item.message" />
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn
          :aria-label="$t('buttons.Next')"
          :color="nextButtonColor"
          @click="removeItem(item.id)"
          text
          v-bind="attrs"
          v-if="items.length > 1"
        >
          <v-badge
            class="caption white--text"
            :color="
              ['error', 'danger', 'red'].includes(item.color)
                ? 'black'
                : 'error'
            "
            :value="items.length"
            :content="
              `${items.length - 1} ${$t(
                nextButtonCountText
              )}`.toLocaleLowerCase()
            "
          >
            <v-icon>mdi-arrow-right-circle-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-btn
          :aria-label="$t('buttons.Close')"
          :color="closeButtonColor"
          @click="removeItem(item.id)"
          text
          icon
          v-bind="attrs"
          v-else
        >
          <v-icon>{{ closeButtonIcon }}</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
/**
 * A wrapper component for VSnackbar which supports queueing functionality
 */
export default {
  name: "VSnackbarQueue",
  data: () => ({
    processing: false,
    timeoutId: false,
  }),
  props: {
    /**
     * Position snackbar absolute
     */
    absolute: {
      type: Boolean,
      default: false,
    },
    /**
     * Position snackbar bottom
     */
    bottom: {
      type: Boolean,
      default: false,
    },
    /**
     * The color of the close button
     */
    closeButtonColor: {
      type: String,
      default: "white",
    },
    /**
     * The icon of the close button
     */
    closeButtonIcon: {
      type: String,
      default: "mdi-close",
    },
    /**
     * Array for items to display [{id: '', color: '', message: ''}]
     */
    items: {
      type: Array,
      required: true,
    },
    /**
     * Position snackbar left
     */
    left: {
      type: Boolean,
      default: false,
    },
    /**
     * Position snackbar multiline
     */
    multiLine: {
      type: Boolean,
      default: false,
    },
    /**
     * The color of the next button
     */
    nextButtonColor: {
      type: String,
      default: "white",
    },
    /**
     * The text displayed next to the count of snackbars
     */
    nextButtonCountText: {
      type: String,
      default: "buttons.More",
    },
    /**
     * The text to display in the next button
     */
    nextButtonText: {
      type: String,
      default: "buttons.Next",
    },
    /**
     * Position snackbar right
     */
    right: {
      type: Boolean,
      default: false,
    },
    /**
     * Number of milliseconds to display each snackbar for
     */
    timeout: {
      type: Number,
      default: 6000,
    },
    /**
     * Position snackbar top
     */
    top: {
      type: Boolean,
      default: false,
    },
    /**
     * Position snackbar vertical
     */
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    processItems() {
      const vm = this;
      vm.processing = true;
      if (vm.items && Array.isArray(vm.items) && vm.items.length > 0) {
        const item = vm.items[0];
        return (vm.timeoutId = setTimeout(() => {
          vm.removeItem(item.id);
        }, vm.timeout));
      }
      vm.processing = false;
    },
    removeItem(id) {
      const vm = this;
      clearTimeout(vm.timeoutId);
      /**
       * Emit remove event
       * @event remove
       * @type {number}
       */
      this.$emit("remove", id);
      this.$gtag.event("click", {
        event_category: "notification",
        event_label: "snackbar",
        value: id,
      });
      if (vm.items.length > 0) {
        return vm.processItems();
      }
    },
  },
  watch: {
    items() {
      this.processItems();
    },
  },
};
</script>

<style lang="css">
.alert-notify {
  color: hsla(0, 0%, 100%, 0.85);
}
</style>
