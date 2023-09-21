<template>
  <v-card
    flat
    color="transparent"
    height="150"
    class="rounded ma-1 align-center justify-center text-center"
  >
    <v-row dense class="pa-0 ma-0 mx-auto">
      <v-col cols="12" class="pa-0 ma-0">
        <v-avatar rounded size="80" class="my-2">
          <v-img
            :alt="text"
            :src="img"
            :lazy-src="img"
            class="mx-auto"
            contain
            height="80"
            width="80"
          >
            <template #placeholder>
              <v-img
                alt="Image"
                :src="placeholder"
                :lazy-src="placeholder"
                class="mx-auto"
                aspect-ratio="16/9"
                height="80"
                width="80"
                @error="onError"
              >
                <v-overlay absolute opacity="0.5">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                    size="50"
                  />
                </v-overlay>
              </v-img>
            </template>
          </v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12" class="pa-0 ma-0">
        <v-chip
          close
          color="primary"
          small
          :disabled="loading"
          @click:close="$emit('click:close', index)"
        >
          <v-icon small left>mdi-file</v-icon>
          {{ text }}
        </v-chip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mimes } from "@/models/mimes";
import { humanReadableFileSize, thumbnailPdf } from "@/util/helpers";

export default {
  name: "AppThumbnail",
  props: {
    loading: Boolean,
    showSize: Boolean,
    index: Number,
    file: {
      type: File,
      required: true,
    },
    truncateLength: {
      type: [Number, String],
      default: 22,
    },
  },
  mounted() {
    this.getThumbnail();
  },
  watch: {
    file() {
      this.getThumbnail();
    },
  },
  data: () => ({
    img: null,
    placeholder: require("@/assets/img/dashboard/docs/text.png"),
  }),
  methods: {
    onError() {
      this.img = this.placeholder;
    },
    truncateText(str) {
      if (str.length < Number(this.truncateLength)) return str;
      const charsKeepOneSide = Math.floor(
        (Number(this.truncateLength) - 1) / 2
      );
      return `${str.slice(0, charsKeepOneSide)}…${str.slice(
        str.length - charsKeepOneSide
      )}`;
    },
    async getThumbnail() {
      if (this.file.type === "application/pdf") {
        try {
          this.img = await thumbnailPdf(this.file);
        } catch (e) {
          this.img = require("@/assets/img/dashboard/docs/pdf.png");
        }
      } else if ((this.file.type || "").includes("image")) {
        try {
          this.img = URL.createObjectURL(this.file);
        } catch (e) {
          this.img = require("@/assets/img/dashboard/docs/image.png");
        }
      } else if (mimes.excelMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/xls.png");
      } else if (mimes.documentMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/doc.png");
      } else if (mimes.powerPointMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/ppt.png");
      } else if (mimes.audioMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/music.png");
      } else if (mimes.textMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/txt.png");
      } else if (mimes.videoMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/video.png");
      } else if (mimes.fontsMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/font-file.png");
      } else if (mimes.compressedMimes.includes(this.file.type)) {
        this.img = require("@/assets/img/dashboard/docs/zip.png");
      } else {
        this.img = require("@/assets/img/dashboard/docs/text.png");
      }
    },
  },
  computed: {
    base() {
      return typeof this.showSize !== "boolean" ? this.showSize : undefined;
    },
    text() {
      const { name = "", size = 0 } = this.file;
      const truncatedText = this.truncateText(name);
      return !this.showSize
        ? truncatedText
        : `${truncatedText} (${humanReadableFileSize(
            size,
            this.base === 1024
          )})`;
    },
  },
};
</script>

<style scoped></style>
