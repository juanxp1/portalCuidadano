<template>
  <v-list-group
    v-model="model"
    :group="group"
    :prepend-icon="icon"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    :color="textColor"
    v-bind="$attrs"
  >
    <template #activator>
      <v-list-item-icon
        v-if="text"
        class="v-list-item__icon--text"
        v-text="computedText"
      />

      <v-list-item-avatar
        v-else-if="item.avatar"
        class="align-center elevation-12"
        color="white"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="mt-1" v-html="identicon" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-if="item.title" v-text="item.title" />
      </v-list-item-content>
    </template>

    <template v-for="(child, i) in item.items">
      <v-subheader
        v-if="child.heading"
        :key="`heading-${i}`"
        class="text--primary font-weight-black text-uppercase"
        inset
        v-text="child.title"
      />

      <v-divider
        v-else-if="child.divider"
        :key="`divider-${i}`"
        inset
        class="mt-3 mb-2 ml-16"
      />

      <list-sub-group
        v-else-if="child.items"
        :key="`sub-group-${i}`"
        :item="child"
      />

      <default-list-item v-else :key="`child-${i}`" :item="child" text />
    </template>
  </v-list-group>
</template>

<script>
// Components
import DefaultListItem from "@/layouts/dashboard/components/ListItem";
import VListGroup from "@/layouts/dashboard/components/VListGroup";
import ListSubGroup from "@/layouts/dashboard/components/ListSubGroup";
// Utilities
import { toSvg } from "jdenticon";
import { sync } from "vuex-pathify";

export default {
  name: "DefaultListGroup",
  components: {
    ListSubGroup,
    DefaultListItem,
    VListGroup,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({ model: null }),
  computed: {
    ...sync("user", ["activeColor", "drawerColor"]),
    group() {
      return this.item.group || this.genGroup(this.item.items);
    },
    icon() {
      if (!this.item.icon) return undefined;

      const [off, on] = this.item.icon.split(":");

      return this.model ? on || off : off;
    },
    computedText() {
      if (!this.item || !this.item.title) return "";

      let text = "";

      this.item.title.split(" ").forEach((val) => {
        if (val.length > 2) text += val.substring(0, 1);
      });

      return text;
    },
    identicon() {
      return toSvg(this.item.avatar, 40);
    },
    textColor() {
      const bg = ![
        "rgba(228, 226, 226, 0.3), rgba(255, 255, 255, 0.8)",
        "rgba(33, 147, 176, .2), rgba(109, 213, 237, .6)",
      ].includes(this.drawerColor);
      return bg ? "white" : "grey darken-1";
    },
  },
  methods: {
    genGroup(items) {
      return items
        .reduce((acc, cur) => {
          acc.push(cur.items ? this.genGroup(cur.items) : this.getTo(cur));
          return acc;
        }, [])
        .join("|");
    },
    getTo(item) {
      const parent = item.group || this.item.group;
      let to = {
        href: "",
      };
      if (typeof item.to === "object") {
        to = this.$router.resolve(item);
      }
      if (typeof item.to === "string") {
        to = {
          href: item.to,
        };
      }
      return `${parent}/${to.href}`;
    },
  },
};
</script>

<style>
.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
