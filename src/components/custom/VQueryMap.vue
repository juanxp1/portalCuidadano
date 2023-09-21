<template>
  <div v-bind="$attrs" ref="esri" class="mapdiv">
    <div id="actions" :style="style">
      <slot />
    </div>
    <v-i-frame v-if="showFrame" :src="frame" />
  </div>
</template>

<script>
import { get } from "lodash";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import esriBase from "@/util/esriBase";
const lightMap = "gray-vector";
const darkMap = "dark-gray-vector";
const detailsAction = {
  id: "details-action",
  title: "Detalles",
};
export default {
  name: "VEsriMap",
  props: {
    iframe: {
      type: Object,
      default: () => ({ ...esriBase.iframe }),
    },
    layer: {
      type: Object,
      default: () => ({ ...esriBase.layer }),
    },
    query: {
      type: [String, Number],
      default: undefined,
    },
  },
  data: () => ({
    showFrame: false,
    map: null,
    view: null,
    feature: null,
  }),
  metaInfo() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: `https://js.arcgis.com/4.22/esri/themes/${
            this.theme || "light"
          }/main.css`,
        },
      ],
    };
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    style() {
      return {
        maxWidth: this.$vuetify.breakpoint.mdAndUp ? "60%" : "",
      };
    },
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
  watch: {
    layer(layer) {
      if (this.feature && layer.url && layer.outFields && layer.popupTemplate) {
        this.feature.url = layer.url;
        this.feature.outFields = layer.outFields;
        this.feature.popupTemplate = layer.popupTemplate;
        this.feature.popupTemplate.actions.push(detailsAction);
      }
    },
    query(query) {
      this.filter(query);
    },
    "$vuetify.theme.dark"(val) {
      if (this.map && val) {
        this.map.basemap = darkMap;
      } else if (this.map && !val) {
        this.map.basemap = lightMap;
      }
    },
    "$vuetify.breakpoint.smAndDown"(val) {
      if (this.legend) {
        this.legend.visible = !val;
      }
    },
  },
  mounted() {
    this.init()
      .then((response) => {
        this.$emit("loaded", response);
      })
      .catch(() => {
        this.$emit("error", true);
      });
  },
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        this.showFrame = false;
        this.destroy();
        const that = this;
        const basemap = this.$vuetify.theme.dark ? darkMap : lightMap;
        const webmap = new Map({
          basemap,
        });
        const view = new MapView({
          container: this.$el,
          map: webmap,
          zoom: 11,
          center: [-74.063644, 4.624335],
        });
        view.ui.move(["zoom"], "bottom-right");

        const parks = new FeatureLayer({
          url: that.layer.url,
          popupEnabled: that.$vuetify.breakpoint.smAndUp,
          outFields: esriBase.layer.outFields,
          popupTemplate: {
            ...that.layer.popupTemplate,
            actions: [detailsAction],
          },
        });

        const group = new GroupLayer({
          ...esriBase.group,
        });

        const goToDetails = (id) => {
          if (id) {
            that.$router.push({
              name: "Park",
              params: { id },
            });
          }
        };

        view.popup = {
          dockEnabled: true,
          dockOptions: {
            // Disables the dock button from the popup
            buttonEnabled: false,
            // Ignore the default sizes that trigger responsive docking
            breakpoint: true,
          },
        };

        view.popup.on("trigger-action", function (event) {
          // If the zoom-out action is clicked, fire the zoomOut() function
          if (event.action.id === "details-action") {
            const id = get(
              view.popup.features[0],
              "attributes.Id_Parque",
              null
            );
            goToDetails(id);
          }
        });

        parks.on("layerview-create-error", function (error) {
          that.$snackbar.error(
            "La capa de parques no tiene una geometría correcta."
          );
          that.showFrame = true;
          webmap.destroy();
          view.destroy();
          parks.destroy();
          that.$nextTick(function () {
            that.destroy();
            reject(error);
          });
        });
        webmap.add(group);
        webmap.add(parks);
        view.on("layerview-create-error", function (error) {
          that.showFrame = true;
          webmap.destroy();
          view.destroy();
          parks.destroy();
          that.$nextTick(function () {
            that.destroy();
            reject(error);
          });
        });
        if (!this.$refs.esri.classList.contains("esri-view")) {
          this.destroy();
          this.showFrame = true;
          reject(new Error("Not map loaded"));
        }
        this.$nextTick(function () {
          resolve("Layer loaded");
          if (!that.showFrame) {
            that.map = webmap;
            that.view = view;
            that.feature = parks;
            if (that.query) {
              that.filter(that.query);
            }
          }
        });
      });
    },
    destroy() {
      if (this.view) {
        this.view.container = null;
        this.view.destroy();
      }
      if (this.map) {
        this.map.destroy();
      }
      if (this.feature) {
        this.feature.destroy();
      }
      this.map = null;
      this.view = null;
      this.feature = null;
    },
    filter(query) {
      const val = query && query !== "todo" ? query : "";
      if (this.feature && this.view) {
        const that = this;
        this.view
          .whenLayerView(this.feature)
          .then(function (featureLayerView) {
            featureLayerView
              .queryFeatures({ where: val })
              .then(() => {
                that.filterable(val);
              })
              .then(() => {
                featureLayerView.filter = {
                  where: val,
                };
                if (!val) {
                  that.view.zoom = 11;
                }
              })
              .catch(() => {
                console.log("No se encontraron datos");
              });
          })
          .catch(() => {
            console.log("No se pudo cargar el mapa");
          });
      }
    },
    filterable(q) {
      const that = this;
      const query = that.feature.createQuery();
      query.outFields = ["*"];
      query.where = q;
      that.feature.queryFeatures(query).then((results) => {
        that.view.goTo(results.features);
      });
    },
  },
  beforeDestroy() {
    this.destroy();
    this.showFrame = false;
  },
};
</script>

<style>
#actions {
  left: 0.1em;
  right: 0.1em;
  padding: 0.5em;
  position: absolute;
  top: 0.1em;
  z-index: 40;
}
.mapdiv {
  padding: 0;
  margin: 0;
  height: 100%;
}
</style>
