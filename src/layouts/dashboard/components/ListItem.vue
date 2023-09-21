<template>
  <v-list-item
    :href="href"
    :rel="href && href !== '#' ? 'nofollow' : undefined"
    :target="href && href !== '#' ? '_blank' : undefined"
    :to="item.to"
    :exact="item.exact"
    :active-class="`${activeColor} white--text`"
    @click="callback"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list-item-icon
      v-if="text"
      :class="iconClasses"
      class="v-list-item__icon--text"
      v-text="computedText"
    />

    <v-list-item-icon v-else-if="item.icon">
      <v-icon :class="iconClasses" v-text="item.icon" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        v-if="item.title"
        class="text-capitalize"
        v-text="item.title"
      />
      <v-list-item-subtitle v-if="item.subtitle" v-text="item.subtitle" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from "vuetify/lib/mixins/themeable";
import { sync } from "vuex-pathify";
export default {
  name: "DefaultListItem",
  mixins: [Themeable],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...sync("user", ["activeColor", "drawerMini"]),
    iconClasses() {
      return this.drawerMini ? "mx-auto" : "";
    },
    computedText() {
      if (!this.item || !this.item.title) return "";

      let text = "";

      this.item.title.split(" ").forEach((val) => {
        text += val.substring(0, 1);
      });

      return text.toUpperCase();
    },
    href() {
      return !this.item.to
        ? this.item.href || (!this.item.to ? undefined : undefined)
        : undefined;
    },
    callback() {
      if (typeof this.item.callback === "function") {
        return this.item.callback;
      }
      return () => ({});
    },
  },
};
</script>
