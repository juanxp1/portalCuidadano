<template>
  <details-page height="500" title="Trámite Clubes en Línea">
    <template #heading>
      <v-col cols="12">
        <v-card
          flat
          :light="!$vuetify.theme.dark"
          :min-width="$vuetify.breakpoint.mdAndUp ? '600' : undefined"
        >
          <v-card-text>
            <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(getRecords)">
                <v-validation-provider
                  v-slot="{ errors }"
                  name="radicado"
                  rules="required"
                >
                  <v-text-field
                    label="Radicado"
                    persistent-hint
                    hint="Digite el número del radicado y código web impreso en el sticker adjunto a su documento copia"
                    clearable
                    v-model="form.orfeo"
                    :error-messages="errors"
                  >
                  </v-text-field>
                </v-validation-provider>
                <v-validation-provider
                  v-slot="{ errors }"
                  name="código web"
                  rules="required"
                >
                  <v-text-field
                    label="Código Web"
                    persistent-hint
                    clearable
                    v-model="form.code"
                    :error-messages="errors"
                  >
                  </v-text-field>
                </v-validation-provider>
                <v-btn color="primary" type="submit">Consultar</v-btn>
              </v-form>
            </v-validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
    <v-card-text>
      <v-row id="orfeo-response">
        <v-col class="my-4" cols="12">
          <v-row v-if="!selected.id && !loading" class="pa-md-3">
            <v-empty-state
              icon="mdi-magnify"
              lable="Búsqueda de Radicados"
              description="Digite el número del radicado y código web impreso en el sticker adjunto a su documento copia"
            />
          </v-row>
          <v-row v-else class="pa-md-3">
            <v-col cols="12">
              <h1
                v-if="!!selected.id"
                class="mb-2 display-serif-2"
                v-text="
                  `Tu radicado ${selected.id}, se encuentra en estado ${selected.status}`
                "
              />
            </v-col>
            <v-col cols="12" md="12">
              {{ updatedAt }}
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-progress-linear
                    :value="percent"
                    striped
                    :color="barColor"
                    height="25"
                    v-on="on"
                  >
                    <strong>{{ Math.ceil(percent) }}%</strong>
                  </v-progress-linear>
                </template>
                <span>
                  {{ `${selected.days_left} ${$t("orfeo.event.days_left")}` }}
                </span>
              </v-tooltip>
              <orfeo-event
                two-columns
                :loading="loading"
                :selected-event="selected"
              />
            </v-col>
            <v-col cols="12">
              <h1
                class="font-weight-light mb-2 headline"
                v-text="$t('orfeo.event.attachments_count')"
              />
            </v-col>
            <v-col cols="12">
              <v-slide-group
                v-if="selected.attachments && selected.attachments.length"
                show-arrows
              >
                <v-slide-item
                  v-for="(att, i) in selected.attachments"
                  :key="`${i}-att`"
                >
                  <v-list dense three-line>
                    <v-list-item dense>
                      <v-list-item-icon>
                        <v-avatar :color="getColor(selected.color)" size="35">
                          <span
                            class="white--text headline"
                            v-text="att.order"
                          />
                        </v-avatar>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="att.id" />
                        <v-list-item-subtitle v-text="att.status" />
                        <v-list-item-subtitle
                          v-text="
                            att.created_at
                              ? att.created_at.split('.').shift()
                              : att.created_at
                          "
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-slide-item>
              </v-slide-group>
              <v-empty-state
                v-else
                icon="mdi-paperclip"
                description="No tiene radicados asociados"
              />
            </v-col>
            <v-col cols="12">
              <h1
                class="font-weight-light mb-2 headline"
                v-text="'Radicado de respuesta'"
              />
            </v-col>
            <v-col cols="12">
              <v-slide-group
                v-if="selected.associates && selected.associates.length"
                show-arrows
              >
                <v-slide-item
                  v-for="(tag, i) in selected.associates"
                  :key="`${i}-tag`"
                >
                  <v-list dense two-line>
                    <v-list-item dense>
                      <v-list-item-icon class="hidden-sm-and-down">
                        <v-icon>mdi-pin</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="tag.id" />
                        <v-list-item-subtitle v-text="tag.created_at" />
                      </v-list-item-content>
                      <v-list-item-action class="hidden-sm-and-down">
                        <v-icon @click="onDownload">mdi-eye</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-slide-item>
              </v-slide-group>
              <v-empty-state
                v-else
                icon="mdi-text"
                description="No tiene radicado de respuesta"
              />
            </v-col>
            <v-col cols="12">
              <v-card flat>
                <v-card-title>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="`USUARIO ACTUAL: ${user.current}`"
                        />
                        <v-list-item-subtitle
                          v-text="`DEPENDENCIA ACTUAL: ${user.dependency}`"
                        />
                        <v-list-item-subtitle
                          v-text="`USUARIO_RADICADOR: ${user.requester}`"
                        />
                        <v-list-item-subtitle
                          v-text="
                            `DEPENDENCIA RADICADORA: ${user.requester_dependency}`
                          "
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-title>
                <v-card-text class="ml-5" v-text="`ENVÍOS: ${user.sent}`" />
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-timeline :dense="$vuetify.breakpoint.smAndDown">
                <v-timeline-item v-for="(line, i) in timeline" :key="i">
                  <template #icon>
                    <v-avatar color="primary" size="20" />
                  </template>
                  <template #opposite>
                    <span v-text="line.FECHA" />
                  </template>
                  <v-card class="elevation-2">
                    <v-card-title>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title v-text="line.USUARIO_ORIGEN" />
                            <v-list-item-subtitle
                              class="hidden-md-and-up"
                              v-text="line.FECHA"
                            />
                            <v-list-item-subtitle v-text="line.TRANSACCION" />
                            <v-list-item-subtitle v-text="line.DEPENDENCIA" />
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-title>
                    <v-card-text v-text="line.COMENTARIO" />
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
          <v-overlay :value="loading">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
          </v-overlay>
        </v-col>
      </v-row>
    </v-card-text>
  </details-page>
</template>

<script>
import { debounce, get } from "lodash";
import { Orfeo } from "@/models/services/Orfeo";
import FileSaver from "file-saver";
import Base64ToBlob from "@/util/Base64ToBlob";

export default {
  name: "SyntheticFields",
  data: () => ({
    bg: require("@/assets/img/landing/grill.jpg"),
    loading: false,
    finding: false,
    form: new Orfeo({
      orfeo: null,
      code: null,
    }),
    selected: {},
    timeline: [],
    user: {
      current: "",
      dependency: "",
      requester_dependency: "",
      requester: "",
      sent: "",
    },
  }),
  methods: {
    onDownload() {
      this.form.resetOnlyWhenUpdate = false;
      this.form.orfeo = this.selected.id;
      this.form
        .files()
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(
              `data:application/pdf;base64,${response.data}`
            ).blob(),
            `${this.selected.id}00001.pdf`
          );
        })
        .catch((errors) => {
          this.$snackbar.error(errors);
        });
    },
    onHistory() {
      this.form.resetOnlyWhenUpdate = false;
      this.form.orfeo = this.selected.id;
      this.form
        .history()
        .then((response) => {
          this.user = {
            current: get(response.data, "USUARIO_ACTUAL", ""),
            dependency: get(response.data, "DEPENDENCIA_ACTUAL", ""),
            requester_dependency: get(response.data, "DEPENDENCIA_RADICADORA", ""),
            requester: get(response.data, "USUARIO_RADICADOR", ""),
            sent: get(response.data, "ENVIOS", ""),
          };
          this.timeline = get(response.data, "HISTORICO", []);
        })
        .catch((errors) => {
          this.$snackbar.error(errors);
        });
    },
    getRecords: debounce(function () {
      this.loading = true;
      this.finding = true;
      this.form.setFormInstance(this.$refs.basic);
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .info(this.form.orfeo)
        .then((response) => {
          this.selected = response.data;
        })
        .then(() => {
          this.$vuetify.goTo("#orfeo-response");
          this.onHistory();
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
          this.finding = false;
        });
    }, 300),
    getColor(color) {
      switch (color) {
        case "danger":
          return "red";
        default:
          return "primary";
      }
    },
  },
  computed: {
    percent() {
      const x =
        parseInt(this.selected.business_days || 0) -
        parseInt(this.selected.days_left || 0);
      return x > 0
        ? parseInt((x * 100) / this.selected.business_days || 0)
        : 100;
    },
    barColor() {
      return this.selected.bar_color || "primary";
    },
    updatedAt() {
      return this.$moment(this.selected.updated_at).isValid()
        ? `${this.selected.status || ""} - ${this.$t(
            "buttons.Updated"
          )} ${this.$moment(this.selected.updated_at).locale("es").fromNow()}`
        : `${this.selected.status || ""} - ${this.selected.updated_at}`;
    },
  },
};
</script>

<style scoped></style>
