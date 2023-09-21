<template>
  <v-list-item v-bind="$attrs" v-on="$listeners">
    <v-list-item-avatar class="hidden-sm-and-down">
      <v-avatar>
        <v-img v-if="!!item.image" :src="item.image" :lazy-src="item.image" />
        <v-icon
          v-else-if="!!item.color"
          :class="item.color"
          class="lighten-1 white--text"
        >
          mdi-pine-tree
        </v-icon>
        <v-icon v-else>mdi-text</v-icon>
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-html="title" />
      <v-list-item-subtitle
        class="text-caption text-wrap text--primary font-weight-regular"
        v-html="truncateContent"
      />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "SearchResultItem",
  props: {
    i18nPath: String,
    titleKeys: {
      type: Array,
      default: () => [],
    },
    contentKeys: {
      type: Array,
      default: () => [],
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    genTxt(keys) {
      let str = "";
      if (keys && Array.isArray(keys)) {
        keys.map((key, i) => {
          let i18n = `${this.i18nPath}.${key}`;
          if (
            this.item._highlightResult[key] &&
            this.item._highlightResult[key].value &&
            this.item._highlightResult[key].value !== "null"
          ) {
            if (i !== 0) {
              str += " - ";
            }
            str += `<strong>${this.$t(i18n)}:</strong> ${
              this.item._highlightResult[key].value
            }`;
          }
        });
      }
      return str;
    },
  },
  computed: {
    title() {
      return this.genTxt(this.titleKeys);
    },
    subtitle() {
      return this.genTxt(this.contentKeys);
    },
    truncateContent() {
      const val = this.subtitle.trim();
      // number of characters until the word after the end of the first mark
      const withMark = val.match(/^.*?<\/mark>(.{4,}?\b)?/)?.[0].length ?? 0;
      // characters until the end of the first word after the 120char limit
      const minLength = val.match(/^.{0,120}.?\b/)?.[0].length ?? 0;
      const length = Math.max(withMark, minLength);
      const continues = val.length > length;
      return val.slice(0, length) + (continues ? "&mldr;" : "");
    },
  },
};
</script>
