<template>
  <v-card flat>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-alert
            type="info"
            colored-border
            border="left"
            :color="item.schedule_status_color"
          >
            <span class="font-weight-regular">
              {{ item.schedule_status_name }}
            </span>
          </v-alert>
          <template v-if="availableToPay(item)">
            Tienes un límite de tiempo para subir el comprobante de consignación
            o realizar el pago en línea
            <app-timer
              tag="h2"
              class="display-serif-2"
              :time="Date.parse(item.citizen_schedule_payment_at) - Date.now()"
              @end="show = false"
              v-slot="{ days, hours, minutes, seconds }"
            >
              {{
                `Quedan: ${days} día(s) : ${hours} hora(s) : ${minutes} minuto(s) : ${seconds} segundo(s)`
              }}
            </app-timer>
            <v-dialog max-width="600">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  block
                  class="my-2"
                  aria-label="Ver formas de pago"
                  v-bind="attrs"
                  v-on="on"
                >
                  Ver formas de pago
                </v-btn>
              </template>
              <v-card flat>
                <v-card-title>
                  <app-timer
                    tag="h2"
                    class="display-serif-2"
                    :time="
                      Date.parse(item.citizen_schedule_payment_at) - Date.now()
                    "
                    @end="show = false"
                    v-slot="{ days, hours, minutes, seconds }"
                  >
                    {{
                      `Quedan: ${days} día(s) : ${hours} hora(s) : ${minutes} minuto(s) : ${seconds} segundo(s)`
                    }}
                  </app-timer>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="12" sm="12">
                      <v-dialog>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            aria-label="Paga en línea"
                            block
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon left>$vuetify.icons.pse</v-icon>
                            Paga en línea
                          </v-btn>
                        </template>
                        <v-card flat>
                          <v-card-text>
                            <v-pse-form
                              v-if="!!item.payment && !!item.payment.document"
                              :payment="item.payment"
                              disabled-select-inputs
                              hide-concept-and-value
                              hide-park-and-service
                              @success="onPayment($event, item)"
                            />
                            <v-row v-else>
                              <v-col cols="12">
                                <v-empty-state
                                  icon="mdi-currency-usd-off"
                                  :label="
                                    $t('dashboard.payments.emptyState.label')
                                  "
                                  :description="
                                    $t(
                                      'dashboard.payments.emptyState.description'
                                    )
                                  "
                                >
                                  <v-btn
                                    :aria-label="`${$t('buttons.Update')} ${$t(
                                      'router.profile'
                                    )}`"
                                    color="primary"
                                    :to="{ name: 'Profile' }"
                                  >
                                    {{
                                      `${$t("buttons.Update")} ${$t(
                                        "router.profile"
                                      )}`
                                    }}
                                  </v-btn>
                                </v-empty-state>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                      <i18n
                        tag="h5"
                        class="text-center text-border grey--text mt-4 mb-3"
                        path="o"
                      />
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                      <v-form-dialog
                        use-i18n
                        title="buttons.Upload"
                        color="primary"
                        max-width="100%"
                        ref="payment"
                      >
                        <template #action="{ props }">
                          <app-btn
                            path="Comprobante de Consignación"
                            color="primary"
                            block
                            icon-text="mdi-paperclip"
                            v-on="props.on"
                          />
                        </template>
                        <v-form-template
                          v-if="!!item.payment && !!item.payment.document"
                          :form="payment"
                          :loading="loading"
                          :sections="sections"
                          i18n_path="payment"
                          method="storeWithFiles"
                          @finished="onSuccess"
                          reset-form
                        >
                          <template #[`empty-slot-0`]>
                            <v-card-subtitle tag="h1" class="display-serif-1">
                              Datos y comprobante de la consignación
                            </v-card-subtitle>
                          </template>
                          <template #[`empty-slot-4`]>
                            <v-card-subtitle tag="h1" class="display-serif-1">
                              Datos de quién recibe el servicio
                            </v-card-subtitle>
                          </template>
                          <template #[`empty-slot-11`]>
                            <v-card-subtitle tag="h1" class="display-serif-1">
                              Datos para facturación electrónica (Solo aplica para cursos de natación)
                            </v-card-subtitle>
                          </template>
                        </v-form-template>
                        <v-row v-else>
                          <v-col cols="12">
                            <v-empty-state
                              icon="mdi-currency-usd-off"
                              :label="$t('dashboard.payments.emptyState.label')"
                              :description="
                                $t('dashboard.payments.emptyState.description')
                              "
                            >
                              <v-btn
                                :aria-label="`${$t('buttons.Update')} ${$t(
                                  'router.profile'
                                )}`"
                                color="primary"
                                :to="{ name: 'Profile' }"
                              >
                                {{
                                  `${$t("buttons.Update")} ${$t(
                                    "router.profile"
                                  )}`
                                }}
                              </v-btn>
                            </v-empty-state>
                          </v-col>
                        </v-row>
                      </v-form-dialog>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
          </template>
        </v-col>
        <v-col cols="12">
          <v-list>
            <v-list-item
              v-for="(file, j) in item.citizen_schedule_payment_files"
              :key="`file-list-${j}`"
              @click="onDownload(file)"
            >
              <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
                <v-avatar :color="file.color">
                  <v-icon dark>mdi-file</v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="file.file" />
                <v-list-item-subtitle v-text="file.file_type" />
                <v-list-item-subtitle>
                  <v-avatar size="15" :color="file.color" left />
                  {{ file.status }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <app-time-ago :date-time="file.created_at" />
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="hidden-sm-and-down">
                <v-menu offset-y left>
                  <template #activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template #activator="{ on: tooltip }">
                        <v-btn
                          :aria-label="$t('buttons.MoreOptions')"
                          icon
                          v-bind="attrs"
                          v-on="{ ...menu, ...tooltip }"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("buttons.MoreOptions") }}</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item @click="onDownload(file)">
                      <v-list-item-icon>
                        <v-icon>mdi-cloud-download</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ $t("buttons.Download") }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import FileSaver from "file-saver";
import Base64ToBlob from "@/util/Base64ToBlob";
import { Arrow } from "@/plugins/Arrow";
import { File } from "@/models/services/portal/File";
import { get, debounce } from "lodash";
import { Booking } from "@/models/services/Booking";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
/**
 * Identificador del tipo de archivo "CONSIGNACIÓN" en la base de datos
 *
 * @type {number}
 */
const PAYMENT = 3;
export default {
  name: "VBankAttachment",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    profileId: {
      type: [Number, String],
    },
  },
  data: (vm) => ({
    arrow: new Arrow(window, window.document, "primary"),
    loading: false,
    show: true,
    payment: new File(vm.profileId, {
      number_bank: null,
      payment_at: null,
      file_type_id: PAYMENT,
      file: null,
      citizen_schedule_id: vm.item.citizen_schedule_id,
      // PSE
      name: vm.item.payment.name, // ok
      lastName: vm.item.payment.surname, // ok
      phone: vm.item.payment.phone, // ok
      email: vm.item.payment.email, // ok
      address: vm.item.payment.address, // ok
      documentTypeSelected: vm.item.payment.document_type_id, // ok
      document: vm.item.payment.document, // ok
      parkSelected: vm.item.payment.park_id, // ok
      serviceParkSelected: vm.item.payment.service_id, // ok
      concept: vm.item.payment.concept, // ok
      totalPay: vm.item.payment.amount, // ok
      // ----
      isTheSame: false,
      namePayer: vm.item.payment.namePayer || null,
      lastNamePayer: vm.item.payment.lastNamePayer || null,
      phonePayer: vm.item.payment.phonePayer || null,
      emailPayer: vm.item.payment.emailPayer || null,
      addressPayer: vm.item.payment.addressPayer || null,
      documentTypeSelectedPayer: vm.item.payment.documentTypeSelectedPayer || null,
      documentPayer: vm.item.payment.documentPayer || null,
      // -----
      ip_address: null, // ok
    }),
    booking: new Booking(),
    documentTypeList: [
      { id: "CC", name: "Cédula de ciudadanía" },
      { id: "CE", name: "Cédula de extranjería" },
      { id: "NIT", name: "Número de identificación tributario" },
      { id: "TI", name: "Tarjeta de identidad" },
      { id: "PP", name: "Pasaporte" },
      { id: "RC", name: "Registro civil de nacimiento" },
      { id: "DE", name: "Documento de identificación extranjero" },
    ],
    profile: new Beneficiary(),
    profiles: [],
    current_ip: null,
  }),
  mounted() {
    this.getIp().finally(() => {
      this.onLoad();
    });
  },
  methods: {
    onSuccess: debounce(function () {
      this.$emit("success", true);
    }, 800),
    onDownload(item, download = true) {
      this.loading = true;
      this.payment
        .download(this.profileId, item.id)
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(response.data.file).blob(),
            response.data.name
          );
        })
        .then(() => {
          this.arrow.show(6000);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    availableToPay(item) {
      const payment = get(item, "citizen_pse_reference.status_id", 0);
      const f =
        !!item.citizen_schedule_payment_at && // Tiene fecha de pago
        this.show && // La fecha de pago aún está vigente
        !item.citizen_schedule_payment_files.length &&
        payment !== 2; // No tiene Archivos o el estado de pago aún no es aprobado
      return f;
    },
    onPayment(pse, item) {
      if (item.citizen_schedule_id && pse.payment) {
        this.loading = true;
        this.booking
          .reference(item.citizen_schedule_id, pse.payment)
          .then((response) => {
            this.$snackbar.success(response.data);
            window.location.href = pse.bank_url;
          })
          .catch((errors) => {
            this.loading = false;
            this.$snackbar.success(errors.message);
          });
      } else {
        this.$snackbar.error(
          "El servicio de pagos en línea PSE no está disponible, por favor intente más tarde."
        );
      }
    },
    getProfiles() {
      this.info = false;
      this.profile
        .profilesList()
        .then((response) => {
          this.profiles = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    getIp() {
      return new Promise((resolve) => {
        fetch("https://api.ipify.org/?format=json")
          .then((ip) => ip.json())
          .then(({ ip }) => {
            this.current_ip = ip;
            this.payment.ip_address = ip;
          })
          .catch(() => {
            this.current_ip = "201.0.90.17";
            this.payment.ip_address = "201.0.90.17";
          })
          .finally(() => {
            resolve();
          });
      });
    },
    onLoad() {
      const data = {
        number_bank: null,
        payment_at: null,
        file_type_id: PAYMENT,
        file: null,
        citizen_schedule_id: this.item.citizen_schedule_id,
        name: this.item.payment.name, // ok
        lastName: this.item.payment.surname, // ok
        phone: this.item.payment.phone, // ok
        email: this.item.payment.email, // ok
        address: this.item.payment.address, // ok
        documentTypeSelected: this.item.payment.document_type_id, // ok
        document: this.item.payment.document, // ok
        parkSelected: this.item.payment.park_id, // ok
        serviceParkSelected: this.item.payment.service_id, // ok
        concept: this.item.payment.concept, // ok
        totalPay: this.item.payment.amount, // ok
        // ----
        isTheSame: false,
        namePayer: this.item.payment.namePayer || null,
        lastNamePayer: this.item.payment.lastNamePayer || null,
        phonePayer: this.item.payment.phonePayer || null,
        emailPayer: this.item.payment.emailPayer || null,
        addressPayer: this.item.payment.addressPayer || null,
        documentTypeSelectedPayer:
          this.item.payment.documentTypeSelectedPayer || null,
        documentPayer: this.item.payment.documentPayer || null,
        // -----
        ip_address: this.current_ip, // ok
      };
      this.payment = new File(this.profileId, data);
    },
  },
  computed: {
    sections() {
      const that = this;
      return [
        {
          title: "",
          fields: [
            {
              type: "empty",
              flex: 12,
            },
            {
              name: "number_bank",
              icon: "mdi-numeric",
              type: "numeric",
              rules: that.payment.validations.input_number_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 50,
                required: true,
                autocomplete: "off",
                inputmode: "numeric",
                counter: 50,
              },
            },
            {
              name: "payment_at",
              icon: "mdi-calendar",
              type: "date",
              rules: that.payment.validations.input_date_required,
              flex: 6,
              attrs: {
                required: true,
                autocomplete: "off",
              },
              pickerAttrs: {
                max: that.$moment().toISOString(),
                locale: "es",
              },
            },
            {
              name: "file",
              icon: "mdi-paperclip",
              type: "dropzone",
              rules: that.payment.validations.pdf_file_required,
              flex: 12,
              attrs: {
                accept: "application/pdf",
                required: true,
              },
            },
            {
              type: "empty",
              flex: 12,
            },
            // Citizen
            {
              name: "documentTypeSelected",
              icon: "mdi-card-account-details",
              type: "select",
              rules: that.payment.validations.required,
              flex: 6,
              values: that.documentTypeList,
              attrs: {
                disabled: !!that.item.payment.document_type_id,
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
              rules: that.payment.validations.input_document_required,
              flex: 6,
              attrs: {
                disabled: !!that.item.payment.document,
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
              rules: that.payment.validations.input_names_required,
              flex: 6,
              attrs: {
                disabled: !!that.item.payment.name,
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
              rules: that.payment.validations.input_names_required,
              flex: 6,
              attrs: {
                disabled: !!that.item.payment.surname,
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
              rules: that.payment.validations.input_email_required,
              flex: 6,
              attrs: {
                disabled: !!that.item.payment.email,
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
              rules: that.payment.validations.required,
              flex: 6,
              attrs: {
                disabled: !!that.item.payment.address,
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
              rules: that.payment.validations.input_phone_mobile_required,
              flex: 6,
              attrs: {
                disabled: !!that.item.payment.phone,
                minlength: 7,
                maxlength: 10,
                required: true,
                autocomplete: "tel",
                counter: 10,
              },
            },
            {
              type: "empty",
              flex: 12,
            },
            // Payer
            {
              name: "isTheSame",
              icon: "mdi-currency-usd",
              type: "checkbox",
              rules: that.payment.validations.required,
              flex: 12,
              attrs: {
                required: true,
              },
              on: {
                change(value) {
                  if (value) {
                    that.payment.documentTypeSelectedPayer =
                      that.payment.documentTypeSelected;
                    that.payment.documentPayer = that.payment.document;
                    that.payment.namePayer = that.payment.name;
                    that.payment.lastNamePayer = that.payment.lastName;
                    that.payment.phonePayer = that.payment.phone;
                    that.payment.emailPayer = that.payment.email;
                    that.payment.addressPayer = that.payment.address;
                  } else {
                    that.payment.documentTypeSelectedPayer = null;
                    that.payment.documentPayer = null;
                    that.payment.namePayer = null;
                    that.payment.lastNamePayer = null;
                    that.payment.phonePayer = null;
                    that.payment.emailPayer = null;
                    that.payment.addressPayer = null;
                  }
                },
              },
            },
            {
              name: "documentTypeSelectedPayer",
              icon: "mdi-card-account-details",
              type: "select",
              rules: that.payment.validations.required,
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
              rules: that.payment.validations.input_document_required,
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
              rules: that.payment.validations.input_names_required,
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
              rules: that.payment.validations.input_names_required,
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
              rules: that.payment.validations.input_email_required,
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
              name: "addressPayer",
              icon: "mdi-pin",
              type: "text",
              rules: that.payment.validations.required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 125,
                required: true,
                autocomplete: "address",
                counter: 125,
              },
            },
            {
              name: "phonePayer",
              icon: "mdi-phone",
              type: "tel",
              rules: that.payment.validations.input_phone_mobile_required,
              flex: 6,
              attrs: {
                minlength: 7,
                maxlength: 10,
                required: true,
                autocomplete: "tel",
                counter: 10,
              },
            },
          ],
        },
      ];
    },
  },
};
</script>

<style scoped></style>
