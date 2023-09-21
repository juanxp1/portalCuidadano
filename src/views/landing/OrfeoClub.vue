<template>
  <details-page height="500" title="Trámite Clubes en Línea">
    <v-card-text>
      <v-window touchless v-model="step">
        <v-window-item :value="0">
          <v-row>
            <v-col col="12" md="12" sm="12">
              <orfeo-intro />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-card
                color="primary"
                class="d-flex align-center"
                dark
                height="200"
                @click="step = 1"
              >
                <div class="text-h4 flex-grow-1 text-center">
                  Hacer una Solicitud
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-card
                color="primary"
                class="d-flex align-center"
                dark
                height="200"
                :to="{ name: 'Orfeo' }"
              >
                <div class="text-h4 flex-grow-1 text-center">
                  Consultar Radicado
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item :value="1">
          <v-form-template
            :i18n_path="i18n_path"
            :form="form"
            :sections="fields"
            :loading="loading"
            has-email-confirmation
            :email-confirmation-text="details"
            with-title
            method="clubes"
            reset-form
            @submitting="start"
            @finished="finish"
            @success="onSuccess"
            @error="onError"
          >
            <template #prepend-form-title>
              <v-btn icon @click="step = 0">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </template>
            <template #[`append-form-0`]="{ model }">
              <v-dialog v-model="glossary_dialog" max-width="800">
                <v-card flat>
                  <v-card-text>
                    <orfeo-glossary />
                  </v-card-text>
                </v-card>
              </v-dialog>
              <v-col cols="12">
                <v-validation-provider
                  v-slot="{ errors }"
                  :rules="form.validations.required"
                  vid="accept_media"
                  name="términos y condiciones"
                >
                  <v-checkbox
                    :value="1"
                    id="accept_media"
                    name="accept_media"
                    v-model="model.accept_media"
                    :error-messages="errors"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <template #label>
                      <i18n tag="span" path="orfeo.forms.club.accept_media">
                        <template #link>
                          <v-dialog max-width="800">
                            <template v-slot:activator="{ on }">
                              <i18n
                                tag="a"
                                href="javascript:;"
                                v-on="on"
                                path="orfeo.forms.club.terms"
                              />
                            </template>
                            <v-card flat>
                              <v-card-text class="mt-1">
                                <orfeo-t-and-c />
                              </v-card-text>
                            </v-card>
                          </v-dialog>
                        </template>
                      </i18n>
                    </template>
                  </v-checkbox>
                </v-validation-provider>
              </v-col>
            </template>
            <template #prepend-form-action-0>
              <v-btn
                class="hidden-sm-and-down"
                color="primary"
                :aria-label="$t('buttons.Back')"
                :disabled="loading"
                :loading="loading"
                text
                @click="step = 0"
              >
                <v-icon left>mdi-chevron-left</v-icon>
                {{ $t("buttons.Back") }}
              </v-btn>
              <v-btn
                class="hidden-md-and-up"
                color="primary"
                :aria-label="$t('buttons.Back')"
                :disabled="loading"
                :loading="loading"
                outlined
                large
                icon
                @click="step = 0"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </template>
            <template #[`prepend-form-1`]>
              <v-col cols="12">
                <h2>
                  Por favor adjuntar los documentos en formato PDF con un peso
                  máximo de 1MB
                </h2>
              </v-col>
            </template>
            <template #message>
              <v-btn
                aria-label="Hacer Seguimiento"
                color="primary"
                class="mx-auto"
                outlined
                :to="{ name: 'Orfeo' }"
                v-text="'Hacer Seguimiento'"
              />
            </template>
          </v-form-template>
        </v-window-item>
      </v-window>
    </v-card-text>
  </details-page>
</template>

<script>
import { get } from "lodash";
import { Orfeo } from "@/models/services/Orfeo";
import OrfeoTAndC from "@/pages/clubes/terms.md";
import OrfeoGlossary from "@/pages/clubes/glosary.md";
import OrfeoIntro from "@/pages/clubes/instructions.md";

const file_input = (name, required = true, flex = 6) => ({
  name: name,
  icon: "mdi-paperclip",
  type: "file",
  rules: {
    required: required,
    mimes: ["application/pdf"],
  },
  flex: flex,
  attrs: {
    accept: "application/pdf",
    required: required,
  },
});

export default {
  name: "SyntheticFields",
  components: {
    OrfeoTAndC: OrfeoTAndC.vue.component,
    OrfeoGlossary: OrfeoGlossary.vue.component,
    OrfeoIntro: OrfeoIntro.vue.component,
  },
  data: () => ({
    step: 0,
    bg: require("@/assets/img/landing/grill.jpg"),
    i18n_path: "orfeo.forms.club",
    glossary_dialog: false,
    loading: false,
    finding: false,
    form: new Orfeo({
      club: null,
      email: null,
      president: null,
      phone: null,
      request_type: null,
      club_type: null,
      sports: [],
      file_1_1: null,
      file_1_2: null,
      file_1_3: null,
      file_1_4: null,
      file_1_5: null,
      file_1_6: null,
      file_1_7: null,
      file_1_8: null,
      file_1_9: null,
      file_2_1: null,
      file_2_2: null,
      file_2_3: null,
      file_2_4: null,
      file_2_5: null,
      file_2_6: null,
      file_2_7: null,
      file_2_8: null,
      file_2_9: null,
      file_2_10: null,
      file_2_11: null,
      file_3_1: null,
      file_3_2: null,
      file_3_3: null,
      file_3_4: null,
      file_3_5: null,
      file_3_6: null,
      file_3_7: null,
      file_3_8: null,
      file_3_9: null,
      file_4_1: null,
      file_4_2: null,
      file_4_3: null,
      file_4_4: null,
      file_4_5: null,
      file_4_6: null,
      file_4_7: null,
      file_5_1_1: null,
      file_5_1_2: null,
      file_5_1_3: null,
      file_5_1_4: null,
      file_5_1_5: null,
      file_5_1_6: null,
      file_5_1_7: null,
      file_5_1_8: null,
      file_5_2_1: null,
      file_5_2_2: null,
      file_5_2_3: null,
      file_5_2_4: null,
      file_5_2_5: null,
      file_5_3_1: null,
      file_5_3_2: null,
      file_5_3_3: null,
      file_5_3_4: null,
      file_5_3_5: null,
      file_5_3_6: null,
      file_6_1_1: null,
      file_6_1_2: null,
      file_6_1_3: null,
      file_6_1_4: null,
      file_6_1_5: null,
      file_6_2_1: null,
      file_6_2_2: null,
      file_6_2_3: null,
      file_6_3_1: null,
      file_6_3_2: null,
      file_6_3_3: null,
      file_6_3_4: null,
      file_7_1: null,
      file_7_2: null,
      file_7_3: null,
      file_7_4: null,
      file_7_5: null,
      file_7_6: null,
      file_8_1: null,
      file_8_2: null,
      file_9_1: null,
      file_9_2: null,
      file_10_1: null,
      file_10_2: null,
      file_11_1: null,
      file_11_2: null,
      file_12_1: null,
      file_12_2: null,
      file_13_1: null,
      file_13_2: null,
      file_14_1: null,
      file_14_2: null,
      accept_media: null,
    }),
    types: [
      {
        id: 1,
        name: "REQUISITOS PARA EL OTORGAMIENTO DEL RECONOCIMIENTO DEPORTIVO",
        to: ["ENTIDAD DEPORTIVA"], //"ENTIDAD NO DEPORTIVA"
      },
      {
        id: 2,
        name: "REQUISITOS PARA EL OTORGAMIENTO DEL RECONOCIMIENTO DEPORTIVO A ENTIDADES NO DEPORTIVAS",
        to: ["ENTIDAD NO DEPORTIVA"], //"ENTIDAD NO DEPORTIVA"
      },
      {
        id: 3,
        name: "REQUISITOS PARA LA RENOVACIÒN DEL RECONOCIMIENTO DEPORTIVO",
        to: ["ENTIDAD DEPORTIVA"],
      },
      {
        id: 4,
        name: "REQUISITOS PARA LA RENOVACIÒN DEL RECONOCIMIENTO DEPORTIVO A ENTIDADES NO DEPORTIVAS",
        to: ["ENTIDAD NO DEPORTIVA"],
      },
      {
        id: 5,
        name: "REQUISITOS PARA LA ACTUALIZACIÒN DEL RECONOCIMIENTO DEPORTIVO",
        description:
          "CUANDO SE PRODUZCA UNA NUEVA DESIGNACIÓN DEL PRESIDENTE DEL CLUB",
        to: ["ENTIDAD DEPORTIVA"],
      },
      {
        id: 6,
        name: "REQUISITOS PARA LA ACTUALIZACIÒN DEL RECONOCIMIENTO DEPORTIVO",
        description: "CUANDO SE PRODUZCA EL CAMBIO DE NOMBRE DEL CLUB",
        to: ["ENTIDAD DEPORTIVA"],
      },
      {
        id: 7,
        name: "REQUISITOS PARA LA ACTUALIZACIÒN DEL RECONOCIMIENTO DEPORTIVO",
        description:
          "CUANDO SE PRODUZCA EL CAMBIO DEL DEPORTE O LA ADICIÓN DE DISCIPLINAS DEPORTIVAS A UN CLUB",
        to: ["ENTIDAD DEPORTIVA"],
      },
      {
        id: 8,
        name: "REQUISITOS PARA LA ACTUALIZACIÒN DEL RECONOCIMIENTO DEPORTIVO A ENTIDADES NO DEPORTIVAS",
        description:
          "CUANDO SE PRODUZCA UNA NUEVA DESIGNACIÓN DEL PRESIDENTE DEL CLUB",
        to: ["ENTIDAD NO DEPORTIVA"],
      },
      {
        id: 9,
        name: "REQUISITOS PARA LA ACTUALIZACIÒN DEL RECONOCIMIENTO DEPORTIVO A ENTIDADES NO DEPORTIVAS",
        description: "CUANDO SE PRODUZCA EL CAMBIO DE NOMBRE DEL CLUB",
        to: ["ENTIDAD NO DEPORTIVA"],
      },
      {
        id: 10,
        name: "REQUISITOS PARA LA ACTUALIZACIÒN DEL RECONOCIMIENTO DEPORTIVO A ENTIDADES NO DEPORTIVAS",
        description:
          "CUANDO SE PRODUZCA EL CAMBIO DEL DEPORTE O LA ADICIÓN DE DISCIPLINAS DEPORTIVAS",
        to: ["ENTIDAD NO DEPORTIVA"],
      },
      {
        id: 11,
        name: "REQUISITOS PARA ACTUALIZACIÓN EXPEDIENTE",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 12,
        name: "SUBSANE",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 13,
        name: "DERECHO DE PETICIÓN",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 14,
        name: "SOLICITUD DE INFORMACIÓN",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 15,
        name: "EXPEDICIÓN DE COPIAS O SCANNER",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 16,
        name: "CERTIFICACIONES",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 17,
        name: "DESISTIMIENTO",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
      {
        id: 18,
        name: "RECURSO DE REPOSICIÓN",
        to: ["ENTIDAD NO DEPORTIVA", "ENTIDAD DEPORTIVA"],
      },
    ],
    documents: [
      {
        id: 1,
        fields: [
          {
            name: "file_1_1",
            required: true,
          },
          {
            name: "file_1_2",
            required: true,
          },
          {
            name: "file_1_3",
            required: true,
          },
          {
            name: "file_1_4",
            required: true,
          },
          {
            name: "file_1_5",
            required: true,
          },
          {
            name: "file_1_6",
            required: true,
          },
          {
            name: "file_1_7",
            required: true,
          },
          {
            name: "file_1_8",
            required: true,
          },
          {
            name: "file_1_9",
            required: true,
          },
        ],
      },
      {
        id: 2,
        fields: [
          {
            name: "file_2_1",
            required: true,
          },
          {
            name: "file_2_2",
            required: true,
          },
          {
            name: "file_2_3",
            required: false,
          },
          {
            name: "file_2_4",
            required: false,
          },
          {
            name: "file_2_5",
            required: true,
          },
          {
            name: "file_2_6",
            required: true,
          },
          {
            name: "file_2_7",
            required: true,
          },
          {
            name: "file_2_8",
            required: true,
          },
          {
            name: "file_2_9",
            required: true,
          },
          {
            name: "file_2_10",
            required: false,
          },
          {
            name: "file_2_11",
            required: true,
          },
        ],
      },
      {
        id: 3,
        fields: [
          {
            name: "file_3_1",
            required: true,
          },
          {
            name: "file_3_2",
            required: true,
          },
          {
            name: "file_3_3",
            required: false,
          },
          {
            name: "file_3_4",
            required: true,
          },
          {
            name: "file_3_5",
            required: true,
          },
          {
            name: "file_3_6",
            required: true,
          },
          {
            name: "file_3_7",
            required: true,
          },
          {
            name: "file_3_8",
            required: true,
          },
          {
            name: "file_3_9",
            required: false,
          },
        ],
      },
      {
        id: 4,
        fields: [
          {
            name: "file_4_1",
            required: true,
          },
          {
            name: "file_4_2",
            required: true,
          },
          {
            name: "file_4_3",
            required: false,
          },
          {
            name: "file_4_4",
            required: false,
          },
          {
            name: "file_4_5",
            required: true,
          },
          {
            name: "file_4_6",
            required: true,
          },
          {
            name: "file_4_7",
            required: false,
          },
        ],
      },
      {
        id: 5,
        fields: [
          {
            name: "file_5_1_1",
            required: true,
          },
          {
            name: "file_5_1_2",
            required: true,
          },
          {
            name: "file_5_1_3",
            required: false,
          },
          {
            name: "file_5_1_4",
            required: true,
          },
          {
            name: "file_5_1_5",
            required: true,
          },
          {
            name: "file_5_1_6",
            required: true,
          },
          {
            name: "file_5_1_7",
            required: true,
          },
          {
            name: "file_5_1_8",
            required: false,
          },
        ],
      },
      {
        id: 6,
        fields: [
          {
            name: "file_5_2_1",
            required: true,
          },
          {
            name: "file_5_2_2",
            required: true,
          },
          {
            name: "file_5_2_3",
            required: false,
          },
          {
            name: "file_5_2_4",
            required: true,
          },
          {
            name: "file_5_2_5",
            required: true,
          },
        ],
      },
      {
        id: 7,
        fields: [
          {
            name: "file_5_3_1",
            required: true,
          },
          {
            name: "file_5_3_2",
            required: true,
          },
          {
            name: "file_5_3_3",
            required: false,
          },
          {
            name: "file_5_3_4",
            required: true,
          },
          {
            name: "file_5_3_5",
            required: true,
          },
          {
            name: "file_5_3_6",
            required: true,
          },
        ],
      },
      {
        id: 8,
        fields: [
          {
            name: "file_6_1_1",
            required: true,
          },
          {
            name: "file_6_1_2",
            required: true,
          },
          {
            name: "file_6_1_3",
            required: true,
          },
          {
            name: "file_6_1_4",
            required: false,
          },
          {
            name: "file_6_1_5",
            required: false,
          },
        ],
      },
      {
        id: 9,
        fields: [
          {
            name: "file_6_2_1",
            required: true,
          },
          {
            name: "file_6_2_2",
            required: true,
          },
          {
            name: "file_6_2_3",
            required: true,
          },
        ],
      },
      {
        id: 10,
        fields: [
          {
            name: "file_6_3_1",
            required: true,
          },
          {
            name: "file_6_3_2",
            required: true,
          },
          {
            name: "file_6_3_3",
            required: true,
          },
          {
            name: "file_6_3_4",
            required: true,
          },
        ],
      },
      {
        id: 11,
        fields: [
          {
            name: "file_7_1",
            required: false,
          },
          {
            name: "file_7_2",
            required: false,
          },
          {
            name: "file_7_3",
            required: false,
          },
          {
            name: "file_7_4",
            required: false,
          },
          {
            name: "file_7_5",
            required: false,
          },
          {
            name: "file_7_6",
            required: false,
          },
        ],
      },
      {
        id: 12,
        fields: [
          {
            name: "file_8_1",
            required: true,
          },
          {
            name: "file_8_2",
            required: true,
          },
        ],
      },
      {
        id: 13,
        fields: [
          {
            name: "file_9_1",
            required: true,
          },
          {
            name: "file_9_2",
            required: false,
          },
        ],
      },
      {
        id: 14,
        fields: [
          {
            name: "file_10_1",
            required: true,
          },
          {
            name: "file_10_2",
            required: false,
          },
        ],
      },
      {
        id: 15,
        fields: [
          {
            name: "file_11_1",
            required: true,
          },
          {
            name: "file_11_2",
            required: false,
          },
        ],
      },
      {
        id: 16,
        fields: [
          {
            name: "file_12_1",
            required: true,
          },
          {
            name: "file_12_2",
            required: false,
          },
        ],
      },
      {
        id: 17,
        fields: [
          {
            name: "file_13_1",
            required: true,
          },
          {
            name: "file_13_2",
            required: false,
          },
        ],
      },
      {
        id: 18,
        fields: [
          {
            name: "file_14_1",
            required: false,
          },
          {
            name: "file_14_2",
            required: false,
          },
        ],
      },
    ],
    docs: [],
    type_docs: [],
    sports: [],
    details: undefined,
  }),
  computed: {
    fields() {
      const that = this;
      return [
        {
          title: "FORMULARIO DE REGISTRO TRÁMITE DE CLUBES",
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
                appendOuterIcon: "mdi-magnify",
                hint: "Digite su correo electrónico y de clic en la lupa para autocompletar los datos",
                persistentHint: true,
              },
              on: {
                "click:append-outer": () => {
                  that.onAutocomplete();
                },
                blur: () => {
                  that.onAutocomplete();
                },
              },
            },
            {
              name: "club",
              icon: "mdi-dots-horizontal",
              type: "text",
              rules: that.form.validations.required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 191,
                required: true,
                autocomplete: "given-name",
                counter: 191,
              },
            },
            {
              name: "president",
              icon: "mdi-account-group",
              type: "text",
              rules: that.form.validations.required,
              flex: 6,
              attrs: {
                minlength: 3,
                maxlength: 191,
                required: true,
                autocomplete: "given-name",
                counter: 191,
              },
            },
            {
              name: "phone",
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
              name: "club_type",
              icon: "mdi-card-account-details",
              type: "select",
              rules: that.form.validations.required,
              flex: 6,
              values: [
                {
                  id: "ENTIDAD DEPORTIVA",
                  name: "ENTIDAD DEPORTIVA",
                },
                {
                  id: "ENTIDAD NO DEPORTIVA",
                  name: "ENTIDAD NO DEPORTIVA",
                },
              ],
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
                appendOuterIcon: "mdi-help-circle",
              },
              templateItem: true,
              templateItemDescription: "description",
              on: {
                "click:append-outer": () => {
                  that.glossary_dialog = true;
                },
                change: (val) => {
                  that.form.request_type = null;
                  that.type_docs = [];
                  if (val) {
                    that.type_docs = that.types.filter((f) =>
                      f.to.includes(val)
                    );
                  }
                },
              },
            },
            {
              name: "request_type",
              icon: "mdi-card-account-details",
              type: "select",
              rules: that.form.validations.input_number_required,
              flex: 6,
              values: that.type_docs,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
                disabled: !that.form.club_type,
                appendOuterIcon: "mdi-help-circle",
              },
              templateItem: true,
              templateItemDescription: "description",
              on: {
                "click:append-outer": () => {
                  that.glossary_dialog = true;
                },
                change: (val) => {
                  if (val) {
                    that.docs = that.documents
                      .filter((f) => f.id === val)[0]
                      .fields.map((f) => file_input(f.name, f.required));
                  }
                },
              },
            },
            {
              name: "sports",
              icon: "mdi-soccer",
              type: "select",
              rules: that.form.validations.required,
              flex: 12,
              values: that.sports,
              attrs: {
                required: true,
                autocomplete: "off",
                itemValue: "id",
                itemText: "name",
                multiple: true,
                returnObject: true,
              },
            },
          ],
        },
        {
          title: "Documentación Requerida",
          fields: that.docs,
        },
      ];
    },
  },
  created() {
    this.getSports();
  },
  methods: {
    onAutocomplete() {
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .autocomplete({
          params: { email: this.form.email },
        })
        .then((response) => {
          this.form.club = get(response, "data.club", null);
          this.form.president = get(response, "data.president", null);
          this.form.phone = get(response, "data.phone", null);
          this.form.club_type = get(response, "data.club_type", null);
          this.form.sports = get(response, "data.sports", []);
          if (this.form.club_type) {
            this.type_docs = this.types.filter((f) =>
              f.to.includes(this.form.club_type)
            );
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    getSports() {
      this.form
        .sportsOrfeo()
        .then((response) => {
          this.sports = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    onSuccess(response) {
      this.$snackbar.success(response.data);
      this.details = response.details;
    },
    onError(errors) {
      this.errors = errors;
      this.$snackbar.error(errors.message);
    },
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>
