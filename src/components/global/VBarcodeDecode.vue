<template>
  <v-window v-model="step" touchless>
    <v-window-item :value="0">
      <v-validation-observer ref="form" v-slot="{ handleSubmit, invalid }">
        <v-form @submit.prevent="handleSubmit(onDecode)">
          <v-validation-provider
            v-slot="{ errors }"
            :rules="{ required: true }"
            vid="format"
            :name="$t('scan.format').toLowerCase()"
          >
            <v-select
              id="format"
              v-model="format"
              prepend-icon="mdi-dots-horizontal"
              :label="$t('scan.format')"
              :items="names"
              :loading="loading || decoding"
              :disabled="loading || decoding"
              item-text="name"
              item-value="id"
              required
              clearable
              :error-messages="errors"
              name="format"
            />
          </v-validation-provider>
          <v-validation-provider
            v-slot="{ errors }"
            :rules="validations"
            vid="file"
            :name="$t('portal.forms.beneficiary.document').toLowerCase()"
          >
            <app-drop-zone
              ref="dropzone"
              id="pdf_417"
              name="pdf_417"
              v-model="lazyValue"
              show-size
              clearable
              :accept="mimes"
              :loading="loading || decoding"
              :disabled="loading || decoding"
              :error-messages="errors"
            />
          </v-validation-provider>
          <app-btn
            :block="$vuetify.breakpoint.smAndDown"
            :loading="loading || decoding"
            :disabled="loading || invalid || decoding"
            class="mt-4"
            color="primary"
            path="buttons.Validate"
            type="submit"
          />
        </v-form>
      </v-validation-observer>
    </v-window-item>
    <v-window-item :value="1">
      <v-card flat color="transparent">
        <template v-if="error">
          <v-card-text class="text-center">
            <v-alert type="error" colored-border border="left">
              <i18n class="caption" path="scan.barcode_error" />
            </v-alert>
            <app-btn
              v-if="!hideRetryButton"
              :small="retrySmallButton"
              outlined
              color="primary"
              path="scan.retry"
              @click="onRetry"
            />
          </v-card-text>
          <i18n tag="p" class="caption" path="scan.app">
            <app-btn
              slot="app"
              text
              x-small
              target="_blank"
              color="primary"
              href="https://acrobat.adobe.com/la/es/acrobat/mobile/scanner-app.html"
              icon-text="mdi-open-in-new"
              path="Adobe Scan"
            />
          </i18n>
        </template>
        <template v-else>
          <v-card-text class="text-center">
            <i18n path="scan.success" class="display-serif-2" />
          </v-card-text>
          <v-card-text>
            <app-animation
              :animation-data="successAnim"
              loop
              auto-play
              width="200"
            />
          </v-card-text>
        </template>
      </v-card>
    </v-window-item>
  </v-window>
</template>

<script>
import * as success from "@/assets/anims/success.json";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import BarcodeJS from "@/util/BarcodeJS";
import DocumentParser from "@/util/DocumentParser";
export default {
  name: "VBarcodeDecode",
  props: {
    loading: Boolean,
    accept: {
      type: [Array, String],
      default: () => [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/tiff",
        "application/pdf",
      ],
    },
    retrySmallButton: Boolean,
    hideRetryButton: Boolean,
  },
  data: (vm) => ({
    successAnim: success.default,
    errorAnim: null,
    step: 0,
    error: false,
    decoding: false,
    lazyValue: null,
    codeReader: new BrowserMultiFormatReader(),
    hints: new Map(),
    formats: [BarcodeFormat.PDF_417],
    validations: {
      required: true,
      mimes: vm.accept,
      size: 12000,
    },
    names: [
      { id: "full", name: "2 nombres y 2 apellidos" },
      { id: "one_name", name: "1 nombre y 2 apellidos" },
      { id: "one_surname", name: "2 nombres y 1 apellido" },
      { id: "one_and_one", name: "1 nombre y 1 apellido" },
      { id: "more", name: "Otro" },
    ],
    format: null,
  }),
  computed: {
    internalValue: {
      get() {
        return this.lazyValue;
      },
      set(val) {
        this.lazyValue = val;
        this.$emit("input", this.lazyValue);
        this.$emit("change", this.lazyValue);
      },
    },
    mimes() {
      const mimes = [];
      if (typeof this.accept === "string") {
        mimes.push(
          this.accept.split(",").filter((i) => {
            return (i || "").trim() !== "";
          })
        );
      } else {
        mimes.push(this.accept);
      }
      return mimes.join(",");
    },
  },
  methods: {
    onDecode() {
      if (this.lazyValue.type === "application/pdf") {
        this.decoding = true;
        this.decodePDF();
      } else if (
        ["image/png", "image/jpg", "image/jpeg", "image/tiff"].includes(
          this.lazyValue.type
        )
      ) {
        this.decoding = true;
        this.decodeFile();
      } else {
        this.$snackbar.error("Provide a valid file.");
      }
    },
    decodePDF() {
      const that = this;
      // select the input file
      const inputFile = document.getElementById("pdf_417");
      if (inputFile.value === "") {
        this.$snackbar.error("File required.");
        return false;
      }
      const configs = {};
      // create callback which handles the result
      const callback = function (result) {
        if (result.success) {
          const decode = result.codes.length ? result.codes[0] : result.codes;
          if (typeof decode === "string") {
            that.step = 1;
            that.error = false;
            that.internalValue = that.lazyValue;
            that.$emit("decode", that.extractColDocumentData(decode));
          } else {
            that.step = 1;
            that.error = true;
            that.internalValue = that.lazyValue;
            that.$emit("error", that.$t("scan.barcode_error"));
          }
        } else {
          that.step = 1;
          that.error = true;
          that.internalValue = that.lazyValue;
          that.$emit("error", that.$t("scan.barcode_error"));
        }
        that.decoding = false;
      };
      const reader = new BarcodeJS();
      reader.decodeDocument(inputFile, configs, callback);
    },
    decodeFile() {
      this.decoding = true;
      const reader = new FileReader();
      reader.onload = this.processFile;
      reader.readAsDataURL(this.lazyValue);
    },
    processFile(e) {
      this.hints.set(DecodeHintType.POSSIBLE_FORMATS, this.formats);
      this.codeReader = new BrowserMultiFormatReader(this.hints);
      this.codeReader
        .decodeFromImage(undefined, e.target.result)
        .then((result) => {
          this.step = 1;
          this.error = false;
          this.internalValue = this.lazyValue;
          this.$emit("decode", this.extractColDocumentData(result.text));
        })
        .catch((error) => {
          this.step = 1;
          this.error = true;
          this.internalValue = this.lazyValue;
          this.$emit("error", error);
        })
        .finally(() => {
          this.decoding = false;
        });
    },
    extractColDocumentData(data) {
      return new DocumentParser(data, this.format).parse();
    },
    onRetry() {
      this.step = 0;
      this.$nextTick(function () {
        this.error = false;
        this.$refs.dropzone.clearableCallback();
      });
    },
  },
};
</script>
