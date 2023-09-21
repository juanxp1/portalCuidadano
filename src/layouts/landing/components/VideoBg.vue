<template>
  <section class="v-video-bg">
    <div v-if="youtube" class="v-video-bg__youtube">
      <iframe
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        frameborder="0"
        height="100%"
        width="100%"
        :src="`${youtube}${complement}`"
      >
      </iframe>
    </div>
    <video v-else autoplay playsinline :poster="img" loop :muted="muted" ref="video">
      <source
        v-for="source in sources"
        :src="source"
        :key="source.key"
        :type="getMediaType(source)"
      />
    </video>
    <div class="v-video-bg__content">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: "VVideoBg",
  props: {
    sources: {
      type: Array,
      default: () => [],
    },
    youtube: String,
    img: {
      type: String,
    },
    muted: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      videoRatio: null,
      complement:
        "?version=3&controls=0&autoplay=1&loop=1&modestbranding=1&showinfo=0&rel=0&playsinline=1&mute=1",
    };
  },
  mounted() {
    if (!this.youtube) {
      this.setImageUrl();
      this.setContainerHeight();
      if (this.videoCanPlay()) {
        this.$refs.video.oncanplay = () => {
          if (!this.$refs.video) return;
          this.videoRatio =
            this.$refs.video.videoWidth / this.$refs.video.videoHeight;
          this.setVideoSize();
          this.$refs.video.style.visibility = "visible";
        };
      }
    }
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    resize() {
      this.setContainerHeight();
      if (this.videoCanPlay()) {
        this.setVideoSize();
      }
    },
    videoCanPlay() {
      return !!this.$refs.video.canPlayType;
    },
    setImageUrl() {
      if (this.img) {
        this.$el.style.backgroundImage = `url(${this.img})`;
      }
    },
    setContainerHeight() {
      this.$el.style.height = `${window.innerHeight}px`;
    },
    setVideoSize() {
      var width,
        height,
        containerRatio = this.$el.offsetWidth / this.$el.offsetHeight;
      if (containerRatio > this.videoRatio) {
        width = this.$el.offsetWidth;
      } else {
        height = this.$el.offsetHeight;
      }
      this.$refs.video.style.width = width ? `${width}px` : "auto";
      this.$refs.video.style.height = height ? `${height}px` : "auto";
    },
    getMediaType(src) {
      return "video/" + src.split(".").pop();
    },
  },
};
</script>

<style lang="sass" scoped>
.v-video-bg
  position: relative
  background-size: cover
  background-position: center
  overflow: hidden
  min-height: 100vh
  video
    position: absolute
    top: 50%
    left: 50%
    visibility: hidden
    transform: translate(-50%, -50%)
  .v-video-bg__youtube
    position: absolute
    margin: 0
    width: 100%
    height: 100%
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
.v-video-bg__content
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, .5)
</style>
