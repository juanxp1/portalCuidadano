<template>
  <div
    class="rotating-card-container"
    :class="{ 'manual-flip': manualRotate, hover: manualRotateState }"
  >
    <v-card class="v-card__rotate" v-bind="$attrs">
      <div
        class="front align-content-center justify-center"
        :class="{ 'front-background': layerBackground }"
        :style="bgFrontFullCards(frontCardImage)"
      >
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="12" sm="12" md="12" class="mx-auto">
              <v-card-text v-if="$slots.frontRotateCardContent">
                <slot name="frontRotateCardContent" />
              </v-card-text>
              <v-card-actions v-if="$slots.frontCardAction">
                <slot name="frontCardAction" />
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div
        class="back align-content-center justify-center"
        :class="{ 'back-background': layerBackground }"
        :style="bgBackFullCards(backCardImage)"
      >
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="12" sm="12" md="12" class="mx-auto">
              <v-card-text v-if="$slots.backRotateCardContent">
                <slot name="backRotateCardContent" />
              </v-card-text>
              <v-card-actions v-if="$slots.backCardAction">
                <slot name="backCardAction"></slot>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </div>
</template>

<script>
import { VCard } from "vuetify/lib";
export default {
  name: "MaterialRotatingCard",
  extends: VCard,
  props: {
    frontCardImage: String,
    backCardImage: String,
    cardClass: String,
    cardBg: String,
    layerBackground: Boolean,
    manualRotate: Boolean,
    manualRotateState: Boolean,
    ...VCard.props,
  },
  methods: {
    bgFrontFullCards(frontCardImage) {
      if (this.frontCardImage) {
        return {
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.42)), url(${frontCardImage})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        };
      }
    },

    bgBackFullCards(backCardImage) {
      if (this.backCardImage) {
        return {
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${backCardImage})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        };
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.rotating-card-container
  -webkit-perspective: 1000px
  -moz-perspective: 1000px
  -o-perspective: 1000px
  perspective: 1000px
.rotating-card-container
  .v-card__rotate
    background: transparent
.rotating-card-container
  .v-card__rotate:after
    display: none
.rotating-card-container
  .v-card__rotate
    -moz-transition: all .8s cubic-bezier(.34,1.45,.7,1)
    -moz-transform-style: preserve-3d
    -o-transition: all .8s cubic-bezier(.34,1.45,.7,1)
    -o-transform-style: preserve-3d
    transform-style: preserve-3d
    -webkit-transition: all .8s cubic-bezier(.34,1.45,.7,1)
    transition: all .8s cubic-bezier(.34,1.45,.7,1)
    -webkit-transform-style: preserve-3d
    position: relative
.back,
.front
  -webkit-backface-visibility: hidden
  -moz-backface-visibility: hidden
  -o-backface-visibility: hidden
  backface-visibility: hidden
  position: absolute
  border-radius: 6px
  top: 0
  left: 0
.front
  position: relative
  z-index: 2
.rotating-card-container
  .v-card__rotate
    .back
      -webkit-transform: rotateY(180deg)
      -moz-transform: rotateY(180deg)
      -o-transform: rotateY(180deg)
      transform: rotateY(180deg)
      text-align: center
      width: 100%
      height: 100%
.rotating-card-container.hover.manual-flip .v-card__rotate,
.rotating-card-container:not(.manual-flip):hover .v-card__rotate
  -webkit-transform: rotateY(180deg)
  -moz-transform: rotateY(180deg)
  -o-transform: rotateY(180deg)
  transform: rotateY(180deg)
  background: transparent
.back-background
  .v-card__text
    min-height: auto
    padding-top: 15px
    padding-bottom: 15px
.rotating-card-container .v-card__rotate .back,
.rotating-card-container .v-card__rotate .back .v-card__text,
.rotating-card-container .v-card__rotate .front,
.rotating-card-container .v-card__rotate .front .v-card__text
  -webkit-box-pack: center
  -ms-flex-pack: center
  justify-content: center
  -ms-flex-line-pack: center
  align-content: center
  display: -webkit-box
  display: -ms-flexbox
  display: flex
  -webkit-box-orient: vertical
  -webkit-box-direction: normal
  -ms-flex-direction: column
  flex-direction: column
@media (-ms-high-contrast: none), screen and (-ms-high-contrast: active)
  .rotating-card-container .v-card__rotate .back,
  .rotating-card-container .v-card__rotate .front
    -webkit-backface-visibility: visible
    backface-visibility: visible
  .rotating-card-container .v-card__rotate .back
    visibility: hidden
    -webkit-transition: visibility .3s cubic-bezier(.34,1.45,.7,1)
    transition: visibility .3s cubic-bezier(.34,1.45,.7,1)
  .rotating-card-container .v-card__rotate .front
    z-index: 4
  .rotating-card-container.manual-flip.hover .v-card__rotate .back,
  .rotating-card-container:not(.manual-flip):hover .v-card__rotate .back
    z-index: 5
    visibility: visible
</style>
