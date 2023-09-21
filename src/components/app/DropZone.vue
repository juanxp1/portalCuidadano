<template>
  <v-sheet
    ref="dropzone"
    tabindex="0"
    :title="$t('dropzone.title')"
    :aria-label="$t('dropzone.title')"
    width="100%"
    :style="pointer"
    class="v-dropzone rounded pa-2"
    :class="classes"
    role="button"
  >
    <input
      ref="input"
      :id="id"
      :name="name || id"
      :disabled="disabled"
      :multiple="multiple"
      type="file"
      :accept="accept"
      style="display: none"
    />
    <v-card :loading="loading" flat color="transparent" class="text-center">
      <v-toolbar flat color="transparent" dense max-height="30">
        <v-slide-y-reverse-transition>
          <v-toolbar-title v-if="internalArrayValue.length">
            <v-icon
              :aria-label="computedLabel"
              :color="computedColor"
              v-text="computedIcon"
              left
            />
            <span
              class="title"
              :class="computedTextColor.class"
              :style="computedTextColor.style"
              v-text="computedLabel"
            />
          </v-toolbar-title>
        </v-slide-y-reverse-transition>
        <v-spacer></v-spacer>
        <app-btn
          v-if="clearable && internalArrayValue.length"
          path="buttons.Clear"
          icon-text="mdi-close"
          icon
          @click="clearableCallback"
        />
      </v-toolbar>
      <v-card-text>
        <v-row
          dense
          justify="space-between"
          align="center"
          align-content="center"
        >
          <v-col v-if="!internalArrayValue.length" cols="12">
            <div>
              <v-icon
                :aria-label="computedLabel"
                :color="computedColor"
                size="75"
                v-text="computedIcon"
              />
            </div>
            <div>
              <span
                class="title"
                :class="computedTextColor.class"
                :style="computedTextColor.style"
                v-text="computedLabel"
              />
            </div>
          </v-col>
          <v-col cols="auto">
            <v-slide-y-reverse-transition
              group
              class="d-flex flex-row flex-wrap"
            >
              <app-thumbnail
                v-for="(file, i) in internalArrayValue"
                :file="file"
                :index="i"
                :show-size="showSize"
                :loading="loading"
                @click:close="onClickClose"
                :key="i"
              />
            </v-slide-y-reverse-transition>
          </v-col>
          <v-slide-y-reverse-transition>
            <v-col v-if="errorText" cols="12">
              <div
                class="v-messages"
                :class="computedTextColor.class"
                :style="computedTextColor.style"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <div
                    class="v-messages__message"
                    v-text="internalErrorMessages[0]"
                  />
                </div>
              </div>
            </v-col>
          </v-slide-y-reverse-transition>
        </v-row>
      </v-card-text>
      <v-overlay :value="loading" absolute>
        <v-progress-circular color="primary" indeterminate size="64" />
      </v-overlay>
    </v-card>
  </v-sheet>
</template>

<script>
import { wrapInArray, isCssColor } from "@/util/helpers";
import Themeable from "vuetify/lib/mixins/themeable";
import Validatable from "vuetify/lib/mixins/validatable";

export default {
  name: "AppDropZone",
  mixins: [Themeable, Validatable],
  props: {
    id: {
      type: String,
      default: "input-drop-zone",
    },
    name: String,
    label: {
      type: String,
      default: "dropzone.drag",
    },
    color: String,
    icon: {
      type: String,
      default: "mdi-cloud-upload-outline",
    },
    iconHover: {
      type: String,
      default: "mdi-book-plus",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    loading: Boolean,
    multiple: Boolean,
    showSize: Boolean,
    disabled: Boolean,
    truncateLength: {
      type: [Number, String],
      default: 22,
    },
    accept: String,
    hint: String,
    errorMessages: {
      type: Array,
      default: () => [],
    },
    toBase64: Boolean,
    persistentHint: Boolean,
  },
  data: () => ({
    initialValue: null,
    lazyValue: null,
    formUpload: false,
    dragover: false,
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const dropzone = this.$el;
      const fileUpload = this.$refs.input;
      this.listeners(dropzone, fileUpload);
    },
    listeners(dropzone, fileUpload) {
      // register listeners on your dropzone / v-sheet
      if (dropzone && !this.disabled) {
        // register all drag & drop event listeners
        dropzone.addEventListener("dragenter", (e) => {
          e.preventDefault();
          this.dragover = true;
        });
        dropzone.addEventListener("dragleave", (e) => {
          e.preventDefault();
          this.dragover = false;
        });
        dropzone.addEventListener("dragover", (e) => {
          e.preventDefault();
          this.dragover = true;
        });
        dropzone.addEventListener("drop", (e) => {
          e.preventDefault();
          const dragEvent = e;
          if (dragEvent.dataTransfer) {
            this.onInput(dragEvent.dataTransfer.files);
          }
        });
        // register event listener for keyboard usage
        dropzone.addEventListener("click", () => {
          if (fileUpload) {
            fileUpload.click();
          }
        });
        dropzone.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            if (fileUpload) fileUpload.click();
          }
        });
        // register listeners on the file input
        if (fileUpload) {
          fileUpload.addEventListener("change", (e) => {
            const target = e.target;
            if (target.files) {
              this.onInput(target.files);
            }
          });
        }
      }
    },
    onInput(fileList) {
      this.dragover = false;
      const files = [...(fileList || [])];
      this.internalValue = this.multiple ? files : files[0];
    },
    onClickClose(index) {
      if (this.multiple) {
        const internalValue = this.internalValue;
        internalValue.splice(index, 1);
        this.internalValue = internalValue; // Trigger the watcher
      } else {
        this.clearableCallback();
      }
    },
    clearableCallback() {
      this.internalValue = this.multiple ? [] : null;
      this.$refs.input.value = "";
    },
    // Error Messages
    genInternalMessages(messages = null) {
      if (!messages) return [];
      else if (Array.isArray(messages)) return messages;
      else return [messages];
    },
  },
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
    internalArrayValue() {
      return wrapInArray(this.internalValue);
    },
    computedLabel() {
      return this.dragover ? this.$t("dopzone.dragover") : this.$t(this.label);
    },
    computedIcon() {
      return this.dragover ? this.iconHover : this.icon;
    },
    errorText() {
      return this.errorMessages[0] ? this.errorMessages[0] : null;
    },
    internalErrorMessages() {
      return this.genInternalMessages(this.errorMessages);
    },
    computedColor() {
      if (this.disabled) return undefined;
      if (this.hasError) return "error";
      if (this.color) return this.color;
      // It's assumed that if the input is on a
      // dark background, the user will want to
      // have a white color. If the entire app
      // is setup to be dark, then they will
      // like want to use their primary color
      if (this.isDark && !this.appIsDark) return "white";
      else return "primary";
    },
    computedTextColor() {
      const color = this.computedColor;
      let data = {
        style: {},
        class: {},
      };
      if (isCssColor(color)) {
        data.style = {
          color: `${color}`,
          "caret-color": `${color}`,
        };
      } else if (color) {
        const [colorName, colorModifier] = color
          .toString()
          .trim()
          .split(" ", 2);
        data.class = {
          [colorName + "--text"]: true,
        };
        if (colorModifier) {
          data.class["text--" + colorModifier] = true;
        }
      }
      return data;
    },
    hasError() {
      return this.internalErrorMessages.length > 0;
    },
    validations() {
      return this.validationTarget.slice(
        0,
        Number(this.internalErrorMessages.length || 1)
      );
    },
    validationTarget() {
      if (this.internalErrorMessages.length > 0) {
        return this.internalErrorMessages;
      } else return [];
    },
    messagesToDisplay() {
      if (!this.hasHint)
        return [this.hint].filter((message) => message !== "")[0];

      if (!this.hasMessages) return [].filter((message) => message !== "")[0];

      return this.validations
        .map((validation) => {
          if (typeof validation === "string") return validation;

          const validationResult = validation(this.internalValue);

          return typeof validationResult === "string" ? validationResult : "";
        })
        .filter((message) => message !== "")[0];
    },
    classes() {
      return {
        "v-dropzone--is-disabled": this.disabled,
        "v-dropzone__error": this.hasError,
        ...this.themeClasses,
      };
    },
    themeClasses() {
      return {
        "theme--dark": this.isDark,
        "theme--light": !this.isDark,
      };
    },
    pointer() {
      return {
        cursor: this.disabled ? "not-allowed" : "pointer",
        pointerEvents: this.disabled ? "none" : "auto",
      };
    },
    hasHint() {
      return (
        !this.hasMessages &&
        !!this.hint &&
        (this.persistentHint || this.isFocused)
      );
    },
  },
};
</script>
