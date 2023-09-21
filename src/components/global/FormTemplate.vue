<template>
  <v-card :id="formId" flat color="transparent">
    <v-card-title
      v-if="withTitle"
      class="display-serif-1 justify-space-between"
    >
      <slot :name="`prepend-form-title`" />
      <span v-text="title" />
      <v-chip
        color="primary lighten-2"
        class="subheading white--text elevation-0"
        v-text="`${step + 1}/${lastIndex}`"
      />
    </v-card-title>
    <v-card-text v-if="errors.message">
      <v-alert type="error" colored-border border="left">
        {{ errors.message }}
        <v-divider v-if="errorsKeys.length > 0" class="my-4" />
        <ul v-for="(k, i) in errorsKeys" :key="i">
          <li v-for="(val, j) in errors.errors[k]" :key="`i-${j}`">
            {{ val }}
          </li>
        </ul>
        <template #close>
          <v-btn icon @click="errors = {}">
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-alert>
    </v-card-text>
    <v-window touchless v-model="step">
      <v-window-item v-for="(section, i) in sections" :value="i" :key="i">
        <v-validation-observer ref="form" v-slot="{ handleSubmit, invalid }">
          <v-form @submit.prevent="handleSubmit(onSubmit)">
            <v-card-text>
              <v-row class="mx-md-2">
                <slot
                  :name="`prepend-form-${step}`"
                  :invalid="invalid"
                  :step="step"
                  :model="form"
                />
                <v-col
                  v-for="(field, i) in section.fields"
                  cols="12"
                  :md="field.flex || 6"
                  sm="12"
                  :key="i"
                >
                  <slot
                    v-if="field.type === 'empty'"
                    :name="`empty-slot-${i}`"
                    :step="step"
                    :model="form"
                  />
                  <v-dialog
                    v-else-if="isDialog(field.type, i)"
                    :ref="`birthday_dialog_${i}`"
                    v-model="birthday_dialogs[i]"
                    :return-value.sync="form[field.name]"
                    persistent
                    width="290px"
                  >
                    <template #activator="{ on, attrs }">
                      <v-validation-provider
                        v-slot="{ errors }"
                        :rules="field.rules"
                        :vid="field.name"
                        :name="$t(`${i18n_path}.${field.name}`).toLowerCase()"
                        :key="`input-${field.name}-${i}`"
                      >
                        <v-text-field
                          v-bind="{ ...attrs, ...field.attrs }"
                          :id="field.name"
                          v-model="form[field.name]"
                          :label="
                            field.alias || $t(`${i18n_path}.${field.name}`)
                          "
                          :name="field.name"
                          type="text"
                          :prepend-icon="field.icon"
                          :loading="loading"
                          :disabled="loading || field.attrs.disabled"
                          :error-messages="errors"
                          clearable
                          v-on="on"
                        />
                      </v-validation-provider>
                    </template>
                    <v-date-picker
                      :active-picker.sync="activePicker"
                      v-model="form[field.name]"
                      v-bind="field.pickerAttrs"
                      v-on="onListeners(field.on)"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        :aria-label="$t('buttons.Cancel')"
                        text
                        color="primary"
                        @click="birthday_dialogs[i] = false"
                      >
                        {{ $t("buttons.Cancel") }}
                      </v-btn>
                      <v-btn
                        aria-label="OK"
                        text
                        color="primary"
                        @click="
                          $refs[`birthday_dialog_${i}`] &&
                            $refs[`birthday_dialog_${i}`][0].save(
                              form[field.name]
                            )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <v-validation-provider
                    v-else
                    v-slot="{ errors }"
                    :rules="field.rules"
                    :vid="field.name"
                    :name="
                      (
                        field.alias || $t(`${i18n_path}.${field.name}`)
                      ).toLowerCase()
                    "
                    :key="`input-${field.name}-${i}`"
                  >
                    <v-text-field
                      v-if="isText(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :type="field.type"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <v-text-field
                      v-else-if="['numeric', 'tel'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :type="field.type === 'numeric' ? 'text' : field.type"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      v-number-only
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <v-text-field
                      v-else-if="['password'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :type="showPassword ? 'text' : 'password'"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="showPassword = !showPassword"
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <v-select
                      v-else-if="['select'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :type="field.type"
                      :items="field.values"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      clearable
                      v-on="onListeners(field.on)"
                    >
                      <template
                        v-if="!!field.templateItem"
                        #item="{ item, on, attrs }"
                      >
                        <v-list-item two-line v-on="on" v-bind="attrs">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item[field.attrs.itemText]"
                            />
                            <v-list-item-subtitle
                              v-if="!!item[field.templateItemDescription]"
                              v-text="item[field.templateItemDescription]"
                            />
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                    <v-autocomplete
                      v-else-if="['autocomplete'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :type="field.type"
                      :items="field.values"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <v-textarea
                      v-else-if="['textarea'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :type="field.type"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <v-checkbox
                      v-else-if="['checkbox'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      v-on="onListeners(field.on)"
                    />
                    <v-barcode-decode
                      v-else-if="['barcode'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :name="field.name"
                      :loading="loading"
                      v-on="onListeners(field.on)"
                    />
                    <v-file-input
                      v-else-if="['file'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :prepend-icon="field.icon"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <app-drop-zone
                      v-else-if="['dropzone'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      show-size
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      clearable
                      v-on="onListeners(field.on)"
                    />
                    <v-radio-group
                      v-else-if="['radio'].includes(field.type)"
                      v-bind="field.attrs"
                      :id="field.name"
                      v-model="form[field.name]"
                      :label="field.alias || $t(`${i18n_path}.${field.name}`)"
                      :name="field.name"
                      :loading="loading"
                      :disabled="loading || field.attrs.disabled"
                      :error-messages="errors"
                      v-on="onListeners(field.on)"
                    >
                      <v-radio
                        v-for="(opt, i) in field.options"
                        :key="i"
                        :label="$t(opt.label)"
                        :value="opt.value"
                      />
                    </v-radio-group>
                  </v-validation-provider>
                </v-col>
                <slot
                  :name="`append-form-${step}`"
                  :invalid="invalid"
                  :step="step"
                  :model="form"
                />
              </v-row>
            </v-card-text>
            <v-card-actions>
              <slot
                :name="`prepend-form-action-${step}`"
                :invalid="invalid"
                :step="step"
                :model="form"
              />
              <v-btn
                v-if="step > 0"
                class="hidden-sm-and-down"
                color="primary"
                :aria-label="$t('buttons.Back')"
                :disabled="loading"
                :loading="loading"
                text
                @click="step--"
              >
                <v-icon left>mdi-chevron-left</v-icon>
                {{ $t("buttons.Back") }}
              </v-btn>
              <v-btn
                v-if="step > 0"
                class="hidden-md-and-up"
                color="primary"
                :aria-label="$t('buttons.Back')"
                :disabled="loading"
                :loading="loading"
                outlined
                large
                icon
                @click="step--"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-spacer />
              <v-btn
                class="hidden-md-and-up"
                :aria-label="
                  $t(step >= lastIndex - 1 ? `buttons.Submit` : `buttons.Next`)
                "
                :disabled="loading || invalid"
                :loading="loading"
                color="primary"
                fab
                type="submit"
              >
                <v-icon dark>
                  {{
                    $t(step >= lastIndex - 1 ? `mdi-send` : `mdi-chevron-right`)
                  }}
                </v-icon>
              </v-btn>
              <v-btn
                class="hidden-sm-and-down"
                :aria-label="
                  $t(step >= lastIndex - 1 ? `buttons.Submit` : `buttons.Next`)
                "
                :disabled="loading || invalid"
                :loading="loading"
                color="primary"
                depressed
                default
                type="submit"
              >
                {{
                  $t(step >= lastIndex - 1 ? `buttons.Submit` : `buttons.Next`)
                }}
                <v-icon right>
                  {{
                    $t(step >= lastIndex - 1 ? `mdi-send` : `mdi-chevron-right`)
                  }}
                </v-icon>
              </v-btn>
              <slot
                :name="`append-form-action-${step}`"
                :invalid="invalid"
                :step="step"
                :model="form"
              />
            </v-card-actions>
          </v-form>
        </v-validation-observer>
      </v-window-item>
      <v-window-item :value="sections.length">
        <v-card-text>
          <v-empty-state v-if="sending" :label="$t('label.almostDone')">
            <v-row dense align="center" justify="center" class="fill-height">
              <v-col cols="12">
                <v-animation
                  height="200"
                  width="200"
                  auto-play
                  loop
                  :animation-data="animationLoading"
                />
              </v-col>
            </v-row>
          </v-empty-state>
          <v-empty-state v-else :description="successMessage">
            <v-row dense align="center" justify="center" class="fill-height">
              <v-col cols="12">
                <v-animation
                  height="200"
                  width="200"
                  auto-play
                  loop
                  :animation-data="successAnimation"
                />
              </v-col>
              <v-col v-if="$slots.message" cols="12">
                <slot name="message" :step="step" />
              </v-col>
              <v-col v-else cols="12">
                <v-btn
                  :aria-label="$t('buttons.Back')"
                  color="primary"
                  class="mx-auto"
                  outlined
                  @click="step = 0"
                  v-text="$t('buttons.Back')"
                />
              </v-col>
            </v-row>
          </v-empty-state>
        </v-card-text>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { has } from "lodash";
import * as email from "@/assets/anims/email.json";
import * as success from "@/assets/anims/success.json";
import * as loading from "@/assets/anims/loading.json";
import { Model } from "@/models/Model";
import VAnimation from "@/components/app/Animation";
import VBarcodeDecode from "@/components/global/VBarcodeDecode";
import AppDropZone from "@/components/app/DropZone";

const texts = ["text", "number", "url", "email"];
const dialogs = [
  ...texts,
  "textarea",
  "tel",
  "numeric",
  "password",
  "select",
  "autocomplete",
  "checkbox",
  "radio",
  "barcode",
  "file",
  "dropzone",
  "empty",
];

export default {
  name: "VFormTemplate",
  components: {
    AppDropZone,
    VBarcodeDecode,
    VAnimation,
    VEmptyState: () => import("@/components/global/EmptyState"),
  },
  props: {
    i18n_path: {
      type: String,
      required: true,
    },
    withTitle: {
      type: Boolean,
      default: false,
    },
    resetForm: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasEmailConfirmation: {
      type: Boolean,
      default: false,
    },
    emailConfirmationText: {
      type: String,
      default: undefined,
    },
    id: {
      type: [String, Number],
      default: undefined,
    },
    formId: {
      type: [String],
      default: undefined,
    },
    form: {
      type: Model,
      required: true,
    },
    sections: {
      type: Array,
      required: true,
    },
    method: {
      type: String,
      default: "store",
    },
  },
  directives: {
    "number-only": {
      bind(el) {
        function checkValue(event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, "");
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true;
          }
          event.preventDefault();
        }
        el.addEventListener("keypress", checkValue);
      },
    },
  },
  data: () => ({
    showPassword: false,
    birthday_dialogs: [],
    activePicker: null,
    step: 0,
    lastIndex: 0,
    animationLoading: loading.default,
    animationSuccess: success.default,
    animationConfirmation: email.default,
    sending: false,
    errors: {},
  }),
  created() {
    this.createForm();
  },
  methods: {
    createForm() {
      this.lastIndex = this.sections.length + 1;
    },
    onSubmit() {
      this.step++;
      this.$emit("step", this.step);
      if (this.step > this.lastIndex - 2) {
        const that = this;
        that.sending = true;
        this.$emit("submitting");
        this.form.resetOnlyWhenUpdate = this.resetForm;
        const request = this.id
          ? this.form[this.method](this.id)
          : this.form[this.method]();
        request
          .then((response) => {
            this.errors = {};
            this.$emit("success", response);
            this.$emit(`success:${this.id ? "update" : "create"}`, response);
          })
          .catch((errors) => {
            this.step = 0;
            this.$emit("error", errors);
            this.errors = errors;
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.$emit("finished");
            that.sending = false;
          });
      }
    },
    isText: (tag) => texts.includes(tag),
    isDialog(tag, index) {
      if (!dialogs.includes(tag)) this.birthday_dialogs[index] = false;
      return !dialogs.includes(tag);
    },
    onListeners(on) {
      return on ? on : {};
    },
    setStep(step) {
      this.step = step ? step : 0;
    },
  },
  computed: {
    successMessage() {
      return this.hasEmailConfirmation
        ? this.emailConfirmationText
          ? this.emailConfirmationText
          : this.$t("label.successMessage")
        : this.$t("label.success");
    },
    successAnimation() {
      return this.hasEmailConfirmation
        ? this.animationConfirmation
        : this.animationSuccess;
    },
    errorsKeys() {
      return has(this.errors, "errors") ? Object.keys(this.errors.errors) : [];
    },
    title() {
      const index = this.sections.length - 1;
      return this.sections[this.step]
        ? this.sections[this.step].title
        : this.sections[index].title;
    },
  },
  watch: {
    step(val) {
      this.$nextTick(function () {
        const that = this;
        setTimeout(function () {
          that.form.setFormInstance(that.$refs.form[val]);
          if (!that.$lodash.isEmpty(that.errors) && that.$refs.form[val]) {
            that.$refs.form[val].setErrors(that.errors);
          }
        }, 300);
      });
    },
    birthday_dialogs(val) {
      const that = this;
      return val && setTimeout(() => (that.activePicker = "YEAR"));
    },
    sections() {
      this.createForm();
    },
  },
};
</script>
