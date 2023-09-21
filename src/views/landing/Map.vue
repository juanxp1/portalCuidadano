<template>
  <details-page title="Mapa de Parques" height="400">
    <template #heading>
      <v-col cols="12" md="9" sm="12" class="mx-auto">
        <v-card
          flat
          :light="!$vuetify.theme.dark"
          :min-width="$vuetify.breakpoint.mdAndUp ? '600' : undefined"
        >
          <v-card-text>
            <app-search :map="true" v-model="item" />
          </v-card-text>
        </v-card>
      </v-col>
    </template>
    <v-card-text>
      <v-list v-if="item" three-line color="transparent">
        <v-list-item class="pa-0 ma-0">
          <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
            <v-icon
              :class="item.color"
              class="lighten-1 white--text"
              v-text="'mdi-pine-tree'"
            ></v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <span class="font-weight-bold">{{
                `${$t("park.code_min")}: `
              }}</span>
              {{ `${item.code || item.park_code}` }}
              <span class="font-weight-bold hidden-sm-and-down">{{
                ` - ${$t("park.name_min")}: `
              }}</span>
              <span class="hidden-sm-and-down">{{
                `${item.name || item.park_name}`
              }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="hidden-md-and-up">
              <span class="font-weight-bold">{{
                `${$t("park.name_min")}: `
              }}</span>
              {{ `${item.name}` }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-text="item.address || item.park_address"
            ></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="onClear">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-skeleton-loader :loading="loadingMap" max-height="600" type="card">
        <v-empty-state
          v-if="error"
          label="Sin conexión"
          description="No pudimos conectarnos al servidor de mapas"
          icon="mdi-map"
        >
          <app-btn
            path="buttons.Refresh"
            icon-text="mdi-refresh"
            color="primary"
          />
        </v-empty-state>
        <v-esri-map
          v-else-if="!error && !showFrame"
          ref="esri"
          class="mt-2"
          :layer="layer"
          :iframe="iframe"
          style="height: 600px"
          :query="query"
          @error="onError"
        />
        <v-i-frame v-else :src="frame" height="600px" />
        <v-switch
          label="Da clic si no puedes visualizar el mapa correctamente"
          v-model="showFrame"
        />
      </v-skeleton-loader>
    </v-card-text>
  </details-page>
</template>

<script>
import esriBase from "@/util/esriBase";
import { Park } from "@/models/services/Park";
export default {
  name: "LandingMap",
  data: () => ({
    loadingMap: false,
    parkModel: new Park(),
    iframe: {
      ...esriBase.iframe,
    },
    layer: {
      ...esriBase.layer,
    },
    showFrame: false,
    param: esriBase.param,
    item: null,
    query: null,
    error: false,
  }),
  created() {
    // this.esriConfig();
  },
  methods: {
    esriConfig() {
      this.error = false;
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
    onClear() {
      this.item = null;
      this.query = null;
    },
    onError(error) {
      this.error = error;
    },
  },
  watch: {
    item(val) {
      if (val && (val.code || val.park_code)) {
        this.query = `${this.param}'${val.code || val.park_code}'`;
      } else {
        this.query = null;
      }
    },
  },
  computed: {
    themeFrame() {
      const { url, dark, light } = this.iframe;
      return this.$vuetify.theme.dark ? `${url}${dark}` : `${url}${light}`;
    },
    frame() {
      const query =
        this.query && this.query !== "todo"
          ? `${this.iframe.filter}${this.query}`
          : "";
      return `${this.themeFrame}${query}`;
    },
  },
};
</script>

<style scoped></style>
