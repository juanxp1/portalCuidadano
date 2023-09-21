<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" sm="12" md="12">
        <material-card :color="color" image>
          <template #image>
            <img
              :src="imageColor"
              crossorigin="anonymous"
              :alt="`${endowment.park_code || endowment.code || ''} - ${
                endowment.park_name || endowment.name || ''
              }`"
              style="display: none"
            />
            <v-img
              min-height="250"
              max-height="250"
              aspect-ratio="16/9"
              :src="image"
              :lazy-src="image"
              :alt="`${endowment.park_code || endowment.code || ''} - ${
                endowment.park_name || endowment.name || ''
              }`"
            />
          </template>
          <v-card-text>
            <v-skeleton-loader
              :loading="loading"
              type="heading, list-item-avatar-three-line@1"
            >
              <div class="mb-4">
                <h1 class="display-2 font-weight-black">
                  {{
                    `${endowment.park_code || endowment.code || ""} / ${
                      endowment.park_name || endowment.name || ""
                    }`
                  }}
                </h1>
                <div class="d-flex justify-space-between body-2 pt-6">
                  <div class="d-flex flex-column">
                    <span class="opacity-70">
                      {{ endowment.endowment_description }} <br />
                      {{ endowment.locality }} <br />
                      {{ endowment.upz }}
                    </span>
                  </div>
                </div>
                <v-expansion-panels class="my-4">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-bold">
                      <i18n path="endowment.specs" />
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row dense>
                        <v-col
                          v-for="(specs, i) in endowments"
                          cols="12"
                          sm="12"
                          md="6"
                          :key="i"
                        >
                          <v-list-item two-line>
                            <v-list-item-avatar>
                              <v-icon v-text="icons[specs.value]" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                :class="specs.class"
                                v-text="endowment.details[specs.value]"
                              />
                              <v-list-item-subtitle
                                class="font-weight-bold"
                                v-text="$t(`endowment.${specs.value}`)"
                              />
                            </v-list-item-content>
                          </v-list-item>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-skeleton-loader>
            <v-row dense>
              <v-window touchless v-model="step">
                <v-window-item :value="0">
                  <v-row dense>
                    <v-col cols="12" sm="12" md="8">
                      <i18n
                        tag="h3"
                        class="font-weight-bold mb-2"
                        path="buttons.Book"
                      />
                      <v-validation-observer
                        ref="basic"
                        v-slot="{ handleSubmit, invalid }"
                      >
                        <v-form @submit.prevent="handleSubmit(onSubmit)">
                          <v-row dense>
                            <v-col cols="12" v-if="errors.length">
                              <v-alert
                                outlined
                                type="error"
                                prominent
                                border="left"
                                dismissible
                              >
                                <ul>
                                  <li
                                    v-for="(error, i) in errors"
                                    :key="i"
                                    v-text="error"
                                  />
                                </ul>
                                <template #close>
                                  <v-icon @click="errors = []"
                                    >mdi-close</v-icon
                                  >
                                </template>
                              </v-alert>
                            </v-col>
                            <v-col cols="12">
                              <v-sheet>
                                <v-validation-provider
                                  v-slot="{ errors }"
                                  :rules="form.validations.required"
                                  vid="date"
                                  name="fecha"
                                >
                                  <v-subheader>
                                    <v-icon small left>mdi-calendar</v-icon>
                                    <i18n path="buttons.SelectSchedule" />
                                  </v-subheader>
                                  <v-chip-group
                                    v-model="form.date"
                                    mandatory
                                    active-class="primary--text"
                                    class="justify-center"
                                    show-arrows
                                  >
                                    <v-chip
                                      v-for="(day, i) in days"
                                      :key="i"
                                      :value="day.id"
                                      :disabled="loading || day.disabled"
                                    >
                                      <v-icon left>mdi-calendar</v-icon>
                                      {{ day.name }}
                                    </v-chip>
                                  </v-chip-group>
                                  <span
                                    v-for="(error, i) in errors"
                                    class="caption error--text"
                                    :key="i"
                                    v-text="error"
                                  />
                                </v-validation-provider>
                              </v-sheet>
                            </v-col>
                            <v-col
                              v-if="endowment.details.all_day && times.length"
                              cols="12"
                              md="12"
                              sm="12"
                            >
                              <v-alert type="info">
                                La reserva se realiza por el día completo
                              </v-alert>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                              <v-validation-provider
                                v-slot="{ errors }"
                                :rules="form.validations.required"
                                vid="start_hour"
                                name="hora inicial"
                              >
                                <v-select
                                  v-model="form.start_hour"
                                  prepend-icon="mdi-clock"
                                  :loading="loading"
                                  :disabled="
                                    loading ||
                                    !times.length ||
                                    endowment.details.all_day
                                  "
                                  label="Hora inicial"
                                  :items="hours"
                                  item-value="id"
                                  item-text="name"
                                  :error-messages="errors"
                                  clearable
                                />
                              </v-validation-provider>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                              <v-validation-provider
                                v-slot="{ errors }"
                                :rules="form.validations.required"
                                vid="final_hour"
                                name="hora final"
                              >
                                <v-select
                                  v-model="form.final_hour"
                                  prepend-icon="mdi-clock"
                                  :loading="loading"
                                  :disabled="
                                    loading ||
                                    !times.length ||
                                    endowment.details.all_day
                                  "
                                  label="Hora final"
                                  :items="hours"
                                  item-value="id"
                                  item-text="name"
                                  :error-messages="errors"
                                  clearable
                                />
                              </v-validation-provider>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="text-right">
                              <app-btn
                                path="buttons.Back"
                                :disabled="loading"
                                :loading="loading"
                                color="primary"
                                class="mr-3"
                                outlined
                                text
                                icon-text="mdi-chevron-left"
                                :to="{ name: 'Booking' }"
                              />
                              <app-btn
                                path="buttons.Submit"
                                :disabled="loading || invalid"
                                :loading="loading"
                                color="primary"
                                depressed
                                default
                                icon-text="mdi-send"
                                type="submit"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-skeleton-loader
                                :loading="loading"
                                type="heading, list-item-avatar-three-line@1"
                              >
                                <!--
                                <v-list v-if="times.length">
                                  <v-list-item
                                    v-for="(time, i) in times"
                                    :key="i"
                                  >
                                    <v-list-item-icon>
                                      <v-icon>mdi-clock</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title v-text="time.title" />
                                      <v-list-item-subtitle
                                        v-text="time.description"
                                      />
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                                -->
                                <v-sheet v-if="times.length" height="600">
                                  <v-calendar
                                    :locale="$i18n.locale"
                                    :event-color="getEventColor"
                                    ref="calendar"
                                    color="primary"
                                    type="custom-daily"
                                    :start="
                                      $moment()
                                        .add(1, 'day')
                                        .format('YYYY-MM-DD')
                                    "
                                    :end="
                                      $moment()
                                        .add(7, 'days')
                                        .format('YYYY-MM-DD')
                                    "
                                    first-time="05:00"
                                    interval-count="19"
                                    category-show-all
                                    :categories="categories"
                                    :events="times"
                                    v-model="form.date"
                                  />
                                </v-sheet>
                                <v-list v-else two-line dense>
                                  <v-list-item>
                                    <v-list-item-icon>
                                      <v-icon>mdi-clock</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        v-text="
                                          `No hay horarios disponibles para la fecha ${form.date}`
                                        "
                                      />
                                      <v-list-item-subtitle
                                        v-text="`Selecciona otra fecha`"
                                      />
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-skeleton-loader>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-validation-observer>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <help-accordion
                        :youtube="!!tutorial.video"
                        :title="tutorial.title"
                        :src="tutorial.video"
                      />
                      <v-divider class="my-4" />
                      <v-expansion-panels>
                        <v-expansion-panel>
                          <v-expansion-panel-header class="font-weight-bold">
                            <v-icon color="warning" left>mdi-alert</v-icon>
                            <i18n path="buttons.Requirements" />
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <div
                              class="d-flex justify-space-between body-2 pt-6"
                            >
                              <div class="d-flex flex-column opacity-70">
                                <app-md v-if="!!endowment.details">
                                  {{ endowment.details.requirements }}
                                </app-md>
                              </div>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="1">
                  <v-col cols="12" v-if="step === 1">
                    <v-validation-observer
                      v-if="!!payment.document"
                      ref="form"
                      v-slot="{ handleSubmit, invalid }"
                    >
                      <v-form @submit.prevent="handleSubmit(onPay)">
                        <v-card flat color="transparent">
                          <v-card-text>
                            <v-row dense>
                              <v-col cols="12" sm="12" md="4">
                                <v-card-subtitle
                                  tag="h1"
                                  class="display-serif-1"
                                >
                                  Total a pagar
                                </v-card-subtitle>
                                <v-card-title tag="h1" class="display-serif-3">
                                  $ {{ payment.amount }}
                                </v-card-title>
                                <v-card-text>
                                  {{ payment.concept }}
                                  <v-list
                                    v-if="!!payment.details"
                                    three-line
                                    dense
                                  >
                                    <v-list-item-content>
                                      <v-list-item-title
                                        v-text="
                                          `Tarifa: ${payment.details.type}`
                                        "
                                      />
                                      <v-list-item-subtitle
                                        v-text="
                                          `Estrato: ${payment.details.stratum}`
                                        "
                                      />
                                      <v-list-item-subtitle
                                        v-text="
                                          `V. Unit: ${payment.details.unit}`
                                        "
                                      />
                                      <v-list-item-subtitle
                                        v-text="
                                          `Horas: ${payment.details.hours}`
                                        "
                                      />
                                    </v-list-item-content>
                                  </v-list>
                                </v-card-text>
                                <v-card-text>
                                  <app-timer
                                    tag="h2"
                                    class="display-serif-2"
                                    :time="
                                      Date.parse(payment.created_at) -
                                      Date.now()
                                    "
                                    @end="onTimeOut"
                                    v-slot="{ minutes, seconds }"
                                  >
                                    {{
                                      `Quedan: ${minutes} minuto(s): ${seconds} segundo(s) para completar el pago`
                                    }}
                                  </app-timer>
                                  <v-icon size="50">$vuetify.icons.pse</v-icon>
                                </v-card-text>
                              </v-col>
                              <v-col cols="12" sm="12" md="8">
                                <v-card-subtitle
                                  tag="h1"
                                  class="display-serif-1"
                                >
                                  Datos quien toma el servicio
                                </v-card-subtitle>
                                <v-input-template
                                  i18n_path="payment"
                                  :inputs="sections"
                                  :loading="loading"
                                  :form="payment"
                                >
                                  <template #[`prepend-input-7`]>
                                    <v-card-subtitle
                                      tag="h1"
                                      class="display-serif-1"
                                    >
                                      Datos para facturación electrónica (Solo
                                      aplica para cursos de natación)
                                    </v-card-subtitle>
                                  </template>
                                </v-input-template>
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn
                              :aria-label="`${$t('buttons.Pay')} $ ${
                                payment.amount
                              }`"
                              type="submit"
                              :loading="loading"
                              :disabled="loading || invalid"
                              block
                              color="primary"
                            >
                              {{
                                `${$t("buttons.Pay")} $ ${payment.amount || 0}`
                              }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-form>
                    </v-validation-observer>
                    <v-empty-state
                      v-else
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
                        {{ `${$t("buttons.Update")} ${$t("router.profile")}` }}
                      </v-btn>
                    </v-empty-state>
                  </v-col>
                </v-window-item>
              </v-window>
            </v-row>
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
    <v-overlay opacity="6" :value="overlay">
      <v-card flat color="transparent">
        <v-card-title tag="h2" class="display-serif-2 text-center align-center">
          Te estamos redirigiendo a tu banco.
        </v-card-title>
        <v-card-text>
          <app-animation
            :animation-data="animation"
            loop
            auto-play
            width="200"
            height="200"
          />
        </v-card-text>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import * as cashback from "@/assets/anims/cashback.json";
import ColorThief from "colorthief";
import { debounce } from "lodash";
import { Booking } from "@/models/services/Booking";
import { rgbToHex } from "@/util/helpers";
export default {
  name: "BookingDates",
  props: {
    item: {
      type: Object,
      default: () => ({
        park_endowment_id: null,
        endowment_id: null,
        park_id: null,
        park_name: null,
        park_address: null,
        park_code: null,
        endowment_description: null,
        image: null,
        locality_id: null,
        locality: null,
        upz_id: null,
        upz_code: null,
        upz: null,
        details: [],
      }),
    },
  },
  data: (vm) => ({
    animation: cashback.default,
    categories: ["Disponible", "Reservado"],
    step: 0,
    query: null,
    overlay: false,
    loading: false,
    requested_at: null,
    form: new Booking({
      date: vm.$moment().add(1, "day").format("YYYY-MM-DD"),
      start_hour: null,
      final_hour: null,
    }),
    times: [],
    errors: [],
    payment: new Booking({
      name: null,
      surname: null,
      document_type_id: null,
      document: null,
      email: null,
      address: null,
      phone: null,
      booking_id: null,
      amount: null,
      documentTypeSelectedPayer: null,
      documentPayer: null,
      namePayer: null,
      lastNamePayer: null,
      phonePayer: null,
      emailPayer: null,
      addressPayer: null,
      park_id: null,
      service_id: null,
      concept: null,
      person_type_id: null,
      bank_id: null,
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
    typePersons: [
      { id: "N", name: "Natural" },
      { id: "J", name: "Jurídico" },
    ],
    // https://api.ipify.org/?format=json
    current_ip: null,
    endowment: {
      details: {
        all_day: false,
      },
    },
    color: "",
    proxy:
      "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=",
    keys: [
      // value: "description", flex: 12 },
      // { value: "equipment", flex: 3 },
      // { value: "endowment", flex: 3 },
      { value: "economic_use", flex: 3 },
      { value: "endowment_num", flex: 3 },
      { value: "dunt", flex: 3 },
      { value: "capacity", flex: 3 },
      { value: "status", flex: 3 },
      { value: "material", flex: 3 },
      { value: "floor_material", flex: 3 },
      { value: "illumination", flex: 3 },
      { value: "water", flex: 3 },
      { value: "light", flex: 3 },
      { value: "gas", flex: 3 },
      { value: "lane", flex: 3 },
      { value: "positioning", flex: 3 },
      { value: "destination", flex: 3 },
      { value: "area", flex: 3 },
      { value: "long", flex: 3 },
      { value: "width", flex: 3 },
      { value: "enclosure", flex: 3 },
      { value: "enclosure_type", flex: 3 },
      { value: "enclosure_height", flex: 3 },
      { value: "covered", flex: 3 },
      { value: "bath", flex: 3 },
      { value: "sanitary_battery", flex: 3 },
      { value: "dressing_room", flex: 3 },
      { value: "male_bath", flex: 3 },
      { value: "female_bath", flex: 3 },
      { value: "disabled_bath", flex: 3 },
      { value: "car_parking", flex: 3 },
      { value: "bike_parking", flex: 3 },
      { value: "date", flex: 3 },
      { value: "maintenance_diagnosis", flex: 12, class: "text-wrap" },
      { value: "construction_diagnosis", flex: 12, class: "text-wrap" },
    ],
    icons: {
      equipment: "mdi-dots-horizontal",
      endowment: "mdi-dots-horizontal",
      description: "mdi-text",
      endowment_num: "mdi-numeric",
      status: "mdi-clipboard-check-outline",
      material: "mdi-soccer-field",
      illumination: "mdi-lightbulb-outline",
      economic_use: "mdi-currency-usd",
      area: "mdi-shape-square-plus",
      floor_material: "mdi-soccer-field",
      dressing_room: "mdi-home-city-outline",
      light: "mdi-lightbulb-outline",
      water: "mdi-water",
      gas: "mdi-gas-cylinder",
      capacity: "mdi-pound",
      lane: "mdi-highway",
      bath: "mdi-paper-roll-outline",
      sanitary_battery: "mdi-shower",
      maintenance_diagnosis: "mdi-clipboard-check-outline",
      construction_diagnosis: "mdi-clipboard-check-outline",
      positioning: "mdi-clipboard-text",
      destination: "mdi-clipboard-text",
      date: "mdi-calendar",
      enclosure: "mdi-door-closed",
      enclosure_type: "mdi-door-closed",
      enclosure_height: "mdi-arrow-split-horizontal",
      long: "mdi-arrow-split-vertical",
      width: "mdi-arrow-split-vertical",
      covered: "mdi-home",
      dunt: "mdi-skateboarding",
      male_bath: "mdi-numeric",
      female_bath: "mdi-numeric",
      disabled_bath: "mdi-numeric",
      car_parking: "mdi-parking",
      bike_parking: "mdi-parking",
    },
  }),
  mounted() {
    this.getBanks();
    this.getData();
    this.getIp();
  },
  methods: {
    getIp() {
      fetch("https://api.ipify.org/?format=json")
        .then((ip) => ip.json())
        .then(({ ip }) => {
          this.current_ip = ip;
        })
        .catch(() => {
          this.current_ip = "201.0.90.17";
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
    getEventColor(event) {
      return event.color || "primary";
    },
    getData: debounce(function () {
      this.loading = true;
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .schedules(this.$route.params.id, {
          params: { date: this.form.date },
        })
        .then((response) => {
          this.times = response.data.map((time) => {
            return {
              ...time,
              name: time.title,
              start: this.$moment(time.start).format("YYYY-MM-DD HH:mm"),
              end: this.$moment(time.end).format("YYYY-MM-DD HH:mm"),
            };
          });
          this.endowment = response.details;
          if (this.endowment.details.all_day && this.times.length > 0) {
            this.form.start_hour = "8:00 AM";
            this.form.final_hour = "5:00 PM";
          } else {
            this.form.start_hour = null;
            this.form.final_hour = null;
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    }, 300),
    onSubmit() {
      this.loading = true;
      this.form.setFormInstance(this.$refs.basic);
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .payment(this.$route.params.id)
        .then((response) => {
          this.payment = new Booking({
            ...response.data,
            isTheSame: false,
            paymentDocumentTypeSelected: null,
            paymentDocument: null,
            paymentName: null,
            paymentLastName: null,
            paymentPhone: null,
            paymentEmail: null,
            addressPayer: null,
            ip_address: this.current_ip,
          });
        })
        .then(() => {
          this.step = 1;
        })
        .catch((errors) => {
          this.errors = errors.details || [];
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onPay() {
      this.loading = true;
      this.overlay = true;
      const data = {
        reservationId: this.payment.booking_id,
        permitTypeSelected: "PO",
        permitNumber: "999",
        name: this.payment.name,
        lastName: this.payment.surname,
        phone: this.payment.phone,
        email: this.payment.email,
        address: this.payment.address,
        documentTypeSelected: this.payment.document_type_id,
        document: this.payment.document,
        parkSelected: this.payment.park_id,
        serviceParkSelected: this.payment.service_id,
        isTheSame: this.payment.isTheSame,
        documentTypeSelectedPayer: this.payment.documentTypeSelectedPayer,
        documentPayer: this.payment.documentPayer,
        namePayer: this.payment.namePayer,
        lastNamePayer: this.payment.lastNamePayer,
        phonePayer: this.payment.phonePayer,
        emailPayer: this.payment.emailPayer,
        addressPayer: this.payment.addressPayer,
        concept: this.payment.concept,
        totalPay: this.payment.amount,
        typePersonSelected: this.payment.person_type_id,
        typePersonSelectedPayer: this.payment.person_type_id,
        BankTypeSelected: this.payment.bank_id,
        redirect_url: window.location.origin + process.env.VUE_APP_PSE_REDIRECT,
        ip_address: this.current_ip,
      };
      this.payment = new Booking(data);
      this.payment.resetOnlyWhenUpdate = false;
      this.payment
        .transfer()
        .then((response) => {
          if (response.data.bank_url) {
            window.location.href = response.data.bank_url;
          } else {
            this.$snackbar.error(
              "El servicio de pagos en línea PSE no está disponible en este momento, por favor intenta más tarde"
            );
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
          this.overlay = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getImage: debounce(async function () {
      const img = await document.querySelector("img");
      const color = new ColorThief();
      const that = this;
      if (img.complete) {
        that.color = rgbToHex(...color.getColor(img));
      } else {
        img.addEventListener("load", function () {
          that.color = rgbToHex(...color.getColor(img));
        });
      }
    }, 300),
    onTimeOut() {
      this.errors = [
        "El tiempo de reserva ha finalizado, por favor vuelva a realizar el proceso de reserva.",
      ];
      this.payment = new Booking({
        name: null,
        surname: null,
        document_type_id: null,
        document: null,
        email: null,
        phone: null,
        address: null,
        booking_id: null,
        amount: null,
        isTheSame: false,
        documentTypeSelectedPayer: null,
        documentPayer: null,
        namePayer: null,
        lastNamePayer: null,
        phonePayer: null,
        addressPayer: null,
        emailPayer: null,
        park_id: null,
        service_id: null,
        concept: null,
        person_type_id: null,
        bank_id: null,
        ip_address: null,
      });
      this.getData();
      this.step = 0;
    },
  },
  computed: {
    endowments() {
      return this.keys.filter(
        (key) => !!this.endowment.details && !!this.endowment.details[key.value]
      );
    },
    hours() {
      const am = [6, 7, 8, 9, 10, 11];
      const pm = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const picker = am.map((time) => {
        return {
          id: `${time}:00 AM`,
          name: `${time}:00 AM`,
        };
      });
      picker.push(
        ...pm.map((time) => {
          return {
            id: `${time}:00 PM`,
            name: `${time}:00 PM`,
          };
        })
      );
      return picker;
    },
    days() {
      const days = [1, 2, 3, 4, 5, 6, 7];
      return days.map((day) => {
        return {
          id: this.$moment().add(day, "day").format("YYYY-MM-DD"),
          name: this.$moment()
            .locale(this.$i18n.locale)
            .add(day, "day")
            .format("ddd DD MMM"),
        };
      });
    },
    image() {
      return this.endowment.image
        ? this.endowment.image
        : require("@/assets/img/dashboard/booking/field.jpg");
    },
    imageColor() {
      return this.endowment.image
        ? `${this.proxy}${encodeURIComponent(this.endowment.image)}`
        : require("@/assets/img/dashboard/booking/field.jpg");
    },
    sections() {
      const that = this;
      return [
        {
          name: "document_type_id",
          icon: "mdi-card-account-details",
          type: "select",
          rules: that.payment.validations.required,
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
          rules: that.payment.validations.input_document_required,
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
          rules: that.payment.validations.input_names_required,
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
          name: "surname",
          icon: "mdi-dots-horizontal",
          type: "text",
          rules: that.payment.validations.input_names_required,
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
          rules: that.payment.validations.input_email_required,
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
          name: "phone",
          icon: "mdi-phone",
          type: "tel",
          rules: that.payment.validations.input_phone_mobile_required,
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
        {
          name: "address",
          icon: "mdi-pin",
          type: "text",
          rules: that.payment.validations.required,
          flex: 6,
          attrs: {
            disabled: !!that.payment.address,
            minlength: 3,
            maxlength: 195,
            required: true,
            autocomplete: "address",
            counter: 195,
          },
        },
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
                  that.payment.document_type_id;
                that.payment.documentPayer = that.payment.document;
                that.payment.namePayer = that.payment.name;
                that.payment.lastNamePayer = that.payment.surname;
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
        // Payer
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
        {
          name: "addressPayer",
          icon: "mdi-pin",
          type: "text",
          rules: that.payment.validations.required,
          flex: 6,
          attrs: {
            minlength: 3,
            maxlength: 195,
            required: true,
            autocomplete: "address",
            counter: 195,
          },
        },
        {
          name: "person_type_id",
          icon: "mdi-account",
          type: "select",
          rules: that.payment.validations.required,
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
          name: "bank_id",
          icon: "mdi-domain",
          type: "autocomplete",
          rules: that.payment.validations.required,
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
    tutorial() {
      const validation =
        this.endowment.details && this.endowment.details.tutorials;
      return {
        title: validation
          ? this.endowment.details.tutorials.title
          : "Video de YouTube",
        video: validation ? this.endowment.details.tutorials.video : undefined,
      };
    },
  },
  watch: {
    "endowment.image"(val) {
      return val && this.getImage();
    },
    item(val) {
      this.endowment = val;
    },
  },
};
</script>
