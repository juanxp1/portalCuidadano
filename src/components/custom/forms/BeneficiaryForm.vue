<template>
  <v-form-template
    :i18n_path="i18n_path"
    :form="form"
    :sections="fields"
    :loading="loading"
    with-title
    :method="method"
    :id="formData.id"
    reset-form
    @submitting="start"
    @finished="finish"
    @success="onSuccess"
    @error="onError"
  >
    <template #[`prepend-form-0`]>
      <v-col cols="12" sm="12" md="8">
        <v-expansion-panels mandatory>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <i18n path="portal.forms.beneficiary.panels.info.title" />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <template v-if="$route.name === 'Profile'">
                <i18n
                  class="mb-2"
                  path="portal.forms.beneficiary.panels.info.text"
                />
                <!--
                <app-md
                  v-text="$t('portal.forms.beneficiary.panels.info.list')"
                />
                -->
              </template>
              <template v-else>
                <i18n
                  class="mb-2"
                  path="portal.forms.beneficiary.panels.info.description"
                >
                  <template #btn>
                    <app-btn
                      color="primary"
                      x-small
                      path="router.profile"
                      icon-text="mdi-account"
                      :to="{ name: 'Profile' }"
                    />
                  </template>
                </i18n>
                <app-md
                  v-text="$t('portal.forms.beneficiary.panels.info.list')"
                />
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="!formData.verified_at">
            <v-expansion-panel-header>
              <i18n path="portal.forms.beneficiary.panels.requirements.title" />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <i18n tag="p" path="scan.text" />
              <v-img
                contain
                :src="documentFile"
                :lazy-src="documentFile"
                class="my-2"
                max-height="150px"
                :alt="$t('card.document')"
              />
              <ul>
                <i18n
                  tag="li"
                  class="caption"
                  path="portal.forms.beneficiary.panels.requirements.text"
                />
              </ul>
              <i18n tag="p" class="caption mt-2" path="scan.app">
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
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <help-accordion />
      </v-col>
    </template>
    <template v-if="!formData.verified_at" #[`append-form-1`]>
      <v-col v-if="hasDocumentFile" cols="12" sm="12" md="6">
        <v-list subheader>
          <v-subheader>
            Da click sobre la
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn icon color="danger" v-on="on" @click="hide_file = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cambiar archivo</span>
            </v-tooltip>
            si deseas cargar un nuevo documento de identidad.
          </v-subheader>
          <v-list-item>
            <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
              <v-avatar :color="form.document_file.color">
                <v-icon dark>mdi-file</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="form.document_file.file" />
              <v-list-item-subtitle v-text="form.document_file.file_type" />
              <v-list-item-subtitle>
                <v-avatar size="15" :color="form.document_file.color" left />
                {{ form.document_file.status }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <app-time-ago :date-time="form.document_file.created_at" />
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-btn
                    icon
                    color="error"
                    v-on="on"
                    @click="hide_file = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Cambiar archivo</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </template>
    <template #[`append-form-3`]>
      <v-dialog v-model="sex_dialog">
        <v-card flat>
          <v-card-title>
            Definiciones
            <v-spacer />
            <v-btn icon @click="sex_dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Definición</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cisgénero</td>
                  <td>
                    Persona cuya identidad de género y sexo asignado al nacer
                    son el mismo
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <!--
    <template #[`prepend-form-1`]>
      <v-col cols="12">
        <v-card style="height: 300px; overflow-y: scroll" flat>
          <v-card-text>
            <app-md>{{ consent.title }}</app-md>
            <v-divider class="my-2" />
            <app-md>{{ consent.text }}</app-md>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
    -->
  </v-form-template>
</template>

<script>
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import { DocumentType } from "@/models/services/portal/DocumentType";
import { Country } from "@/models/services/portal/Country";
import { Locality } from "@/models/services/portal/Locality";
import { Sex } from "@/models/services/portal/Sex";
import { Disability } from "@/models/services/portal/Disability";
import { BloodType } from "@/models/services/portal/BloodType";
import { EthnicGroup } from "@/models/services/portal/EthnicGroup";
import { Eps } from "@/models/services/portal/Eps";
import { Gender } from "@/models/services/portal/Gender";
import { Orientation } from "@/models/services/portal/Orientation";
import { PopulationGroup } from "@/models/services/portal/PopulationGroup";
import { Privacy } from "@/models/services/portal/Privacy";
import { sync } from "vuex-pathify";
import { get } from "lodash";
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
  name: "BeneficiaryForm",
  props: {
    formData: {
      type: Object,
      default: () => new Beneficiary().data(),
    },
    forProfile: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.form = new Beneficiary({
      ...this.formData,
      document_file: get(this.formData, "document_file", {}),
    });
    const maxAge = this.forProfile ? 18 : 0;
    this.min = this.$moment(this.$moment().subtract(1, "day"))
      .subtract(120, "years")
      .toISOString();
    this.max = this.$moment(this.$moment().subtract(1, "day"))
      .subtract(maxAge, "years")
      .toISOString();
    this.informedConsent();
    this.getDocumentTypes();
    this.getCountries();
    this.getSex();
    this.getRH();
    this.getEthnicGroup();
    this.getEps();
    this.getDisability();
    this.getPopulationGroup();
  },
  mounted() {
    this.form = new Beneficiary({
      ...this.formData,
      confirm_document: this.formData.document,
      document_file: get(this.formData, "document_file", {}),
    });
    this.hide_file = !!get(this.formData, "document_file.id", null);
    this.$nextTick(function () {
      this.presetForm(this.formData);
    });
  },
  data: () => ({
    documentFile: require("@/assets/img/dashboard/barcode/documento.png"),
    sex_dialog: false,
    loading: false,
    i18n_path: "portal.forms.beneficiary",
    privacy: new Privacy(),
    consent: {},
    form: new Beneficiary(),
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
    age: null,
    min: undefined,
    max: undefined,
    errors: {},
    hide_file: false,
  }),
  methods: {
    presetForm(form) {
      if (form.id) {
        if (form.birthdate) {
          this.loadData(form.birthdate, false);
        }
        if (form.country_birth_id) {
          this.getBirthStates(form.country_birth_id, false);
        }
        if (form.state_birth_id) {
          this.getBirthCities(form.state_birth_id);
        }
        if (form.country_residence_id) {
          this.getResidenceStates(form.country_residence_id, false);
        }
        if (form.state_residence_id) {
          this.getResidenceCities(form.state_residence_id);
        }
        if (form.city_residence_id) {
          this.getLocalities(form.city_residence_id, false);
        }
        if (form.locality_id) {
          this.getUpz(form.locality_id, false);
        }
        if (!["", null, undefined].includes(form.upz_id)) {
          this.getNeighborhoods(form.upz_id, false);
        }
      } else {
        if (this.profile.country_residence_id) {
          this.form.country_residence_id = this.profile.country_residence_id;
          this.getResidenceStates(this.form.country_residence_id, false);
        }
        if (this.profile.state_residence_id) {
          this.form.state_residence_id = this.profile.state_residence_id;
          this.getResidenceCities(this.form.state_residence_id, false);
        }
        if (this.profile.city_residence_id) {
          this.form.city_residence_id = this.profile.city_residence_id;
          this.getLocalities(this.form.city_residence_id, false);
        }
        if (this.profile.locality_id) {
          this.form.locality_id = this.profile.locality_id;
          this.getUpz(this.form.locality_id, false);
        }
        if (!["", null, undefined].includes(this.profile.upz_id)) {
          this.form.upz_id = this.profile.upz_id;
          this.getNeighborhoods(this.form.upz_id, false);
        }
        if (this.profile.neighborhood_id) {
          this.form.neighborhood_id = this.profile.neighborhood_id;
        }
        if (this.profile.other_neighborhood_name) {
          this.form.other_neighborhood_name =
            this.profile.other_neighborhood_name;
        }
        if (this.profile.address) {
          this.form.address = this.profile.address;
        }
        if (this.profile.stratum) {
          this.form.stratum = this.profile.stratum;
        }
        if (this.profile.mobile_phone) {
          this.form.mobile_phone = this.profile.mobile_phone;
        }
        if (this.profile.contact_phone) {
          this.form.contact_phone = this.profile.contact_phone;
        }
        if (this.profile.full_name) {
          this.form.contact_name = this.profile.full_name;
        }
      }
    },
    onSuccess(response) {
      this.$snackbar.success(response.data);
      this.$emit("success");
    },
    onError(errors) {
      this.errors = errors;
    },
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
    loadData(val, resetFields = true) {
      const that = this;
      if (val && that.$moment(val).isValid()) {
        that.age = that.$moment().diff(val, "years");
        that.$nextTick(function () {
          if (that.age < 18) {
            that.form.gender_id = null;
            that.form.sexual_orientation_id = null;
          }
          that.getGenders(that.age, resetFields);
          that.getOrientation(that.age, resetFields);
        });
      } else {
        that.document_types = [];
        that.genders = [];
        that.orientations = [];
      }
    },
    getDocumentTypes() {
      /*
      const where_in =
        parseInt(age) < 18 ? "2,3,6,12" : "1,4,5,6,7,8,9,10,11,12,13,14";
       */
      const options = this.forProfile
        ? { params: { where_in: "1,4,6,7,14,15" } }
        : { params: { where_in: "3" } };
      this.loading = true;
      this.document_type
        .index(options)
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
          if (
            !resetField &&
            !["", null, undefined].includes(this.form.upz_id)
          ) {
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
      if (["", null, undefined].includes(upz_code)) {
        return;
      }
      const upzId = this.upz.filter((upz) => upz.upz_code === upz_code);
      this.neighborhoods = [];
      if (upzId.length && !["", null, undefined].includes(upzId[0].id)) {
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
    getGenders(age, resetField = true) {
      if (resetField) {
        this.form.gender_id = null;
      }
      this.genders = [];
      if (age >= 18) {
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
      }
    },
    getOrientation(age, resetField = true) {
      if (resetField) {
        this.form.sexual_orientation_id = null;
      }
      this.orientations = [];
      if (age >= 18) {
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
      }
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
    // Privacy
    informedConsent() {
      this.loading = true;
      this.privacy
        .consent()
        .then((response) => {
          this.consent = response.data;
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
    hasDocumentFile() {
      return !!get(this.form, "document_file.id", false);
    },
    method() {
      return this.formData.id ? "updateWithFiles" : "storeWithFiles";
    },
    hideOtherNeighborhood() {
      return ![-1].includes(this.form.neighborhood_id);
    },
    isAdult() {
      return this.age && this.age >= 18;
    },
    hideDisability() {
      return ["NO", null].includes(this.form.has_disability);
    },
    fields() {
      const that = this;
      const inputs = [
        {
          title: this.$t(`${this.i18n_path}.titles.instructions`),
          fields: [],
        },
        /*
        {
          title: this.$t(`${this.i18n_path}.titles.consent`),
          fields: [
            {
              name: "informed_consent",
              type: "checkbox",
              rules: this.form.validations.required,
              flex: 12,
              attrs: {
                required: true,
                value: 1,
              },
            },
          ],
        },
         */
        {
          title: this.$t(`${this.i18n_path}.titles.validation`),
          hide: !!that.formData.verified_at,
          fields: [
            {
              name: "relationship",
              icon: "mdi-account",
              type: "select",
              rules: this.form.validations.required,
              flex: 6,
              hide: this.forProfile,
              values: [
                { id: "HIJO/A", name: "HIJO/A" },
                { id: "TUTELADO", name: "TUTELADO" },
              ],
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "document_type_id",
              icon: "mdi-card-account-details",
              type: "select",
              rules: this.form.validations.input_number_required,
              flex: this.forProfile ? 12 : 6,
              values: this.document_types,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "combined",
              },
              on: {
                change: (val) => {
                  that.form.birthdate = null;
                  that.form.decoded = false;
                  if ([DOCUMENT_TI, DOCUMENT_RC].includes(val)) {
                    that.form.gender_id = null;
                    that.form.sexual_orientation_id = null;
                    that.min = that
                      .$moment(this.$moment().subtract(364, "day"))
                      .subtract(17, "years")
                      .toISOString();
                  } else {
                    that.min = that
                      .$moment(this.$moment().subtract(1, "day"))
                      .subtract(120, "years")
                      .toISOString();
                  }
                },
              },
            },
            {
              name: "document",
              icon: "mdi-numeric",
              type: "numeric",
              rules: this.form.validations.input_document_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 12,
                required: true,
                autocomplete: "off",
                inputmode: "numeric",
                counter: 12,
                disabled: !!that.formData.verified_at,
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
            {
              name: "file",
              type: "dropzone",
              hide: that.hide_file,
              rules: get(that.form, "document_file.id", null)
                ? this.form.validations.pdf_file
                : this.form.validations.pdf_file_required,
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
                  const bloodId = this.blood_types.filter(
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
        // Fecha de Nacimiento
        {
          title: this.$t(`${this.i18n_path}.titles.ageConfirmation`),
          fields: [
            {
              name: "birthdate",
              icon: "mdi-calendar",
              type: "birthday",
              rules: this.form.validations.input_date_required,
              dialog_model: false,
              flex: 6,
              hide: !!that.formData.verified_at && !!that.formData.birthdate,
              attrs: {
                required: true,
                autocomplete: "off",
                readonly: true,
                disabled:
                  !!that.formData.verified_at && !!that.formData.birthdate,
              },
              on: {
                change: that.loadData,
              },
              pickerAttrs: {
                locale: that.$i18n.locale,
                min: that.min,
                max: that.max,
              },
            },
            {
              name: "relationship",
              icon: "mdi-account",
              type: "select",
              rules: this.form.validations.required,
              flex: 6,
              hide: !that.formData.verified_at || this.forProfile,
              values: [
                { id: "HIJO/A", name: "HIJO/A" },
                { id: "TUTELADO", name: "TUTELADO" },
              ],
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
            {
              name: "country_birth_id",
              icon: "mdi-map",
              type: "autocomplete",
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.birth_countries,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.birth_states,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.birth_cities,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
              },
            },
          ],
        },
        // Personal Info
        {
          title: this.$t(`${this.i18n_path}.titles.personalInfo`),
          hide: !!that.formData.verified_at,
          fields: [
            {
              name: "name",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: this.form.validations.input_names_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 90,
                required: true,
                autocomplete: "given-name",
                counter: 90,
                disabled: !!that.formData.verified_at,
              },
            },
            {
              name: "s_name",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: this.form.validations.input_names,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 90,
                required: false,
                autocomplete: "additional-name",
                counter: 90,
                disabled: !!that.formData.verified_at,
              },
            },
            {
              name: "surname",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: this.form.validations.input_names_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 90,
                required: true,
                autocomplete: "family-name",
                counter: 90,
                disabled: !!that.formData.verified_at,
              },
            },
            {
              name: "s_surname",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: this.form.validations.input_names,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 90,
                required: false,
                autocomplete: "family-name",
                counter: 90,
                disabled: !!that.formData.verified_at,
              },
            },
          ],
        },
        // Residence info
        {
          title: this.$t(`${this.i18n_path}.titles.residenceInfo`),
          fields: [
            {
              name: "country_residence_id",
              icon: "mdi-map",
              type: "autocomplete",
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.residence_countries,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.residence_states,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.residence_cities,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.localities,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.upz,
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
              rules: this.form.validations.required,
              flex: 6,
              values: this.neighborhoods,
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
              rules: this.form.validations.input_text_required,
              hide: this.hideOtherNeighborhood,
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
              rules: this.form.validations.input_text_required,
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
              rules: this.form.validations.input_number_required,
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
              rules: this.form.validations.input_phone_mobile_required,
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
          title: this.$t(`${this.i18n_path}.titles.detailsInfo`),
          fields: [
            {
              name: "sex",
              icon: "mdi-human-male-female",
              type: "select",
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.sex_values,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              hide: !this.isAdult,
              values: this.genders,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
                appendOuterIcon: "mdi-help-circle-outline",
              },
              on: {
                "click:append-outer": function () {
                  that.sex_dialog = true;
                },
              },
            },
            {
              name: "sexual_orientation_id",
              icon: "mdi-gender-transgender",
              type: "select",
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.orientations,
              hide: !this.isAdult,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.population_groups,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.blood_types,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.ethnic_groups,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: this.epss,
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
              rules: this.form.validations.required,
              flex: 6,
              values: [
                {
                  id: "NO",
                  name: this.$t(`${this.i18n_path}.disabilityValues.no`),
                },
                {
                  id: "SI",
                  name: this.$t(`${this.i18n_path}.disabilityValues.yes`),
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              hide: this.hideDisability,
              values: this.disabilities,
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
              rules: this.form.validations.input_number_required,
              flex: 6,
              values: [
                {
                  id: 3,
                  name: this.$t(`${this.i18n_path}.relationshipValues.parents`),
                },
                {
                  id: 7,
                  name: this.$t(`${this.i18n_path}.relationshipValues.tutor`),
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
              rules: this.form.validations.input_text_required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 191,
                required: true,
                autocomplete: "given-name",
                hint: this.$t(`${this.i18n_path}.contact_name`),
                persistentHint: true,
                counter: 191,
              },
            },
            {
              name: "contact_phone",
              icon: "mdi-phone",
              type: "tel",
              rules: this.form.validations.input_phone_mobile_required,
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
      return inputs
        .filter((form) => !form.hide)
        .map((form) => {
          return {
            title: form.title,
            fields: form.fields.filter((el) => !el.hide),
          };
        });
    },
    profile: sync("auth/user@profile"),
  },
  watch: {
    formData(item) {
      this.form = new Beneficiary({
        ...item,
        confirm_document: item.document,
        document_file: get(this.formData, "document_file", {}),
      });
    },
  },
  beforeDestroy() {
    this.form = new Beneficiary({
      ...this.formData,
      document_file: get(this.formData, "document_file", {}),
    });
  },
};
</script>

<style scoped lang="sass">
ul.links-vertical li
  display: block
  margin-left: -30px
ul.links-vertical li a
  padding: 5px
</style>
