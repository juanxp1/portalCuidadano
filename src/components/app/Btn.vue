<template>
  <v-tooltip v-if="icon || fab" v-bind="tooltipAttrs">
    <template #activator="{ on, attrs }">
      <v-btn
        tabindex="-1"
        :aria-label="path ? $t(path) : $t('buttons.Button')"
        v-bind="{
          icon: icon,
          fab: fab,
          ...attrs,
          ...$attrs,
        }"
        v-on="{
          ...on,
          ...$listeners,
        }"
      >
        <slot v-if="$slots.default" />
        <v-icon v-else-if="iconText">
          {{ iconText }}
        </v-icon>
      </v-btn>
    </template>
    <i18n :path="path" />
  </v-tooltip>
  <v-btn
    v-else
    tabindex="-1"
    :aria-label="path ? $t(path) : $t('buttons.Button')"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot v-if="$slots.default" />
    <template v-else-if="path">
      <v-icon v-if="iconPosition === 'left' && iconText" left>
        {{ iconText }}
      </v-icon>
      <i18n :path="path" />
      <v-icon v-if="iconPosition === 'right' && iconText">
        {{ iconText }}
      </v-icon>
    </template>
  </v-btn>
</template>

<script>
export default {
  name: "AppBtn",
  props: {
    tooltipAttrs: {
      type: Object,
      default: () => ({
        top: true,
      }),
    },
    iconText: String,
    iconPosition: {
      type: String,
      default: "left",
      validator: (value) => ["left", "right"].includes(value),
    },
    path: String,
    icon: Boolean,
    fab: Boolean,
  },
};
</script>
