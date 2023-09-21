<template>
  <v-list-item
    :href="href"
    :rel="href && href !== '#' ? 'nofollow' : undefined"
    :target="href && href !== '#' ? '_blank' : undefined"
    :to="item.to"
    :exact="item.exact"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list-item-icon
      v-if="text"
      class="v-list-item__icon--text mx-auto"
      v-text="computedText"
    />
    <v-list-item-icon v-else-if="item.icon">
      <v-icon class="mx-auto" v-text="item.icon" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        v-if="title"
        class="text-capitalize"
        v-text="$t(title)"
      />
      <v-list-item-subtitle v-if="item.subtitle" v-text="$t(item.subtitle)" />
      <slot name="content"></slot>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Themeable from "vuetify/lib/mixins/themeable";
export default {
  name: "AppItem",
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
    computedText() {
      if (!this.item || !this.item.title) return "";

      let text = "";

      this.item.title.split(" ").forEach((val) => {
        text += val.substring(0, 1);
      });

      return text.toUpperCase();
    },
    title() {
      return this.item.title || this.item.text;
    },
    href() {
      return !this.item.to
        ? this.item.href || (!this.item.to ? undefined : undefined)
        : undefined;
    },
  },
};
</script>
