<template>
  <v-menu offset-y left>
    <template #activator="{ on: menu, attrs }">
      <v-tooltip left>
        <template #activator="{ on: tooltip }">
          <v-btn
            :id="id"
            :aria-label="$t(tooltipText)"
            v-bind="{
              icon: true,
              color: menuIconColor,
              ...btnAttrs,
              ...$attrs,
              ...attrs,
            }"
            v-on="{ ...menu, ...tooltip }"
          >
            <v-icon
              v-text="menuIcon"
              :left="btnAttrs.length && (!btnAttrs.icon || !btnAttrs.fab)"
            />
            <i18n
              v-if="btnAttrs.length && (!btnAttrs.icon || !btnAttrs.fab)"
              :path="tooltipText"
            />
          </v-btn>
        </template>
        <i18n tag="span" :path="tooltipText" />
      </v-tooltip>
    </template>
    <v-list dense>
      <slot v-if="$slots.default" />
      <template v-else>
        <app-item
          v-for="(item, i) in items"
          :key="`card-toolbar-${i}`"
          :item="item"
          :text="!item.icon"
          @click="onClick(item.action)"
        />
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "AppMenu",
  props: {
    id: {
      type: String,
      default: undefined,
    },
    menuIcon: {
      type: String,
      default: "mdi-dots-vertical",
    },
    menuIconColor: {
      type: String,
      default: "primary",
    },
    tooltipText: {
      type: String,
      default: "buttons.MoreOptions",
    },
    btnAttrs: {
      type: Object,
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onClick(fn = null) {
      if (typeof fn === "function") {
        fn();
      }
    },
  },
};
</script>
