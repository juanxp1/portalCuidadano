<template>
  <details-page custom-card :opacity="0.6" :bg="bg" :title="park.name">
    <material-card
      icon-avatar="mdi-pine-tree"
      class="main main-raised elevation-24"
    >
      <app-breadcrumbs />
      <v-stepper v-model="tab" vertical class="elevation-0">
        <v-stepper-step
          :class="classesSteps"
          editable
          :complete="tab > 1"
          :step="1"
        >
          {{ $t(`tabs.${tabs[0]}`) }}
        </v-stepper-step>
        <v-stepper-content :class="classesStepsContent" :step="1">
          <v-row>
            <v-col cols="12">
              <app-search
                :park-id="$route.params.id"
                replace-placeholder="Buscar en este parque"
                :indexes="[
                  'endowment_index',
                  'booking_index',
                  'schedules_index',
                ]"
              />
            </v-col>
            <v-col cols="12" md="12">
              <info-content
                text-left
                info-horizontal
                icon-color="success"
                icon="mdi-information-outline"
                :subtitle="$t('label.general')"
              >
                <park-data :loading="loading" :park="park"></park-data>
              </info-content>
            </v-col>
            <v-col cols="12" md="12">
              <info-content
                text-left
                info-horizontal
                icon="mdi-map-marker"
                :subtitle="$t('label.gps')"
              >
                <app-btn
                  path="buttons.Refresh"
                  icon
                  icon-text="mdi-refresh"
                  @click="onReloadMap"
                />
                <app-btn
                  path="input.window"
                  text
                  :href="frame"
                  target="_blank"
                  icon-text="mdi-aspect-ratio"
                />
                <v-skeleton-loader
                  :loading="loadingMap"
                  max-height="600"
                  type="card"
                >
                  <v-esri-map
                    ref="esri"
                    class="mt-2"
                    :layer="layer"
                    style="height: 400px"
                    :iframe="iframe"
                    :query="`${param}'${code}'`"
                  />
                </v-skeleton-loader>
              </info-content>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-step
          :class="classesSteps"
          editable
          :complete="tab > 2"
          :step="2"
        >
          {{ $t(`tabs.${tabs[1]}`) }}
        </v-stepper-step>

        <v-stepper-content :class="classesStepsContent" :step="2">
          <v-row v-if="tab === 2">
            <v-col cols="12" md="12">
              <equipment-table
                :title="$t('label.fields')"
                :park_id="park.id"
                equipment_id="1"
              ></equipment-table>
            </v-col>
            <v-col cols="12" md="12">
              <equipment-table
                :title="$t('label.stages')"
                :park_id="park.id"
                equipment_id="3"
              ></equipment-table>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-step
          :class="classesSteps"
          editable
          :complete="tab > 3"
          :step="3"
        >
          {{ $t(`tabs.${tabs[2]}`) }}
        </v-stepper-step>

        <v-stepper-content :class="classesStepsContent" :step="3">
          <v-row v-if="tab === 3">
            <v-col cols="12" md="12">
              <equipment-table
                :park_id="park.id"
                equipment_id="4"
              ></equipment-table>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-step
          :class="classesSteps"
          editable
          :complete="tab > 4"
          :step="4"
        >
          {{ $t(`tabs.${tabs[3]}`) }}
        </v-stepper-step>

        <v-stepper-content :class="classesStepsContent" :step="4">
          <v-row v-if="tab === 4">
            <v-col cols="12" md="12">
              <equipment-table
                :park_id="park.id"
                equipment_id="2"
              ></equipment-table>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-step
          :class="classesSteps"
          editable
          :complete="tab > 5"
          :step="5"
        >
          {{ $t(`tabs.${tabs[4]}`) }}
        </v-stepper-step>

        <v-stepper-content :class="classesStepsContent" :step="5">
          <v-row>
            <v-col cols="12" md="12">
              <v-list>
                <v-list-item
                  v-for="(key, i) in park.general_conditions"
                  :key="i"
                >
                  <v-list-item-avatar>
                    <v-icon v-text="`mdi-text`"></v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="key"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-stepper-content>
        <!--
        <v-stepper-step
          :class="classesSteps"
          editable
          :complete="tab > 6"
          :step="6"
        >
          {{ $t(`tabs.${tabs[5]}`) }}
        </v-stepper-step>
        <v-stepper-content :class="classesStepsContent" :step="6">
          <v-row>
            <v-col cols="12" md="12">
              <v-list>
                <v-list-item v-for="(key, i) in park.loan_application" :key="i">
                  <v-list-item-avatar>
                    <v-icon v-text="`mdi-text`"></v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="key"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-stepper-content>
        -->
      </v-stepper>
    </material-card>
    <template #after-card>
      <v-speed-dial
        v-model="dial"
        :disabled="loaded"
        :loading="loaded"
        dark
        fixed
        bottom
        right
        fab
      >
        <template v-slot:activator>
          <v-btn v-model="dial" color="primary" dark fab>
            <v-icon v-if="dial">mdi-close</v-icon>
            <v-icon v-else>mdi-headset</v-icon>
          </v-btn>
        </template>
        <app-btn
          v-if="park.phone"
          :tooltip-attrs="tooltipAttrs"
          :path="`${$t('label.call')} (601) ${park.phone}`"
          color="success"
          small
          dark
          fab
          icon-text="mdi-phone"
          :href="`tel:601${park.phone}`"
        />
        <app-btn
          v-if="park.pqrs"
          :tooltip-attrs="tooltipAttrs"
          :path="`${$t('park.pqrs')} ${park.pqrs}`"
          color="info"
          small
          dark
          fab
          icon-text="mdi-email-outline"
          :href="`mailto:${park.pqrs}`"
        />
        <app-btn
          v-if="park.email"
          :tooltip-attrs="tooltipAttrs"
          :path="`${$t('park.email')} ${park.email}`"
          color="warning"
          small
          dark
          fab
          icon-text="mdi-card-account-mail"
          :href="`mailto:${park.email}`"
        />
      </v-speed-dial>
    </template>
  </details-page>
</template>

<script>
import { Park } from "@/models/services/Park";
import esriBase from "@/util/esriBase";
export default {
  name: "ParkView",
  metaInfo() {
    const canonical = `${process.env.VUE_APP_CANONICAL}`;
    return {
      title: `${this.park.code || ""} - ${this.park.name || ""}`.trim(),
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Portal Ciudadano",
                item: canonical,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Parques",
                item: `${canonical}parques`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `Detalles ${this.park.code} - ${this.park.name}`,
                item: `${canonical}parques/${this.$route.params.id}/detalles`,
              },
            ],
          },
        },
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${canonical}parques/${this.$route.params.id}/detalles`,
            },
            headline: `Parque ${this.park.code} - ${this.park.name}`,
            image: `${process.env.VUE_APP_CANONICAL}${this.bg}`,
            author: {
              "@type": "Organization",
              name: "IDRD",
              url: "https://www.idrd.gov.co/",
            },
            publisher: {
              "@type": "Organization",
              name: "IDRD",
              logo: {
                "@type": "ImageObject",
                url: `${process.env.VUE_APP_CANONICAL}img/icons/android-chrome-192x192.png`,
              },
            },
            // datePublished: "2022-05-25",
            // dateModified: "2022-05-25",
          },
        },
      ],
    };
  },
  components: {
    EquipmentTable: () => import("@/components/custom/EquipmentIterator"),
  },
  props: {
    data: {
      type: [Object],
      default: () => ({}),
    },
  },
  data: (vm) => ({
    loading: false,
    loadingMap: false,
    tab: 1,
    tabs: [
      "general_info",
      "sports_equipment",
      "recreational_equipment",
      "additional_services",
      "general_conditions",
      "loan_application",
    ],
    dial: false,
    bg: require("@/assets/img/landing/profile.jpg"),
    loaded: true,
    park: {
      code: null,
      name: null,
      scale: null,
      phone: null,
      pqrs: null,
      email: null,
      address: null,
      locality: null,
      upz: null,
      block: null,
      file: null,
      stratum: null,
      regulation: null,
      concept: null,
      schedule_service: null,
      schedule_admin: null,
    },
    parkModel: new Park(),
    iframe: {
      ...esriBase.iframe,
    },
    layer: {
      ...esriBase.layer,
    },
    param: esriBase.param,
    code: vm.$route.params.id,
  }),
  mounted() {
    this.loading = true;
    this.esriConfig();
    if (this.$route.params.id) {
      this.parkModel
        .show(this.$route.params.id)
        .then((response) => {
          this.park = response.data;
          if (!(this.$route.params.id || "").includes("-")) {
            this.code = response.data.code || response.data.id;
          }
          const means = [
            "regional",
            "metropolitan",
            "zonal",
            "local",
            "pocket",
          ];
          const index = response.data.scale_id - 1;
          this.bg = means[index]
            ? require(`@/assets/img/landing/${means[index]}.jpg`)
            : require("@/assets/img/landing/profile.jpg");
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => (this.loading = false));
    }
  },
  methods: {
    esriConfig() {
      this.loadingMap = true;
      this.parkModel
        .esri()
        .then((response) => {
          this.layer = response.data.layer;
          this.iframe = response.data.iframe;
          this.param = response.data.param;
        })
        .finally(() => {
          this.loadingMap = false;
        });
    },
    onReloadMap() {
      this.esriConfig();
    },
  },
  computed: {
    classesSteps: function () {
      return this.$vuetify.breakpoint.smAndDown ? "ma-0 pa-0" : "display-1";
    },
    classesStepsContent: function () {
      return this.$vuetify.breakpoint.smAndDown ? "ma-3 pa-3" : null;
    },
    themeFrame() {
      const { url, dark, light } = this.iframe;
      return this.$vuetify.theme.dark ? `${url}${dark}` : `${url}${light}`;
    },
    frame() {
      const query = this.park.code
        ? `${this.iframe.filter}${this.param}'${this.$route.params.id}'`
        : "";
      return `${this.themeFrame}${query}`;
    },
    tooltipAttrs() {
      return {
        [`nudge-${this.$vuetify.breakpoint.mdAndUp ? "left" : "left"}`]: 10,
        [`${this.$vuetify.breakpoint.mdAndUp ? "left" : "left"}`]: true,
      };
    },
  },
};
</script>

<style scoped></style>
