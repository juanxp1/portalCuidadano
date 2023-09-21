<template>
  <v-form-template
    :i18n_path="i18n_path"
    :email-confirmation-text="responseText"
    :form.sync="form"
    has-email-confirmation
    :sections="fields"
    :loading="loading"
    with-title
    method="preRegister"
    @submitting="start"
    @finished="finish"
    @success="onSuccess"
    @error="onError"
  >
    <template #[`append-form-0`]="{ model }">
      <v-col cols="12">
        <h2 class="mb-2">OBSERVACIONES ANTES DE CREAR EL PERFIL CIUDADANO:</h2>
        <ul>
          <li>Debe ser mayor de edad para crear perfil personal</li>
          <li>
            Si el servicio es para un menor de edad debe crearlo como
            beneficiario luego de crear su perfil personal
          </li>
          <li>
            Tenga el documento de identidad escaneado en pdf por ambas caras y
            en una sola página
          </li>
          <li>Recuerde diligenciar toda la información que se le solicita</li>
          <li>La verificación de los perfiles tarda hasta 5 días hábiles</li>
          <li>
            Recuerde diligenciar la totalidad de la información con el fin de
            que el proceso de verificación sea mas rápido, de no hacerlo el
            proceso de verificación puede durar más del tiempo anteriormente
            mencionado
          </li>
          <li>
            Recuerde que el uso de la contraseña es personal e intransferible,
            el uso indebido es de responsabilidad del usuario del portal.
          </li>
        </ul>
      </v-col>
      <v-col cols="12">
        <h2 class="font-weight-regular">
          Para continuar con el registro de usuario, debe autorizar la política
          de tratamiento de datos del IDRD.
        </h2>
      </v-col>
      <v-col cols="12">
        <v-validation-provider
          v-slot="{ errors }"
          :rules="form.validations.required"
          vid="terms"
          name="términos y condiciones"
        >
          <v-checkbox
            :value="1"
            id="temrs"
            name="temrs"
            v-model="model.terms"
            :error-messages="errors"
            :loading="loading"
            :disabled="loading"
          >
            <template #label>
              <i18n tag="span" path="portal.forms.preRegister.accept">
                <template #link>
                  <v-dialog max-width="600">
                    <template v-slot:activator="{ on }">
                      <i18n
                        tag="a"
                        href="javascript:;"
                        v-on="on"
                        path="portal.forms.preRegister.terms"
                      />
                    </template>
                    <terms-and-conditions />
                  </v-dialog>
                </template>
              </i18n>
            </template>
          </v-checkbox>
        </v-validation-provider>
      </v-col>
      <v-col cols="12">
        <v-alert border="left" colored-border type="warning">
          Nota: Si ya iniciaste el proceso de registro y tienes el código de
          verificación, continúa con tu
          <a
            aria-label="tengo un código de verificación"
            class="mx-auto"
            @click="onCode"
            v-text="'registro aquí, tengo el código'"
          />
        </v-alert>
      </v-col>
    </template>
    <template #[`prepend-form-3`]>
      <v-col cols="12">
        <v-alert type="warning">
          <b>NOTA:</b> Al correo electrónico se enviará un Código de
          verificación para continuar con el proceso.
        </v-alert>
      </v-col>
    </template>
    <template #message>
      <v-btn
        aria-label="tengo un código de verificación"
        color="primary"
        class="mx-auto"
        outlined
        @click="onCode"
        v-text="'Tengo el código'"
      />
    </template>
  </v-form-template>
</template>

<script>
import { debounce } from "lodash";
import { DocumentType } from "@/models/services/portal/DocumentType";
import { User } from "@/models/services/User";
export default {
  name: "VRegisterForm",
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
    i18n_path: "portal.forms.beneficiary",
    loading: false,
    form: new User({
      document_type_id: null,
      document: null,
      name: null,
      s_name: null,
      surname: null,
      s_surname: null,
      email: null,
      terms: null,
    }),
    // Selectors
    document_type: new DocumentType(),
    document_types: [],
    errors: {},
    responseText: undefined,
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
    getDocumentTypes() {
      const where_in = "1,4,6,7,14,15";
      this.loading = true;
      this.document_type
        .index({ params: { where_in } })
        .then((response) => {
          this.document_types = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // Responses
    onSuccess(response) {
      this.responseText = response.data;
      this.$snackbar.success(response.data);
      const that = this;
      const writeCode = debounce(function () {
        that.onCode();
      }, 800);
      writeCode();
    },
    onError(errors) {
      this.errors = errors;
    },
    onCode() {
      this.$emit("on-code", this.form.data());
    },
  },
  mounted() {
    this.getDocumentTypes();
  },
  computed: {
    fields() {
      const that = this;
      const inputs = [
        // T&C
        {
          title: "Términos y Condiciones",
          fields: [],
        },
        // Identity Info
        {
          title: that.$t(`${that.i18n_path}.titles.validation`),
          fields: [
            {
              name: "document_type_id",
              icon: "mdi-card-account-details",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 12,
              values: that.document_types,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "combined",
              },
            },
            {
              name: "document",
              icon: "mdi-numeric",
              type: "numeric",
              rules: that.form.validations.input_document_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 20,
                required: true,
                autocomplete: "off",
                inputmode: "numeric",
                counter: 20,
              },
            },
            {
              name: "confirm_document",
              icon: "mdi-numeric",
              type: "numeric",
              rules: that.form.validations.input_confirmation(
                "document",
                3,
                20
              ),
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 20,
                required: true,
                autocomplete: "off",
                inputmode: "numeric",
                counter: 20,
              },
              on: {
                paste: (e) => {
                  e.preventDefault();
                },
              },
            },
          ],
        },
        // Personal Info
        {
          title: that.$t(`${that.i18n_path}.titles.personalInfo`),
          fields: [
            {
              name: "name",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: that.form.validations.input_names_required,
              flex: 6,
              attrs: {
                minlength: 2,
                maxlength: 90,
                required: true,
                autocomplete: "given-name",
                counter: 90,
              },
            },
            {
              name: "s_name",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: that.form.validations.input_names,
              flex: 6,
              attrs: {
                minlength: 2,
                maxlength: 90,
                required: false,
                autocomplete: "additional-name",
                counter: 90,
              },
            },
            {
              name: "surname",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: that.form.validations.input_names_required,
              flex: 6,
              attrs: {
                minlength: 2,
                maxlength: 90,
                required: true,
                autocomplete: "family-name",
                counter: 90,
              },
            },
            {
              name: "s_surname",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: that.form.validations.input_names,
              flex: 6,
              attrs: {
                minlength: 2,
                maxlength: 90,
                required: false,
                autocomplete: "family-name",
                counter: 90,
              },
            },
          ],
        },
        // Email and password
        {
          title: "Credenciales",
          fields: [
            {
              name: "email",
              icon: "mdi-email",
              type: "email",
              rules: that.form.validations.input_email_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 125,
                required: true,
                autocomplete: "email",
                counter: 125,
              },
            },
            {
              name: "confirm_email",
              icon: "mdi-email",
              type: "email",
              rules: that.form.validations.input_confirmation("email", 3, 125),
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 125,
                required: true,
                autocomplete: "off",
                counter: 125,
              },
              on: {
                paste: (e) => {
                  e.preventDefault();
                },
              },
            },
          ],
        },
      ];
      return inputs
        .filter((form) => !form.hide)
        .map((form) => {
          return {
            title: form.title,
            fields: form.fields.filter((el) => !el.hide),
          };
        });
    },
  },
};
</script>
