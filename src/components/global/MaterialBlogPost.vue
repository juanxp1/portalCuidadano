<template>
  <v-card
    tag="section"
    :title="title"
    :aria-label="title"
    v-bind="$attrs"
    flat
    class="mx-auto"
  >
    <v-container>
      <v-row>
        <v-col
          v-if="!reverse || vertical"
          tag="figure"
          cols="12"
          sm="12"
          :md="vertical ? 12 : 6"
          class="hover-scale-img"
        >
          <v-img
            v-if="symmetrical"
            :eager="true"
            class="bw-shadow-img rounded elevation-12 mx-auto"
            min-height="200"
            max-height="200"
            :alt="title"
            aspect-ratio="16/9"
            :src="image"
            :lazy-src="image"
          />
          <v-img
            v-else
            :eager="true"
            :alt="title"
            class="bw-shadow-img elevation-12 mx-auto"
            :max-width="vertical ? 900 : 400"
            :src="image"
            :lazy-src="image"
          />
          <figcaption class="d-sr-only" v-text="$t(title)" />
        </v-col>
        <v-col
          sm="12"
          :md="vertical ? 12 : 6"
          cols="12"
          :class="centered && vertical ? 'text-center' : 'text-left'"
        >
          <v-row class="flex-column ma-0 fill-height" justify="center">
            <v-col class="px-0">
              <h6
                tabindex="0"
                class="body-2 text-uppercase font-weight-bold"
                :class="`${iconColor}--text`"
              >
                <v-icon :color="iconColor" left>{{ icon }}</v-icon>
                {{ category }}
              </h6>
              <h1 tabindex="0" class="display-serif-2 font-weight-bold">
                {{ title }}
              </h1>
            </v-col>

            <v-col class="px-0 grey--text">
              <slot></slot>
            </v-col>

            <v-col class="px-0 grey--text">
              <slot name="author"></slot>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="reverse && !vertical"
          tag="figure"
          cols="12"
          sm="12"
          md="6"
        >
          <v-img
            v-if="symmetrical"
            eager
            :alt="title"
            class="bw-shadow-img rounded elevation-12 mx-auto"
            min-height="200"
            max-height="200"
            aspect-ratio="16/9"
            :src="image"
            :lazy-src="image"
          />
          <v-img
            v-else
            eager
            :alt="title"
            class="bw-shadow-img elevation-12 hover-scale-img mx-auto"
            max-width="400"
            :lazy-src="image"
            :src="image"
          />
          <figcaption class="d-sr-only" v-text="$t(title)" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "MaterialBlogPost",
  props: {
    reverse: Boolean,
    vertical: Boolean,
    centered: Boolean,
    symmetrical: Boolean,
    image: {
      type: String,
      default: require("@/assets/img/auth/login.jpg"),
    },
    icon: {
      type: String,
      default: "mdi-post",
    },
    iconColor: {
      type: String,
      default: "primary",
    },
    category: String,
    title: String,
  },
  methods: {
    shadowImageProfile(image) {
      return {
        backgroundImage: `url(${image})`,
        opacity: 1,
      };
    },
  },
};
</script>
