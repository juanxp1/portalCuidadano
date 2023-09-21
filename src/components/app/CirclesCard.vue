<template>
  <kinesis-container class="cover">
    <kinesis-element
      tag="div"
      class="circle darkgreenposition hidden-sm-and-down"
      :strength="-20"
      type="depth"
    >
      <div class="smooth darkgreencolor" style="transform: scale(1.00286)" />
    </kinesis-element>
    <kinesis-element
      tag="div"
      class="circle yellowgreenposition hidden-sm-and-down"
      :strength="-10"
      type="depth"
    >
      <div class="smooth yellowgreencolor" style="transform: scale(1.00286)" />
    </kinesis-element>
    <kinesis-element class="cover-container" :strength="-10" type="depth">
      <v-card
        tag="figure"
        color="transparent"
        :title="$t(title)"
        :aria-label="$t(title)"
        class="text-center smooth"
        :class="classes"
      >
        <v-img
          min-height="150"
          max-height="150"
          :alt="$t(title)"
          aspect-ratio="16/9"
          :src="src"
          :lazy-src="src"
          class="align-center"
        >
          <v-overlay
            absolute
            :opacity="opacity"
            class="align-center text-center"
          >
            <v-card-title
              tag="h1"
              tabindex="0"
              class="mb-2 text-center align-center"
              :class="titleClass"
            >
              <v-icon left class="hidden-sm-and-down" v-text="icon" />
              {{ $t(title) }}
            </v-card-title>
            <v-card-actions class="text-center mx-auto justify-center">
              <app-btn
                :path="btnText"
                tabindex="0"
                color="white"
                outlined
                rounded
                :to="to"
              />
            </v-card-actions>
            <figcaption class="d-sr-only" v-text="$t(title)" />
          </v-overlay>
        </v-img>
      </v-card>
    </kinesis-element>
    <kinesis-element
      tag="div"
      class="circle brightgreenposition hidden-sm-and-down"
      :strength="20"
      type="depth"
    >
      <div class="smooth brightgreencolor" style="transform: scale(1.00286)" />
    </kinesis-element>
  </kinesis-container>
</template>

<script>
import { KinesisContainer, KinesisElement } from "vue-kinesis";
export default {
  name: "AppCirclesCard",
  props: {
    title: {
      type: String,
      default: undefined,
    },
    titleClass: {
      type: String,
      default: "display-serif-2",
    },
    icon: {
      type: String,
      default: "mdi-text",
    },
    btnText: {
      type: String,
      default: "label.see_more",
    },
    opacity: {
      type: String,
      default: "0.6",
    },
    to: {
      type: Object,
      default: () => ({}),
    },
    src: {
      type: String,
      default: require("@/assets/img/auth/login.jpg"),
    },
  },
  components: {
    KinesisContainer,
    KinesisElement,
  },
  computed: {
    classes() {
      return this.$vuetify.breakpoint.mdAndUp ? "img" : "";
    },
  },
};
</script>

<style scoped>
.cover {
  margin-top: 16px;
  margin-bottom: 16px;
  position: relative;
}
.cover-container {
  text-align: center;
}
.circle {
  border-radius: 100%;
  position: absolute;
}
.circle.yellowgreenposition {
  top: -30px;
  left: 50px;
}
.circle .yellowgreencolor {
  background-color: #d8f235;
  width: 90px;
  height: 90px;
  border-radius: 100%;
}
.circle.brightgreenposition {
  bottom: -20px;
  right: 50px;
}
.circle .brightgreencolor {
  border: 4px solid #594d95;
  border-radius: 100%;
  width: 80px;
  height: 80px;
}
.circle.darkgreenposition {
  top: -20px;
  left: 50px;
}
.circle .darkgreencolor {
  background-color: #19ad9b;
  width: 150px;
  height: 150px;
  border-radius: 100%;
}
.smooth {
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
}
.img {
  width: 70%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  display: inline-block;
}
</style>
