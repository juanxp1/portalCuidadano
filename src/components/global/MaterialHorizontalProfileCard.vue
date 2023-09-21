<template>
  <v-card class="text-center" v-bind="$attrs">
    <div
      :class="[
        {
          'flex-wrap align-center': $vuetify.breakpoint.smAndDown,
          'justify-space-between align-content-center d-flex flex-no-wrap':
            $vuetify.breakpoint.mdAndUp,
        },
      ]"
    >
      <div
        v-if="$vuetify.breakpoint.mdAndUp"
        class="color-shadow-img"
        :style="shadowImageProfile(avatar)"
      ></div>
      <v-avatar
        :class="$vuetify.breakpoint.smAndDown ? 'elevation-12' : ''"
        style="border-radius: 6px"
        :size="size"
        tile
      >
        <v-img
          style="z-index: 1"
          :alt="`${author}`"
          :src="avatar"
          :lazy-src="avatar"
        >
        </v-img>
      </v-avatar>
      <div>
        <v-card-text :class="centered ? '' : 'mt-n5'">
          <h3
            class="display-serif-1 font-weight-black text-md-left text-sm-center"
            v-text="author"
            :class="[{ 'mb-3': position }]"
          ></h3>
          <h6 v-if="position" class="body-2 mb-1 grey--text mb-3">
            {{ position }}
          </h6>
          <slot></slot>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "MaterialHorizontalProfileCard",
  props: {
    position: String,
    author: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: require("@/assets/img/dashboard/profile/default.webp"),
    },
    size: {
      type: [String, Number],
      default: 100,
    },
    centered: Boolean,
  },
  methods: {
    shadowImageProfile(image) {
      return {
        maxWidth: `${this.size}px`,
        maxHeight: `${this.size}px`,
        backgroundImage: `url(${image})`,
        opacity: 1,
      };
    },
  },
};
</script>

<style lang="sass" scoped></style>
