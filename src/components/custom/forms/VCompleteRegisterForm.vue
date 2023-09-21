<template>
  <v-form-template
    ref="completeForm"
    :i18n_path="i18n_path"
    :form.sync="form"
    :sections="registerFields"
    :loading="loading"
    with-title
    method="register"
    reset-form
    @submitting="start"
    @finished="finish"
    @success="onSuccess"
    @error="onError"
  >
    <template #[`append-form-0`]="{ model }">
      <v-card flat color="transparent">
        <v-card-text class="text-center">
          <h2 class="font-weight-regular my-2">
            Digita el código de verificación recibido.
          </h2>
          <v-validation-provider
            v-slot="{ errors }"
            :rules="{
              required: true,
              numeric: true,
              digits: 6,
            }"
            vid="code"
            name="código de validación"
          >
            <v-otp-input
              id="code"
              name="code"
              v-model="model.code"
              :error-messages="errors"
              length="6"
              :readonly="loading"
              v-number-only
              @finish="onValidate"
            />
          </v-validation-provider>
        </v-card-text>
      </v-card>
    </template>
    <template #[`prepend-form-5`]>
      <v-col cols="12">
        <h2 class="font-weight-regular">
          Por favor adjunta un escáner en formato PDF de tu documento de
          identidad por ambas caras, preferiblemente en una sola página.
        </h2>
      </v-col>
    </template>
    <template #message>
      <v-btn
        :aria-label="$t('buttons.Login')"
        color="primary"
        class="mx-auto"
        outlined
        :to="{ name: 'Login' }"
        v-text="$t('buttons.Login')"
      />
    </template>
  </v-form-template>
</template>

<script>
import { debounce } from "lodash";
import { DocumentType } from "@/models/services/portal/DocumentType";
import { Country } from "@/models/services/portal/Country";
import { Locality } from "@/models/services/portal/Locality";
import { Sex } from "@/models/services/portal/Sex";
import { BloodType } from "@/models/services/portal/BloodType";
import { Disability } from "@/models/services/portal/Disability";
import { EthnicGroup } from "@/models/services/portal/EthnicGroup";
import { Eps } from "@/models/services/portal/Eps";
import { Gender } from "@/models/services/portal/Gender";
import { Orientation } from "@/models/services/portal/Orientation";
import { PopulationGroup } from "@/models/services/portal/PopulationGroup";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import { User } from "@/models/services/User";
const COLOMBIA = 47;
const BOGOTA = 12688;
const DOCUMENT_CC = 1;
const DOCUMENT_TI = 2;
const DOCUMENT_RC = 3;
const other_locality = {
  id: 22,
  name: "OTRO MUNICIPIO O CIUDAD",
  created_at: null,
  updated_at: null,
  deleted_at: null,
};
export default {
  name: "VCompleteRegisterForm",
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
  props: {
    preData: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    i18n_path: "portal.forms.beneficiary",
    loading: false,
    form: new User({
      autovalidate: false,
      file: null,
      document_type_id: null,
      document: null,
      name: null,
      s_name: null,
      birthdate: null,
      surname: null,
      s_surname: null,
      email: null,
      code: null,
      password: null,
      password_confirmation: null,
      terms: true,
      sex: null,
      blood_type: null,
      decoded: false,
      ...new Beneficiary().data(),
    }),
    // Selectors
    document_type: new DocumentType(),
    document_types: [],
    birth_country: new Country(),
    birth_countries: [],
    birth_states: [],
    birth_cities: [],
    residence_country: new Country(),
    residence_countries: [],
    residence_states: [],
    residence_cities: [],
    locality: new Locality(),
    localities: [],
    upz: [],
    neighborhoods: [],
    sex: new Sex(),
    sex_values: [],
    blood_type: new BloodType(),
    blood_types: [],
    disability: new Disability(),
    disabilities: [],
    ethnic_group: new EthnicGroup(),
    ethnic_groups: [],
    eps: new Eps(),
    epss: [],
    gender: new Gender(),
    genders: [],
    orientation: new Orientation(),
    orientations: [],
    population: new PopulationGroup(),
    population_groups: [],
    errors: {},
    responseText: undefined,
    age: null,
    min: undefined,
    max: undefined,
    // Data
    disableMail: false,
  }),
  created() {
    if (this.preData.email) {
      this.disableMail = true;
      this.onSetForm(this.preData);
    }
  },
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
    getCountries() {
      this.loading = true;
      this.birth_states = [];
      this.residence_states = [];
      this.birth_cities = [];
      this.residence_cities = [];
      this.birth_country
        .index()
        .then((response) => {
          this.birth_countries = response.data;
        })
        .then(() => {
          this.residence_countries = this.birth_countries;
        })
        .then(() => {
          if (!this.form.country_residence_id) {
            this.form.country_residence_id = COLOMBIA;
            this.getResidenceStates(COLOMBIA);
          }
          if (!this.form.country_birth_id) {
            this.form.country_birth_id = COLOMBIA;
            this.getBirthStates(COLOMBIA);
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getBirthStates(country_id, resetField = true) {
      this.loading = true;
      if (resetField) {
        this.form.city_birth_id = null;
      }
      this.birth_states = [];
      this.birth_cities = [];
      if (!country_id) {
        this.loading = false;
        return;
      }
      this.birth_country
        .states(country_id)
        .then((response) => {
          this.birth_states = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getBirthCities(state_id) {
      this.loading = true;
      this.birth_cities = [];
      if (!state_id) {
        this.loading = false;
        return;
      }
      this.birth_country
        .cities(this.form.country_birth_id, state_id)
        .then((response) => {
          this.birth_cities = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getResidenceStates(country_id, resetField = true) {
      this.loading = true;
      if (resetField) {
        this.form.city_residence_id = null;
      }
      this.residence_states = [];
      this.residence_cities = [];
      if (!country_id) {
        this.loading = false;
        return;
      }
      this.residence_country
        .states(country_id)
        .then((response) => {
          this.residence_states = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getResidenceCities(state_id) {
      this.loading = true;
      this.residence_cities = [];
      if (!state_id) {
        this.loading = false;
        return;
      }
      this.residence_country
        .cities(this.form.country_residence_id, state_id)
        .then((response) => {
          this.residence_cities = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getLocalities(city_id, resetField = true) {
      this.localities = [];
      this.upz = [];
      this.neighborhoods = [];
      if (resetField) {
        this.form.locality_id = null;
        this.form.upz_id = null;
        this.form.neighborhood_id = null;
      }
      if (!city_id) {
        return;
      }
      if (city_id !== BOGOTA) {
        this.localities.push(other_locality);
      } else {
        this.loading = true;
        const params = {
          where_not_in: "21",
        };
        this.locality
          .index({ params })
          .then((response) => {
            this.localities = response.data;
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    getUpz(locality_id, resetField = true) {
      if (resetField) {
        this.form.upz_id = null;
        this.form.neighborhood_id = null;
      }
      this.loading = true;
      this.upz = [];
      this.neighborhoods = [];
      if (!locality_id) {
        this.loading = false;
        return;
      }
      this.locality
        .upz(locality_id)
        .then((response) => {
          this.upz = response.data;
        })
        .then(() => {
          if (!resetField && this.form.upz_id) {
            this.getNeighborhoods(this.form.upz_id, false);
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getNeighborhoods(upz_code, resetField = true) {
      if (resetField) {
        this.form.neighborhood_id = null;
      }
      if (!upz_code) {
        return;
      }
      const upzId = this.upz.filter((upz) => upz.upz_code === upz_code);
      this.neighborhoods = [];
      if (upzId.length && upzId[0].id) {
        this.loading = true;
        const params = {
          where_not_in: "1270,1271,1293",
        };
        this.locality
          .neighborhoods(this.form.locality_id, upzId[0].id, { params })
          .then((response) => {
            this.neighborhoods = response.data;
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    getSex() {
      this.loading = true;
      this.sex
        .index()
        .then((response) => {
          this.sex_values = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getRH() {
      this.loading = true;
      this.blood_type
        .index()
        .then((response) => {
          this.blood_types = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getDisability() {
      this.loading = true;
      const params = {
        where_not_in: "6",
      };
      this.disability
        .index({ params })
        .then((response) => {
          this.disabilities = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getEthnicGroup() {
      this.loading = true;
      const params = {
        where_not_in: "2,4,6,7,8,9,10",
      };
      this.ethnic_group
        .index({ params })
        .then((response) => {
          this.ethnic_groups = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getEps() {
      this.loading = true;
      this.eps
        .index()
        .then((response) => {
          this.epss = response.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getGenders() {
      this.loading = true;
      this.gender
        .index()
        .then((response) => {
          this.genders = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOrientation() {
      this.loading = true;
      this.orientation
        .index()
        .then((response) => {
          this.orientations = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getPopulationGroup() {
      this.loading = true;
      const params = {
        where_not_in: "2,4,8",
      };
      this.population
        .index({ params })
        .then((response) => {
          this.population_groups = response.data;
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
      const that = this;
      this.responseText = response.data;
      this.$snackbar.success(response.data);
      const goToLogin = debounce(function () {
        that.$router.push({ name: "Login" });
      }, 800);
      goToLogin();
    },
    onError(errors) {
      this.errors = errors;
    },
    onValidate() {
      this.start();
      this.form
        .preRegisterValidation()
        .then((response) => {
          this.disableMail = true;
          this.onSetForm(response.data);
          this.$refs.completeForm.setStep(1);
        })
        .catch((errors) => {
          this.form.code = null;
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.finish();
        });
    },
    onSetForm(data = {}) {
      this.form = new User({
        autovalidate: false,
        file: null,
        document_type_id: null,
        document: null,
        name: null,
        s_name: null,
        birthdate: null,
        surname: null,
        s_surname: null,
        email: null,
        password: null,
        password_confirmation: null,
        terms: true,
        sex: null,
        blood_type: null,
        decoded: false,
        code: null,
        ...new Beneficiary().data(),
        ...data,
      });
      if (!this.form.country_residence_id) {
        this.form.country_residence_id = COLOMBIA;
        this.getResidenceStates(COLOMBIA);
      }
      if (!this.form.country_birth_id) {
        this.form.country_birth_id = COLOMBIA;
        this.getBirthStates(COLOMBIA);
      }
    },
  },
  mounted() {
    this.min = this.$moment(this.$moment().subtract(1, "day"))
      .subtract(120, "years")
      .toISOString();
    this.max = this.$moment(this.$moment().subtract(1, "day"))
      .subtract(18, "years")
      .toISOString();
    this.getDocumentTypes();
    this.getCountries();
    this.getSex();
    this.getRH();
    this.getEthnicGroup();
    this.getEps();
    this.getDisability();
    this.getGenders();
    this.getOrientation();
    this.getPopulationGroup();
  },
  computed: {
    hideDisability() {
      return ["NO", null].includes(this.form.has_disability);
    },
    hideOtherNeighborhood() {
      return ![-1].includes(this.form.neighborhood_id);
    },
    registerFields() {
      const that = this;
      const inputs = [
        // Verification Code
        {
          title: "Código de Verificación",
          fields: [
            {
              name: "email",
              icon: "mdi-email",
              type: "email",
              rules: that.form.validations.input_email_required,
              flex: 12,
              attrs: {
                minlength: 3,
                maxlength: 125,
                required: true,
                disabled: that.disableMail,
                readonly: that.disableMail,
                autocomplete: "email",
                counter: 125,
              },
            },
          ],
        },
        // Personal Info
        {
          title: that.$t(`${that.i18n_path}.titles.personalInfo`),
          fields: [
            {
              name: "document_type_id",
              icon: "mdi-card-account-details",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
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
        // Fecha de Nacimiento
        {
          title: that.$t(`${that.i18n_path}.titles.ageConfirmation`),
          fields: [
            {
              name: "birthdate",
              icon: "mdi-calendar",
              type: "birthday",
              rules: that.form.validations.input_date_required,
              dialog_model: false,
              flex: 6,
              attrs: {
                required: true,
                autocomplete: "off",
                readonly: true,
              },
              pickerAttrs: {
                locale: that.$i18n.locale,
                min: that.min,
                max: that.max,
              },
            },
            {
              name: "country_birth_id",
              icon: "mdi-map",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.birth_countries,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change: that.getBirthStates,
                "click:clear": function () {
                  that.form.state_birth_id = null;
                  that.form.city_birth_id = null;
                  that.birth_states = [];
                  that.birth_cities = [];
                },
              },
            },
            {
              name: "state_birth_id",
              icon: "mdi-map-marker",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.birth_states,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change: that.getBirthCities,
                "click:clear": function () {
                  that.form.city_birth_id = null;
                  that.birth_cities = [];
                },
              },
            },
            {
              name: "city_birth_id",
              icon: "mdi-crosshairs-gps",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.birth_cities,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
          ],
        },
        // Residence info
        {
          title: that.$t(`${that.i18n_path}.titles.residenceInfo`),
          fields: [
            {
              name: "country_residence_id",
              icon: "mdi-map",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.residence_countries,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change: that.getResidenceStates,
                "click:clear": function () {
                  that.form.state_residence_id = null;
                  that.form.city_residence_id = null;
                  that.form.locality_id = null;
                  that.form.upz_id = null;
                  that.form.neighborhood_id = null;
                  that.localities = [];
                  that.upz = [];
                  that.neighborhoods = [];
                  that.residence_states = [];
                  that.residence_cities = [];
                },
              },
            },
            {
              name: "state_residence_id",
              icon: "mdi-map-marker",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.residence_states,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change: that.getResidenceCities,
                "click:clear": function () {
                  that.form.city_residence_id = null;
                  that.residence_cities = [];
                  that.form.locality_id = null;
                  that.form.upz_id = null;
                  that.form.neighborhood_id = null;
                  that.localities = [];
                  that.upz = [];
                  that.neighborhoods = [];
                },
              },
            },
            {
              name: "city_residence_id",
              icon: "mdi-crosshairs-gps",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.residence_cities,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change: that.getLocalities,
                "click:clear": function () {
                  that.form.locality_id = null;
                  that.form.upz_id = null;
                  that.form.neighborhood_id = null;
                  that.localities = [];
                  that.upz = [];
                  that.neighborhoods = [];
                },
              },
            },
            {
              name: "locality_id",
              icon: "mdi-sign-real-estate",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.localities,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change: that.getUpz,
                "click:clear": function () {
                  that.form.upz_id = null;
                  that.form.neighborhood_id = null;
                  that.upz = [];
                  that.neighborhoods = [];
                },
              },
            },
            {
              name: "upz_id",
              icon: "mdi-tag",
              type: "autocomplete",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.upz,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "upz_code",
                itemText: "composed_name",
              },
              on: {
                change: that.getNeighborhoods,
                "click:clear": function () {
                  that.form.neighborhood_id = null;
                  that.neighborhoods = [];
                },
              },
            },
            {
              name: "neighborhood_id",
              icon: "mdi-city",
              type: "autocomplete",
              rules: that.form.validations.required,
              flex: 6,
              values: that.neighborhoods,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                "click:clear": function () {
                  that.form.other_neighborhood_name = null;
                },
              },
            },
            {
              name: "other_neighborhood_name",
              icon: "mdi-city",
              type: "text",
              rules: that.form.validations.input_text_required,
              hide: that.hideOtherNeighborhood,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 191,
                required: true,
                autocomplete: "street-address",
                counter: 191,
              },
            },
            {
              name: "address",
              icon: "mdi-routes",
              type: "text",
              rules: that.form.validations.input_text_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 191,
                required: true,
                autocomplete: "street-address",
                counter: 191,
              },
            },
            {
              name: "stratum",
              icon: "mdi-layers",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: [
                { id: 1, name: 1 },
                { id: 2, name: 2 },
                { id: 3, name: 3 },
                { id: 4, name: 4 },
                { id: 5, name: 5 },
                { id: 6, name: 6 },
              ],
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "mobile_phone",
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
          ],
        },
        // Details Info
        {
          title: that.$t(`${that.i18n_path}.titles.detailsInfo`),
          fields: [
            {
              name: "sex",
              icon: "mdi-human-male-female",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.sex_values,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "gender_id",
              icon: "mdi-google-circles-extended",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.genders,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "sexual_orientation_id",
              icon: "mdi-gender-transgender",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.orientations,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "population_group_id",
              icon: "mdi-account-group",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.population_groups,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "blood_type",
              icon: "mdi-water",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.blood_types,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "ethnic_group_id",
              icon: "mdi-earth",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.ethnic_groups,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "eps_id",
              icon: "mdi-hospital-box",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.epss,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "has_disability",
              icon: "mdi-wheelchair-accessibility",
              type: "select",
              rules: that.form.validations.required,
              flex: 6,
              values: [
                {
                  id: "NO",
                  name: that.$t(`${that.i18n_path}.disabilityValues.no`),
                },
                {
                  id: "SI",
                  name: that.$t(`${that.i18n_path}.disabilityValues.yes`),
                },
              ],
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
              on: {
                change(val) {
                  if (["NO", null, undefined, ""].includes(val)) {
                    that.form.disability_id = null;
                  }
                },
              },
            },
            {
              name: "disability_id",
              icon: "mdi-wheelchair-accessibility",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              hide: that.hideDisability,
              values: that.disabilities,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            /*
            {
              name: "contact_relationship",
              icon: "mdi-account",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: [
                {
                  id: 3,
                  name: that.$t(`${that.i18n_path}.relationshipValues.parents`),
                },
                {
                  id: 7,
                  name: that.$t(`${that.i18n_path}.relationshipValues.tutor`),
                },
              ],
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
             */
            {
              name: "contact_name",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: that.form.validations.input_text_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 191,
                required: true,
                autocomplete: "given-name",
                hint: that.$t(`${that.i18n_path}.contact_name`),
                persistentHint: true,
                counter: 191,
              },
            },
            {
              name: "contact_phone",
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
          ],
        },
        // File
        {
          title: "Documento de identidad",
          fields: [
            {
              name: "file",
              type: "dropzone",
              rules: that.form.validations.pdf_file_required,
              flex: 12,
              attrs: {
                accept: "application/pdf",
              },
              on: {
                decode: (val) => {
                  that.loadData(val.birthdate);
                  that.form.decoded = true;
                  that.form.birthdate = val.birthdate;
                  that.form.document = val.document;
                  that.form.name = val.first_name;
                  that.form.s_name = val.middle_name;
                  that.form.surname = val.first_last_name;
                  that.form.s_surname = val.second_last_name;
                  that.form.sex = val.sex_id;
                  const bloodId = that.blood_types.filter(
                    (blood) => blood.name === val.blood_type
                  );
                  if (bloodId.length && bloodId[0].id) {
                    that.form.blood_type = bloodId[0].id;
                  }
                },
                error: () => {
                  that.form.decoded = false;
                },
              },
            },
          ],
        },
        // Email and password
        {
          title: "Credenciales",
          fields: [
            {
              name: "password",
              icon: "mdi-lock",
              type: "password",
              rules: that.form.validations.input_password_required,
              flex: 6,
              attrs: {
                minlength: 8,
                maxlength: 32,
                required: true,
                autocomplete: "new-password",
                counter: 32,
                hint: "La contraseña debe contener al menos 8 caracteres con una mayúscula, minúscula, números y caracteres especiales. Ejemplo: C0ntr4s3ñ4_53gur4",
                persistentHint: true,
              },
            },
            {
              name: "password_confirmation",
              icon: "mdi-lock",
              type: "password",
              rules:
                that.form.validations.input_password_confirmation("password"),
              flex: 6,
              attrs: {
                minlength: 8,
                maxlength: 32,
                required: true,
                autocomplete: "new-password",
                counter: 32,
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
  beforeDestroy() {
    this.form = new User({
      autovalidate: false,
      file: null,
      document_type_id: null,
      document: null,
      name: null,
      s_name: null,
      birthdate: null,
      surname: null,
      s_surname: null,
      email: null,
      password: null,
      password_confirmation: null,
      terms: true,
      sex: null,
      blood_type: null,
      decoded: false,
      code: null,
      ...new Beneficiary().data(),
    });
  },
};
</script>
