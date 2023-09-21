<template>
  <v-card
    :id="label"
    tag="section"
    v-bind="$attrs"
    color="transparent"
    flat
    :title="!!subtitle ? $t(subtitle) : undefined"
    :class="classes"
  >
    <v-avatar v-if="!infoHorizontal && icon" size="70">
      <v-icon :color="iconColor" :size="iconSize">{{ icon }}</v-icon>
    </v-avatar>
    <v-card-title v-show="!!subtitle" color="transparent" class="v-list">
      <div class="v-list-item">
        <v-avatar
          v-if="infoHorizontal && icon"
          :size="$vuetify.breakpoint.smAndDown ? 20 : 40"
          color="transparent"
          class="v-list-item__avatar"
        >
          <v-icon
            :size="$vuetify.breakpoint.smAndDown ? 20 : 40"
            :color="iconColor"
            v-text="icon"
          />
        </v-avatar>
        <div class="v-list-item__content">
          <h1
            :id="`${label}-title`"
            tabindex="0"
            class="v-heading font-weight-bold display-serif-2"
          >
            <i18n v-if="!!subtitle" :path="subtitle" />
            <a
              v-if="!!label"
              :href="label ? `#${label}` : undefined"
              aria-hidden="true"
              class="text-decoration-none text-right text-md-left"
              @click="onClick"
            >
              #
            </a>
          </h1>
          <h2
            v-if="subheader"
            tabindex="0"
            class="v-list-item__subtitle"
            v-text="$t(subheader)"
          />
        </div>
      </div>
    </v-card-title>
    <v-card-text tag="article" class="font-weight-light grey--text">
      <slot></slot>
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
import slugify from "@/util/slugify";
import { v4 as uuidv4 } from "uuid";
import { get } from 'vuex-pathify'
export default {
  name: "InfoContent",
  props: {
    icon: {
      type: String,
      //default: "mdi-view-dashboard"
    },
    iconColor: {
      type: String,
      default: "info",
    },
    iconSize: {
      type: Number,
      default: 61.6,
    },
    subtitle: String,
    subheader: String,
    textCenter: Boolean,
    textRight: Boolean,
    textLeft: Boolean,
    infoHorizontal: Boolean,
  },
  computed: {
    hash: get("route/hash"),
    label() {
      return slugify(this.$t(this.subtitle) || uuidv4(), {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: this.$i18n.locale, // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });
    },
    classes() {
      return {
        "mx-auto pb-4 px-2": true,
        "info-horizontal text-left": this.infoHorizontal,
        "text-right": this.textRight,
        "text-left": this.textLeft,
        "text-center": this.textCenter,
      };
    },
  },
  methods: {
    onClick(e) {
      e.preventDefault();

      const hash = this.label ? `#${this.label}` : undefined;

      if (this.hash === hash) return;

      this.$router.push({ hash });
      this.$vuetify.goTo(hash);
    },
  },
};
</script>

<style lang="sass" scoped>
.v-heading
  display: inline-block
  position: relative
  > a
    bottom: 0
    display: inline-block
    left: 0
    margin: 0 -.7em
    position: absolute
    right: 0
    top: 0
    &:not(:hover):not(:focus)
      opacity: 0
.info-title
  margin-top: 30px
</style>
