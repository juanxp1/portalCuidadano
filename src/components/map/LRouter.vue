<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import { IRouter, IGeocoder, LineOptions } from "leaflet-routing-machine";
import { findRealParent } from "vue2-leaflet";
import "@/util/LRoutingTomtom";

const props = {
  visible: {
    type: Boolean,
    default: true,
  },
  waypoints: {
    type: Array,
    required: true,
  },
  router: {
    type: IRouter,
  },
  plan: {
    type: L.Routing.Plan,
  },
  geocoder: {
    type: IGeocoder,
  },
  fitSelectedRoutes: {
    type: [String, Boolean],
    default: "smart",
  },
  lineOptions: {
    type: LineOptions,
  },
  routeLine: {
    type: Function,
  },
  autoRoute: {
    type: Boolean,
    default: true,
  },
  routeWhileDragging: {
    type: Boolean,
    default: false,
  },
  routeDragInterval: {
    type: Number,
    default: 500,
  },
  waypointMode: {
    type: String,
    default: "connect",
  },
  useZoomParameter: {
    type: Boolean,
    default: false,
  },
  showAlternatives: {
    type: Boolean,
    default: false,
  },
  altLineOptions: {
    type: LineOptions,
  },
};

// const optionTestNames = [
//   'router',
//   'plan',
//   'geocoder',
//   'lineOptions',
//   'routeLine',
//   'altLineOptions'
// ]

export default {
  props,
  name: "LRoutingMachine",
  data() {
    return {
      parentContainer: null,
      ready: false,
      layer: null,
    };
  },
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    this.add();
    this.ready = true;
  },
  beforeDestroy() {
    return this.layer ? this.layer.remove() : null;
  },
  methods: {
    add() {
      const that = this;
      if (this.parentContainer._isMounted) {
        const {
          waypoints,
          fitSelectedRoutes,
          autoRoute,
          routeWhileDragging,
          routeDragInterval,
          waypointMode,
          useZoomParameter,
          showAlternatives,
        } = this;

        const options = {
          waypoints,
          fitSelectedRoutes,
          autoRoute,
          routeWhileDragging,
          routeDragInterval,
          waypointMode,
          useZoomParameter,
          showAlternatives,
          router: new L.Routing.mapbox(process.env.VUE_APP_MAPBOX_KEY, {
            language: this.lang,
          }),
        };

        const { mapObject } = this.parentContainer;
        const routingLayer = L.Routing.control(options);
        routingLayer
          .on("routesfound", function (e) {
            routingLayer.hide();
            const routes = e.routes.map((alt) => {
              return {
                name: alt.name,
                distance: routingLayer._formatter.formatDistance(
                  alt.summary.totalDistance,
                  this.options.totalDistanceRoundingSensitivity
                ),
                time: routingLayer._formatter.formatTime(alt.summary.totalTime),
                steps: alt.instructions.map((instr, i) => {
                  return {
                    text: routingLayer._formatter.formatInstruction(instr, i),
                    distance: routingLayer._formatter.formatDistance(
                      instr.distance
                    ),
                    time: routingLayer._formatter.formatTime(instr.time),
                    icon: routingLayer._formatter.getIconName(instr, i),
                  };
                }),
              };
            });
            that.$emit("routesfound", e, routes);
          })
          .on("routingerror", function (e) {
            that.$emit("routingerror", e);
          })
          .addTo(mapObject);
        this.layer = routingLayer;
      }
    },
  },
  computed: {
    lang() {
      return this.$i18n.locale || "es";
    },
  },
};
</script>

<style>
.leaflet-routing-container {
  display: none;
}
.leaflet-control-container .leaflet-routing-container-hide {
  display: none;
}
</style>
