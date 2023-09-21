<template>
  <material-card
    image
    class="ma-4"
    :max-width="$vuetify.breakpoint.mdAndUp ? '320' : '250'"
  >
    <template #image>
      <l-map
        v-if="event.geo.length > 0"
        ref="agendaEvent"
        :style="mapWidth"
        :zoom="zoom"
        :center="event.geo"
      >
        <l-tile-layer :url="url" :attribution="attribution" />
        <l-marker :lat-lng="event.geo" @click="onMarker(event)"></l-marker>
        <l-control position="topright">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn
                :href="event.maps"
                target="_blank"
                small
                width="30"
                height="30"
                color="white"
                class="mx-auto"
                tile
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="deep-purple" small>mdi-map</v-icon>
              </v-btn>
            </template>
            Ver en mapa
          </v-tooltip>
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                width="30"
                height="30"
                color="white"
                class="mx-auto"
                tile
                v-bind="attrs"
                v-on="on"
                @click="$refs.agendaEvent.mapObject.setView(event.geo, 15)"
              >
                <v-icon color="deep-purple" small>mdi-home</v-icon>
              </v-btn>
            </template>
            Inicio
          </v-tooltip>
        </l-control>
      </l-map>
      <v-img
        v-else
        width="300"
        height="200"
        class="rounded"
        :alt="event.name"
        :src="event.image"
        :lazy-src="event.image"
        aspect-ratio="16/9"
      />
    </template>
    <v-card-text class="mx-0">
      <v-chip
        class="deep-purple--text text--accent-4 v-chip--active font-weight-bold"
        x-small
        v-text="event.category"
      />
      <v-list class="px-0 mx-0">
        <v-list-item class="pa-0 ma-0">
          <v-list-item-content>
            <v-list-item-title v-text="event.name" />
            <!--
            <v-list-item-subtitle class="caption" v-text="event.type" />
            -->
            <v-list-item-subtitle class="caption" v-text="event.place" />
            <v-list-item-subtitle class="caption">
              {{ event.description | description }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-chip-group
                active-class="deep-purple--text text--accent-4 my-1"
                mandatory
                column
              >
                <v-chip x-small>
                  <v-icon x-small left>mdi-currency-usd</v-icon>
                  {{ event.value }}
                </v-chip>
                <v-chip x-small>
                  <v-icon x-small left>mdi-calendar</v-icon>
                  {{ event.format_date }}
                </v-chip>
                <v-chip x-small>
                  <v-icon x-small left>mdi-clock</v-icon>
                  {{ event.hour }}
                </v-chip>
              </v-chip-group>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-dialog v-model="dialog" max-width="600">
        <template #activator="{ attrs }">
          <v-btn
            rounded
            x-small
            color="primary"
            :aria-label="$t('label.see_more')"
            class="mt-1"
            v-bind="attrs"
            @click="onMarker(event)"
          >
            {{ $t("label.see_more") }}
          </v-btn>
        </template>
        <v-card flat>
          <v-card-title class="text-h5 headline-serif">
            {{ selectedEvent.name }}
            <v-spacer />
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-btn
                  :aria-label="$t('buttons.Close')"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onClose"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <i18n tag="span" path="buttons.Close" />
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-chip
              class="deep-purple--text text--accent-4 v-chip--active font-weight-bold"
              small
              v-text="selectedEvent.category"
            />
            <v-list class="px-0 mx-0">
              <v-list-item class="pa-0 ma-0">
                <v-list-item-content>
                  <v-list-item-subtitle v-text="selectedEvent.place" />
                  <v-list-item-subtitle v-text="selectedEvent.description" />
                  <v-list-item-subtitle>
                    <v-chip-group
                      active-class="deep-purple--text text--accent-4 my-1"
                      mandatory
                      column
                    >
                      <v-chip small>
                        <v-icon small left>mdi-currency-usd</v-icon>
                        {{ selectedEvent.value }}
                      </v-chip>
                      <v-chip small>
                        <v-icon small left>mdi-calendar</v-icon>
                        {{ selectedEvent.format_date }}
                      </v-chip>
                      <v-chip small>
                        <v-icon small left>mdi-clock</v-icon>
                        {{ selectedEvent.hour }}
                      </v-chip>
                    </v-chip-group>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-text="`Dirigido a:`" />
                  <v-list-item-subtitle>
                    <v-chip-group
                      active-class="deep-purple--text text--accent-4"
                      column
                    >
                      <v-chip
                        v-for="(p, i) in selectedEvent.population"
                        :key="`population-${i}`"
                        small
                      >
                        <v-icon small left>mdi-human-male-female-child</v-icon>
                        {{ (p || "").trim() }}
                      </v-chip>
                    </v-chip-group>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <template v-if="selectedEvent.geo && selectedEvent.geo.length > 0">
              <v-alert
                v-if="locationPermission"
                type="warning"
                icon="mdi-alert"
                text
              >
                Debes permitir que el navegador acceda a tu ubicación
              </v-alert>
              <v-btn
                :loading="calculating"
                :disabled="calculating"
                color="deep-purple"
                small
                class="mb-2"
                @click="getPosition"
              >
                <v-icon left>mdi-map-marker-distance</v-icon>
                ¿Cómo llegar?
              </v-btn>
              <v-btn
                :loading="calculating"
                :disabled="calculating"
                color="green darken-1"
                small
                class="mb-2"
                :href="selectedEvent.maps"
                target="_blank"
              >
                <v-icon left>mdi-map</v-icon>
                Abrir en Maps
              </v-btn>
              <v-list v-if="routes.length > 0" class="mt-2">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="routes[0].name" />
                    <v-list-item-subtitle>
                      <v-icon left>mdi-map-marker-distance</v-icon>
                      {{ routes[0].distance }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-icon left>mdi-clock</v-icon>
                      {{ routes[0].time }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-group no-action>
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title v-text="`Instrucciones`" />
                    </v-list-item-content>
                  </template>
                  <v-list-item
                    v-for="(step, i) in routes[0].steps"
                    :key="`route-step-${i}`"
                  >
                    <v-list-item-icon>
                      <span
                        :class="`leaflet-routing-icon leaflet-routing-icon-${step.icon}`"
                      ></span>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="step.text" />
                    </v-list-item-content>
                    <v-list-item-action v-text="step.distance" />
                  </v-list-item>
                </v-list-group>
              </v-list>
              <l-map
                v-if="showMap"
                ref="modalMap"
                :zoom="zoom"
                style="width: 100%; height: 300px"
                :center="selectedEvent.geo"
              >
                <l-tile-layer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                  :attribution="attribution"
                />
                <l-router
                  v-if="reveal && waypoints.length > 0"
                  :waypoints="waypoints"
                  @routesfound="onRoutes"
                  @routingerror="onError"
                />
                <l-marker v-else :lat-lng="selectedEvent.geo"></l-marker>
              </l-map>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :aria-label="$t('buttons.Close')"
              color="error darken-1"
              text
              @click="onClose"
              v-text="$t('buttons.Close')"
            >
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <add-to-calendar
        rounded
        x-small
        color="primary"
        classes="mt-1"
        :title="event.name"
        :location="event.place"
        :details="event.description"
        :start="event.start"
        :end="event.end"
      />
    </v-card-text>
  </material-card>
</template>

<script>
import { LMap, LTileLayer, LMarker, LControl } from "vue2-leaflet";
import LRouter from "@/components/map/LRouter";
export default {
  name: "AgendaEvents",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LRouter,
  },
  props: {
    event: {
      type: Object,
      default: () => ({
        id: undefined,
        rev: undefined,
        type: undefined,
        _population: undefined,
        population: undefined,
        category_id: undefined,
        image: undefined,
        category: undefined,
        name: undefined,
        value: undefined,
        summary: undefined,
        description: undefined,
        place: undefined,
        start: undefined,
        end: undefined,
        format_date: undefined,
        start_date: undefined,
        end_date: undefined,
        lat: undefined,
        lng: undefined,
        hour: undefined,
        maps: undefined,
        geo: undefined,
      }),
    },
  },
  filters: {
    description(value) {
      if (!value) return "";
      value = value.toString();
      return value.length > 130 ? `${value.substring(0, 130)}...` : value;
    },
  },
  data: () => ({
    reveal: false,
    showMap: false,
    calculating: false,
    dialog: false,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    zoom: 15,
    selectedEvent: {},
    map: null,
    waypoints: [],
    locationPermission: false,
    routes: [],
  }),
  methods: {
    onMarker(event) {
      this.reveal = false;
      this.showMap = false;
      this.waypoints = [];
      this.routes = [];
      this.selectedEvent = {};
      const open = () => {
        this.selectedEvent = event;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.dialog = true))
        );
      };

      if (this.dialog) {
        this.dialog = false;
        this.reveal = false;
        this.showMap = false;
        this.waypoints = [];
        this.routes = [];
        this.selectedEvent = {};
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
    },
    getPosition() {
      this.routes = [];
      this.waypoints = [];
      this.locationPermission = false;
      this.calculating = true;
      this.showMap = true;
      if (navigator.geolocation) {
        const that = this;
        navigator.geolocation.getCurrentPosition(
          (position) => {
            that.reveal = true;
            that.calculating = false;
            that.waypoints = [
              { lat: position.coords.latitude, lng: position.coords.longitude },
              { lat: that.selectedEvent.lat, lng: that.selectedEvent.lng },
            ];
            that.$refs.modalMap.mapObject.fitBounds(
              that.waypoints.map((m) => [m.lat, m.lng])
            );
          },
          (error) => {
            that.calculating = false;
            if (error.message.toLowerCase().includes("denied")) {
              that.locationPermission = true;
              that.waypoints = [
                { lat: 4.657373797629958, lng: -74.0854918502333 },
                { lat: that.selectedEvent.lat, lng: that.selectedEvent.lng },
              ];
              that.$refs.modalMap.mapObject.fitBounds(
                that.waypoints.map((m) => [m.lat, m.lng])
              );
            }
            this.$snackbar.add({
              color: "error",
              icon: "mdi-bell-plus",
              message: error.message,
            });
          }
        );
      }
    },
    onClose() {
      this.dialog = false;
      this.reveal = false;
      this.showMap = false;
      this.locationPermission = false;
      this.waypoints = [];
      this.routes = [];
      this.selectedEvent = {};
    },
    onRoutes(e, routes) {
      this.routes = routes;
    },
    onError(error) {
      this.$snackbar.add({
        color: "error",
        icon: "mdi-bell-plus",
        message: "No pudimos calcular una ruta, por favor intenta más tarde.",
      });
    },
  },
  computed: {
    mapWidth() {
      return {
        minWidth: this.$vuetify.breakpoint.mdAndUp ? "300px" : "180px",
        minHeight: "200px",
      };
    },
    url() {
      const mapType = this.$vuetify.theme.dark ? "_dark" : "";
      return `https://tiles.stadiamaps.com/tiles/alidade_smooth${mapType}/{z}/{x}/{y}{r}.png`;
    },
  },
};
</script>

<style scoped></style>
