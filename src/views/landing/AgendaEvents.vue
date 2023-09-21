<template>
  <details-page title="Agenda">
    <v-card-text>
      <v-row class="fill-height">
        <v-col cols="12" class="display-serif-2"> Eventos </v-col>
        <v-col cols="12">
          <l-map
            ref="pageMap"
            style="height: 400px; z-index: 0"
            :zoom="zoom"
            :center="[4.657373797629958, -74.0854918502333]"
          >
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-marker-cluster>
              <l-marker
                v-for="(marker, i) in markers"
                :lat-lng="marker.geo"
                @click="onMarker(marker)"
                :key="`marker-${i}`"
              >
                <l-tooltip :content="marker.format_date" />
              </l-marker>
            </l-marker-cluster>
            <l-control position="topright">
              <v-tooltip left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    :loading="finding"
                    :disabled="finding"
                    width="30"
                    height="30"
                    color="white"
                    class="mx-auto"
                    tile
                    v-bind="attrs"
                    v-on="on"
                    @click="myPosition"
                  >
                    <v-icon color="deep-purple" small
                      >mdi-crosshairs-gps</v-icon
                    >
                  </v-btn>
                </template>
                Mi ubicación
              </v-tooltip>
              <v-tooltip left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    :loading="finding"
                    :disabled="finding"
                    width="30"
                    height="30"
                    color="white"
                    class="mx-auto"
                    tile
                    v-bind="attrs"
                    v-on="on"
                    @click="setHome"
                  >
                    <v-icon color="deep-purple" small>mdi-home</v-icon>
                  </v-btn>
                </template>
                Inicio
              </v-tooltip>
              <v-tooltip left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    :loading="finding"
                    :disabled="finding"
                    width="30"
                    height="30"
                    color="white"
                    class="mx-auto"
                    tile
                    v-bind="attrs"
                    v-on="on"
                    @click="getEvents"
                  >
                    <v-icon color="deep-purple" small>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                Refrescar
              </v-tooltip>
            </l-control>
            <l-marker
              v-if="youAreHere.length"
              :lat-lng="youAreHere"
              :icon="iconHere"
            >
              <l-tooltip content="Estoy aquí" />
            </l-marker>
          </l-map>
        </v-col>
        <v-col cols="12" class="display-serif-2">
          Otros Eventos <span class="caption">(No georefenciados)</span>
        </v-col>
        <v-col cols="12">
          <v-list three-line>
            <v-list-item v-for="(event, i) in others" :key="i">
              <v-list-item-avatar>
                <v-icon color="gray" v-text="'mdi-calendar'"></v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="event.name" />
                <v-list-item-subtitle class="caption" v-text="event.place" />
                <v-list-item-subtitle
                  class="caption"
                  v-text="event.description"
                />
                <v-list-item-subtitle>
                  <v-chip-group
                    active-class="deep-purple--text text--accent-4 my-1"
                    mandatory
                    column
                  >
                    <v-chip small>
                      <v-icon small left>mdi-currency-usd</v-icon>
                      {{ event.value }}
                    </v-chip>
                    <v-chip small>
                      <v-icon small left>mdi-calendar</v-icon>
                      {{ event.format_date }}
                    </v-chip>
                    <v-chip small>
                      <v-icon small left>mdi-clock</v-icon>
                      {{ event.hour }}
                    </v-chip>
                  </v-chip-group>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-btn
                    rounded
                    x-small
                    color="primary"
                    :aria-label="$t('label.see_more')"
                    class="mt-1"
                    @click="onMarker(event)"
                  >
                    {{ $t("label.see_more") }}
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12">
          <help-accordion />
        </v-col>
      </v-row>
    </v-card-text>
    <template #after-card>
      <v-dialog v-model="dialog" max-width="600">
        <v-card flat>
          <v-card-title
            class="text-h5 headline-serif"
            style="word-break: normal"
          >
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
                      />
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
            <v-row dense class="hidden-md-and-up">
              <v-col cols="12" sm="12" md="4">
                <add-to-calendar
                  :loading="calculating"
                  :disabled="calculating"
                  color="primary"
                  text
                  classes="mx-1"
                  :title="selectedEvent.name"
                  :location="selectedEvent.place"
                  :details="selectedEvent.description"
                  :start="selectedEvent.start"
                  :end="selectedEvent.end"
                />
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-btn
                  :aria-label="$t('buttons.Close')"
                  color="error darken-1"
                  text
                  @click="onClose"
                  v-text="$t('buttons.Close')"
                >
                </v-btn>
              </v-col>
            </v-row>
            <v-spacer class="hidden-sm-and-down" />
            <div class="hidden-sm-and-down">
              <add-to-calendar
                :loading="calculating"
                :disabled="calculating"
                color="primary"
                text
                classes="mx-1"
                :title="selectedEvent.name"
                :location="selectedEvent.place"
                :details="selectedEvent.description"
                :start="selectedEvent.start"
                :end="selectedEvent.end"
              />
              <v-btn
                :aria-label="$t('buttons.Close')"
                color="error darken-1"
                text
                @click="onClose"
                v-text="$t('buttons.Close')"
              >
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </details-page>
</template>

<script>
import { Icon } from "leaflet";
import { LMap, LTileLayer, LMarker, LControl, LTooltip } from "vue2-leaflet";
import LRouter from "@/components/map/LRouter";
import LMarkerCluster from "@/components/map/LMarkerCluster";
import { IDRDEvent } from "@/models/services/IDRDEvent";
export default {
  name: "AgendaEventsView",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LTooltip,
    LRouter,
    LMarkerCluster,
  },
  data: () => ({
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    zoom: 12,
    event: new IDRDEvent(),
    events: [],
    dialog: false,
    reveal: false,
    showMap: false,
    calculating: false,
    selectedEvent: {},
    map: null,
    waypoints: [],
    locationPermission: false,
    routes: [],
    finding: false,
    youAreHere: [],
    iconHere: new Icon({
      iconUrl: require("@/assets/events/you-are-here.png"),
      iconSize: [50, 50],
      iconAnchor: [40, 40],
    }),
    bounds: [],
  }),
  created() {
    this.getEvents();
  },
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
    getEvents() {
      this.loadingEvents = true;
      this.finding = true;
      this.event
        .events()
        .then((response) => {
          this.events = response;
          this.bounds = this.markers.map((m) => m.geo);
        })
        .finally(() => {
          this.loadingEvents = false;
          this.finding = false;
          this.$refs.pageMap.mapObject.fitBounds(this.bounds);
        });
    },
    setHome() {
      this.$refs.pageMap.mapObject.fitBounds(this.bounds);
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
    myPosition() {
      const map = this.$refs.pageMap.mapObject;
      if (navigator.geolocation) {
        const that = this;
        that.finding = true;
        navigator.geolocation.getCurrentPosition(
          (position) => {
            that.youAreHere = [
              position.coords.latitude,
              position.coords.longitude,
            ];
            that.bounds.push(that.youAreHere);
            map.fitBounds(that.bounds);
            that.finding = false;
          },
          (error) => {
            that.finding = false;
            if (error.message.toLowerCase().includes("denied")) {
              that.youAreHere = [4.657373797629958, -74.0854918502333];
              that.bounds.push(that.youAreHere);
              map.fitBounds(that.bounds);
            }
            this.$snackbar.error(error.message);
          }
        );
      }
    },
  },
  computed: {
    url() {
      const mapType = this.$vuetify.theme.dark ? "_dark" : "";
      return `https://tiles.stadiamaps.com/tiles/alidade_smooth${mapType}/{z}/{x}/{y}{r}.png`;
    },
    markers() {
      return this.events.filter((event) => !!event.geo.length);
    },
    others() {
      return this.events.filter((event) => !event.geo.length);
    },
  },
};
</script>

<style scoped></style>
