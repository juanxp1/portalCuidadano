<template>
  <v-validation-observer ref="form" v-slot="{ handleSubmit, invalid }">
    <v-form @submit.prevent="handleSubmit(onSubmit)">
      <v-card flat color="transparent">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="12" md="4">
              <v-card-subtitle tag="h1" class="display-serif-1">
                Total a pagar
              </v-card-subtitle>
              <v-card-title tag="h1" class="display-serif-3">
                $ {{ form.totalPay || 0 }}
              </v-card-title>
              <v-card-text>
                {{ form.concept }}
                <v-list
                  v-if="!!payment.details && showDetails"
                  three-line
                  dense
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="`Tarifa: ${payment.details.type}`"
                    />
                    <v-list-item-subtitle
                      v-text="`Estrato: ${payment.details.stratum}`"
                    />
                    <v-list-item-subtitle
                      v-text="`V. Unit: ${payment.details.unit}`"
                    />
                    <v-list-item-subtitle
                      v-text="`Horas: ${payment.details.hours}`"
                    />
                  </v-list-item-content>
                </v-list>
                <app-animation :animation-data="animation" loop auto-play />
              </v-card-text>
            </v-col>
            <v-col cols="12" sm="12" md="8">
              <v-card-subtitle tag="h1" class="display-serif-1">
                Datos de quién recibe el servicio
              </v-card-subtitle>
              <v-input-template
                i18n_path="payment"
                :inputs="sections"
                :loading="loading"
                :form="form"
              >
                <template #[`prepend-input-9`]>
                  <v-card-subtitle tag="h1" class="display-serif-1">
                    Datos para facturación electrónica (Solo aplica para cursos de natación)
                  </v-card-subtitle>
                </template>
              </v-input-template>
            </v-col>
          </v-row>
        </v-card-text>
        <v-alert
          v-if="info.id && showAlert"
          border="top"
          colored-border
          type="info"
          elevation="2"
        >
          Verifica previamente disponibilidad del parque o servicio en el
          horario: 7:00 am a 5:00 pm
          <v-list dense three-line color="transparent">
            <v-list-item-content>
              <v-list-item-title class="text-wrap">
                <v-icon left>mdi-pine-tree</v-icon>
                {{ info.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-wrap">
                <v-icon left>mdi-domain</v-icon>
                {{ info.address }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-wrap">
                <v-icon left>mdi-account</v-icon>
                {{ info.contact_name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-wrap">
                <v-icon left>mdi-phone</v-icon>
                {{ info.phones }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-wrap">
                <v-icon left>mdi-email</v-icon>
                {{ info.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list>
        </v-alert>
        <v-card-actions>
          <v-btn
            :aria-label="`${$t('buttons.Pay')} $ ${form.totalPay}`"
            type="submit"
            :loading="loading"
            :disabled="loading || invalid"
            block
            color="primary"
          >
            {{ `${$t("buttons.Pay")} $ ${form.totalPay || 0}` }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-validation-observer>
</template>
<script>
import * as payment from "@/assets/anims/payment.json";
import { Booking } from "@/models/services/Booking";

/**
 * Servicio de canchas sintéticas grama natural, asadores y cursos de natación
 * tomados de la base de datos de PSE para excluirlo del formulario
 *
 * @type {number}
 */
const SYNTHETIC_SERVICE = 13;
const SWIM_COURSE = 30;
const KIOSKO = 30;

export default {
  name: "VPseForm",
  props: {
    payment: {
      type: Object,
      default: () => ({
        name: null,
        surname: null,
        document_type_id: null,
        document: null,
        email: null,
        phone: null,
        address: null,
        booking_id: null,
        amount: null,
        park_id: null,
        service_id: null,
        concept: null,
        person_type_id: null,
        bank_id: null,
        ip_address: null,
        namePayer: null,
        lastNamePayer: null,
        phonePayer: null,
        emailPayer: null,
        addressPayer: null,
        documentTypeSelectedPayer: null,
        documentPayer: null,
      }),
    },
    disabledSelectInputs: {
      type: Boolean,
      default: false,
    },
    hideConceptAndValue: {
      type: Boolean,
      default: false,
    },
    hideParkAndService: {
      type: Boolean,
      default: false,
    },
    showAlert: {
      type: Boolean,
      default: false,
    },
    showDetails: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    animation: payment.default,
    loading: false,
    form: new Booking({
      reservationId: null,
      permitTypeSelected: "PO",
      permitNumber: "999",
      name: null,
      lastName: null,
      phone: null,
      email: null,
      address: null,
      documentTypeSelected: null,
      document: null,
      parkSelected: null,
      serviceParkSelected: null,
      isTheSame: false,
      namePayer: null,
      lastNamePayer: null,
      phonePayer: null,
      emailPayer: null,
      documentTypeSelectedPayer: null,
      documentPayer: null,
      addressPayer: null,
      concept: null,
      totalPay: null,
      typePersonSelected: null,
      BankTypeSelected: null,
      redirect_url: window.location.origin + process.env.VUE_APP_PSE_REDIRECT,
      ip_address: null,
    }),
    documentTypeList: [
      { id: "CC", name: "Cédula de ciudadanía" },
      { id: "CE", name: "Cédula de extranjería" },
      { id: "NIT", name: "Número de identificación tributario" },
      { id: "TI", name: "Tarjeta de identidad" },
      { id: "PP", name: "Pasaporte" },
      { id: "RC", name: "Registro civil de nacimiento" },
      { id: "DE", name: "Documento de identificación extranjero" },
    ],
    banks: [],
    parks: [],
    services: [],
    typePersons: [
      { id: "N", name: "Natural" },
      { id: "J", name: "Jurídico" },
    ],
    permitTypeList: [
      {
        id: "CA",
        name: "Contrato aprovechamiento economico",
      },
      {
        id: "PS",
        name: "Permiso de subdirección",
      },
      {
        id: "PP",
        name: "Permiso emitido por el parque",
      },
      {
        id: "PO",
        name: "Pago Ocasional",
      },
    ],
    // https://api.ipify.org/?format=json
    current_ip: null,
  }),
  mounted() {
    this.getIp().finally(() => {
      this.onLoad();
    });
    this.getBanks();
    this.getParks();
  },
  methods: {
    onLoad() {
      if (this.payment.park_id) {
        this.getServices(this.payment.park_id, false);
      }
      const data = {
        reservationId: this.payment.booking_id, // optional - ok
        permitTypeSelected: "PO", // ok
        permitNumber: "999", // ok
        name: this.payment.name, // ok
        lastName: this.payment.surname, // ok
        phone: this.payment.phone, // ok
        email: this.payment.email, // ok
        address: this.payment.address, // ok
        documentTypeSelected: this.payment.document_type_id, // ok
        document: this.payment.document, // ok
        parkSelected: this.payment.park_id, // ok
        serviceParkSelected: this.payment.service_id, // ok
        concept: this.payment.concept, // ok
        totalPay: this.payment.amount, // ok
        // ----
        isTheSame: false,
        namePayer: this.payment.namePayer || null,
        lastNamePayer: this.payment.lastNamePayer || null,
        phonePayer: this.payment.phonePayer || null,
        emailPayer: this.payment.emailPayer || null,
        addressPayer: this.payment.addressPayer || null,
        documentTypeSelectedPayer:
          this.payment.documentTypeSelectedPayer || null,
        documentPayer: this.payment.documentPayer || null,
        // -----
        typePersonSelected: this.payment.person_type_id, // ok
        typePersonSelectedPayer: this.payment.person_type_id, // ok
        BankTypeSelected: this.payment.bank_id, // ok
        redirect_url: window.location.origin + process.env.VUE_APP_PSE_REDIRECT, // ok
        ip_address: this.current_ip, // ok
      };
      this.form = new Booking(data);
    },
    getIp() {
      return new Promise((resolve) => {
        fetch("https://api.ipify.org/?format=json")
          .then((ip) => ip.json())
          .then(({ ip }) => {
            this.current_ip = ip;
            this.form.ip_address = ip;
          })
          .catch(() => {
            this.current_ip = "201.0.90.17";
            this.form.ip_address = "201.0.90.17";
          })
          .finally(() => {
            resolve();
          });
      });
    },
    getBanks() {
      this.loading = true;
      this.form
        .banks()
        .then((response) => {
          this.banks = response.banks.map((b) => {
            return {
              id: b.code,
              name: b.name,
            };
          });
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getParks() {
      this.loading = true;
      this.form
        .parks()
        .then((response) => {
          this.parks = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getServices(id, resetData = true) {
      if (resetData) {
        this.services = [];
      }
      if (id) {
        this.loading = true;
        this.form.resetOnlyWhenUpdate = false;
        this.form
          .services(id)
          .then((response) => {
            this.services = response.data.filter(
              (service) =>
                ![SYNTHETIC_SERVICE, SWIM_COURSE, KIOSKO].includes(service.id)
            );
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        if (resetData) {
          this.form.serviceParkSelected = null;
        }
      }
    },
    onSubmit() {
      this.getIp();
      this.loading = true;
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .transfer()
        .then((response) => {
          if (response.data.bank_url) {
            this.$emit("success", response.data);
          } else {
            this.$snackbar.error(
              "El servicio de pagos en línea PSE no está disponible en este momento, por favor intenta más tarde"
            );
            this.$emit("error", response.data);
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    sections() {
      const that = this;
      const inputs = [
        {
          name: "parkSelected",
          icon: "mdi-format-list-bulleted-type",
          type: "autocomplete",
          rules: that.form.validations.required,
          flex: 6,
          values: that.parks,
          show: !that.hideParkAndService,
          attrs: {
            disabled: that.disabledSelectInputs || !!that.payment.park_id,
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name",
          },
          on: {
            change: that.getServices,
          },
        },
        {
          name: "serviceParkSelected",
          icon: "mdi-format-list-bulleted-type",
          type: "autocomplete",
          rules: that.form.validations.required,
          flex: 6,
          values: that.services,
          show: !that.hideParkAndService,
          attrs: {
            disabled: that.disabledSelectInputs || !!that.payment.service_id,
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name_service",
          },
        },
        {
          name: "concept",
          icon: "mdi-text",
          type: "textarea",
          show: !that.hideConceptAndValue,
          rules: {
            required: true,
            min: 3,
            max: 100,
          },
          flex: 12,
          attrs: {
            disabled: !!that.payment.concept,
            minlength: 3,
            maxlength: 100,
            required: true,
            autocomplete: "off",
            counter: 100,
          },
        },
        {
          name: "totalPay",
          icon: "mdi-currency-usd",
          type: "numeric",
          rules: that.form.validations.input_document_required,
          flex: 12,
          show: !that.hideConceptAndValue,
          attrs: {
            hint: "Valor a pagar indicado en el permiso o contrato",
            persistentHint: true,
            minlength: 3,
            maxlength: 12,
            required: true,
            disabled: !!that.payment.amount,
            autocomplete: "off",
            inputmode: "numeric",
            counter: 12,
          },
        },
      ];
      return [
        {
          name: "permitTypeSelected",
          icon: "mdi-format-list-bulleted-type",
          type: "select",
          rules: that.form.validations.required,
          flex: 6,
          values: that.permitTypeList,
          attrs: {
            disabled: that.disabledSelectInputs,
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name",
          },
          on: {
            change(value) {
              if (value === "PO") {
                that.form.permitNumber = 999;
              } else {
                that.form.permitNumber = null;
              }
            },
          },
        },
        {
          name: "permitNumber",
          icon: "mdi-numeric",
          type: "numeric",
          rules: that.form.validations.input_number_required,
          flex: 6,
          attrs: {
            disabled:
              that.form.permitTypeSelected === "PO" ||
              that.disabledSelectInputs,
            readOnly: that.form.permitTypeSelected === "PO",
            minlength: 3,
            maxlength: 12,
            required: true,
            autocomplete: "off",
            inputmode: "numeric",
            counter: 12,
          },
        },
        // Citizen
        {
          name: "documentTypeSelected",
          icon: "mdi-card-account-details",
          type: "select",
          rules: that.form.validations.required,
          flex: 6,
          values: that.documentTypeList,
          attrs: {
            disabled: !!that.payment.document_type_id,
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name",
          },
        },
        {
          name: "document",
          icon: "mdi-numeric",
          type: "numeric",
          rules: that.form.validations.input_document_required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.document,
            minlength: 3,
            maxlength: 12,
            required: true,
            autocomplete: "off",
            inputmode: "numeric",
            counter: 12,
          },
        },
        {
          name: "name",
          icon: "mdi-dots-horizontal",
          type: "text",
          rules: that.form.validations.input_names_required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.name,
            minlength: 3,
            maxlength: 90,
            required: true,
            autocomplete: "given-name",
            counter: 90,
          },
        },
        {
          name: "lastName",
          icon: "mdi-dots-horizontal",
          type: "text",
          rules: that.form.validations.input_names_required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.surname,
            minlength: 3,
            maxlength: 90,
            required: true,
            autocomplete: "family-name",
            counter: 90,
          },
        },
        {
          name: "email",
          icon: "mdi-email",
          type: "email",
          rules: that.form.validations.input_email_required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.email,
            minlength: 3,
            maxlength: 125,
            required: true,
            autocomplete: "email",
            counter: 125,
          },
        },
        {
          name: "address",
          icon: "mdi-pin",
          type: "text",
          rules: that.form.validations.required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.address,
            minlength: 3,
            maxlength: 125,
            required: true,
            autocomplete: "address",
            counter: 125,
          },
        },
        {
          name: "phone",
          icon: "mdi-phone",
          type: "tel",
          rules: that.form.validations.input_phone_mobile_required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.phone,
            minlength: 7,
            maxlength: 10,
            required: true,
            autocomplete: "tel",
            counter: 10,
          },
        },
        // Payer
        {
          name: "isTheSame",
          icon: "mdi-currency-usd",
          type: "checkbox",
          rules: that.form.validations.required,
          flex: 12,
          attrs: {
            required: true,
          },
          on: {
            change(value) {
              if (value) {
                that.form.documentTypeSelectedPayer =
                  that.form.documentTypeSelected;
                that.form.documentPayer = that.form.document;
                that.form.namePayer = that.form.name;
                that.form.lastNamePayer = that.form.lastName;
                that.form.phonePayer = that.form.phone;
                that.form.emailPayer = that.form.email;
                that.form.addressPayer = that.form.address;
              } else {
                that.form.documentTypeSelectedPayer = null;
                that.form.documentPayer = null;
                that.form.namePayer = null;
                that.form.lastNamePayer = null;
                that.form.phonePayer = null;
                that.form.emailPayer = null;
                that.form.addressPayer = null;
              }
            },
          },
        },
        {
          name: "documentTypeSelectedPayer",
          icon: "mdi-card-account-details",
          type: "select",
          rules: that.form.validations.required,
          flex: 6,
          values: that.documentTypeList,
          attrs: {
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name",
          },
        },
        {
          name: "documentPayer",
          icon: "mdi-numeric",
          type: "numeric",
          rules: that.form.validations.input_document_required,
          flex: 6,
          attrs: {
            minlength: 3,
            maxlength: 12,
            required: true,
            autocomplete: "off",
            inputmode: "numeric",
            counter: 12,
          },
        },
        {
          name: "namePayer",
          icon: "mdi-dots-horizontal",
          type: "text",
          rules: that.form.validations.input_names_required,
          flex: 6,
          attrs: {
            minlength: 3,
            maxlength: 90,
            required: true,
            autocomplete: "given-name",
            counter: 90,
          },
        },
        {
          name: "lastNamePayer",
          icon: "mdi-dots-horizontal",
          type: "text",
          rules: that.form.validations.input_names_required,
          flex: 6,
          attrs: {
            minlength: 3,
            maxlength: 90,
            required: true,
            autocomplete: "family-name",
            counter: 90,
          },
        },
        {
          name: "emailPayer",
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
          name: "phonePayer",
          icon: "mdi-phone",
          type: "tel",
          rules: that.form.validations.input_phone_mobile_required,
          flex: 6,
          attrs: {
            minlength: 7,
            maxlength: 10,
            required: true,
            autocomplete: "tel",
            counter: 10,
          },
        },
        {
          name: "addressPayer",
          icon: "mdi-pin",
          type: "text",
          rules: that.form.validations.required,
          flex: 6,
          attrs: {
            minlength: 3,
            maxlength: 125,
            required: true,
            autocomplete: "address",
            counter: 125,
          },
        },
        ...inputs.filter((inpt) => inpt.show === true),
        {
          name: "typePersonSelected",
          icon: "mdi-account",
          type: "select",
          rules: that.form.validations.required,
          flex: 6,
          values: that.typePersons,
          attrs: {
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name",
          },
        },
        {
          name: "BankTypeSelected",
          icon: "mdi-domain",
          type: "autocomplete",
          rules: that.form.validations.required,
          flex: 6,
          values: that.banks,
          attrs: {
            required: true,
            autocomplete: "off",
            itemValue: "id",
            itemText: "name",
          },
        },
      ];
    },
    info() {
      const data = this.parks.filter(
        (park) => park.id === this.form.parkSelected
      );
      return data.length ? data[0] : {};
    },
  },
  watch: {
    payment: {
      handler() {
        this.onLoad();
      },
      deep: true,
    },
  },
};
</script>
