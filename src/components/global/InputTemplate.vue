<template>
  <v-row dense>
    <slot name="prepend-input"></slot>
    <v-col
      v-for="(field, i) in inputs"
      cols="12"
      :md="field.flex || 6"
      sm="12"
      :key="i"
    >
      <slot :name="`prepend-input-${i}`"></slot>
      <v-dialog
        v-if="isDialog(field.type, i)"
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
              :label="$t(`${i18n_path}.${field.name}`)"
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
        :name="$t(`${i18n_path}.${field.name}`).toLowerCase()"
        :key="`input-${field.name}-${i}`"
      >
        <v-text-field
          v-if="isText(field.type)"
          v-bind="field.attrs"
          :id="field.name"
          v-model="form[field.name]"
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
        <v-autocomplete
          v-else-if="['autocomplete'].includes(field.type)"
          v-bind="field.attrs"
          :id="field.name"
          v-model="form[field.name]"
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
          :label="$t(`${i18n_path}.${field.name}`)"
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
    <slot name="append-input"></slot>
  </v-row>
</template>

<script>
import { Model } from "@/models/Model";

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
];
export default {
  name: "VInputTemplate",
  props: {
    i18n_path: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    inputs: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Model,
      required: true,
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
  }),
  methods: {
    isText: (tag) => texts.includes(tag),
    isDialog(tag, index) {
      if (!dialogs.includes(tag)) this.birthday_dialogs[index] = false;
      return !dialogs.includes(tag);
    },
    onListeners(on) {
      return on ? on : {};
    },
  },
  watch: {
    birthday_dialogs(val) {
      const that = this;
      return val && setTimeout(() => (that.activePicker = "YEAR"));
    },
  },
};
</script>
