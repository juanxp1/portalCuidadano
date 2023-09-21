<template>
  <v-row v-resize="onResize">
    <v-col cols="12">
      <info-content
        text-left
        info-horizontal
        :icon-color="item.color"
        icon="mdi-pine-tree"
        :subtitle="$t('label.general')"
      >
        <p class="font-weight-regular">{{ $t("label.diagram") }}</p>
        <v-skeleton-loader
          :loading="finding"
          type="list-item-avatar-three-line, card@2"
          width="100%"
        >
          <v-list three-line color="transparent">
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
                  {{ `${item.code}` }}
                  <span class="font-weight-bold hidden-sm-and-down">{{
                    ` - ${$t("park.name_min")}: `
                  }}</span>
                  <span class="hidden-sm-and-down">{{ `${item.name}` }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="hidden-md-and-up">
                  <span class="font-weight-bold">{{
                    `${$t("park.name_min")}: `
                  }}</span>
                  {{ `${item.name}` }}
                </v-list-item-subtitle>
                <v-list-item-subtitle
                  v-text="item.address"
                ></v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="font-weight-bold">{{
                    `${$t("park.locality")}: `
                  }}</span>
                  {{ item.locality }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="font-weight-bold">{{
                    `${$t("park.upz")}: `
                  }}</span>
                  {{ item.upz }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="font-weight-bold">{{
                    `${$t("park.scale")}: `
                  }}</span>
                  {{ item.scale }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-skeleton-loader>
        <v-card-actions v-if="item.code || item.id">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="finding"
            :disabled="finding"
            block
            outlined
            small
            :to="{ name: 'Park', params: { id: item.code || item.id} }"
            >{{ $t("input.details") }}</v-btn
          >
        </v-card-actions>
      </info-content>
    </v-col>
    <v-col v-if="type === 0" cols="12">
      <v-responsive aspect-ratio="16/9">
        <img
          style="max-width: 100%"
          @load="onResize"
          :alt="item.name"
          :usemap="`#park_sector`"
          :lazy-src="`${base}${item.id}.jpg`"
          :src="`${base}${item.id}.jpg`"
        />
        <map :name="`park_sector`">
          <area
            v-for="sector in item.sectors"
            :key="sector.id"
            @mousemove="
              $vuetify.breakpoint.smAndDown
                ? () => {}
                : onHoverSector($event, sector)
            "
            @click="onClickSector($event, sector)"
            href="javascript:void(0);"
            shape="rect"
            :coords="sector.coordinate"
            style="outline: none"
            target="_self"
            :alt="endowment.sector"
            :title="endowment.sector"
          />
        </map>
      </v-responsive>
      <v-responsive
        v-if="$vuetify.breakpoint.smAndDown"
        class="text-center my-2"
        aspect-ratio="16/9"
      >
        <v-btn
          v-for="sector in item.sectors"
          :key="sector.id"
          @click="onClickSector($event, sector)"
          x-small
          color="primary"
          >{{ sector.sector }}</v-btn
        >
      </v-responsive>
    </v-col>
    <v-col
      v-for="sector in item.sectors"
      :key="sector.id"
      :id="`sector_${sector.id}`"
      cols="12"
    >
      <h1 class="display-serif-2">{{ sector.sector }}</h1>
      <v-responsive aspect-ratio="16/9">
        <v-img :lazy-src="`${base}${item.id}_${sector.id}.jpg`">
          <img
            style="max-width: 100%"
            @load="onResize"
            :alt="item.name"
            :usemap="`#park_map_${sector.id}`"
            :lazy-src="`${base}${item.id}_${sector.id}.jpg`"
            :src="`${base}${item.id}_${sector.id}.jpg`"
          />
          <map :name="`park_map_${sector.id}`">
            <area
              v-for="endowment in sector.endowments"
              :key="endowment.id"
              @mouseover="
                $vuetify.breakpoint.smAndDown
                  ? () => {}
                  : onHover($event, endowment)
              "
              @click="onClick($event, endowment)"
              href="javascript:void(0);"
              shape="rect"
              :coords="endowment.map"
              style="outline: none"
              target="_self"
              :alt="endowment.endowment"
              :title="endowment.endowment"
            />
          </map>
        </v-img>
      </v-responsive>
      <v-responsive
        v-if="$vuetify.breakpoint.smAndDown"
        class="text-center my-2"
        aspect-ratio="16/9"
      >
        <v-btn
          v-for="endowment in sector.endowments"
          :key="endowment.id"
          @click="onClick($event, endowment)"
          x-small
          color="primary"
          >{{ endowment.id }}</v-btn
        >
      </v-responsive>
    </v-col>
    <v-menu
      v-model="showSector"
      :position-x="sectorX"
      :position-y="sectorY"
      absolute
      offset-y
    >
      <v-card max-width="400">
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              {{ sector.sector }}
            </v-list-item-title>
            <v-list-item-action>
              <v-btn
                :aria-label="$t('input.go')"
                color="primary"
                x-small
                @click="$vuetify.goTo(`#sector_${sector.id}`)"
                >{{ $t("input.go") }}</v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-menu
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      :close-on-content-click="false"
      offset-y
    >
      <endowment-component :resource="endowment" :onClose="onClose">
        <v-card-actions>
          <v-btn
            :aria-label="$t('input.details')"
            block
            color="primary"
            small
            @click.stop="menuDetails = true"
            >{{ $t("input.details") }}</v-btn
          >
        </v-card-actions>
      </endowment-component>
    </v-menu>
    <v-dialog
      v-else
      v-model="showMenu"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <endowment-component
        :short="false"
        :resource="endowment"
        :onClose="onClose"
      />
    </v-dialog>
    <v-dialog
      v-model="menuDetails"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <endowment-component
        :short="false"
        :resource="endowment"
        :onClose="onCloseMenu"
      />
    </v-dialog>
  </v-row>
</template>

<script>
import { Park } from "@/models/services/Park";
import _ImageMap from "@/models/services/ImageMap";
export default {
  name: "ImageSectors",
  data: () => ({
    model: new Park(),
    menuDetails: false,
    item: {},
    type: 1,
    finding: false,
    base: "https://sim1.idrd.gov.co/SIM/Parques/ParquesPublico/public/Img/Parques/",
    showMenu: false,
    x: 0,
    y: 0,
    endowment: {},
    showSector: false,
    sectorX: 0,
    sectorY: 0,
    sector: {},
  }),
  mounted() {
    if (!this.$route.params.id) {
      this.$router.push({ name: "Error" });
    } else {
      this.getRecords();
    }
  },
  methods: {
    getRecords() {
      this.finding = true;
      this.model
        .sectors(this.$route.params.id)
        .then((response) => {
          this.item = response.data.park;
          this.type = response.data.type;
        })
        .catch((error) => error)
        .finally(() => {
          this.finding = false;
          this.$nextTick(function () {
            this.imageMap();
          });
        });
    },
    onHover: function (e, endowment) {
      e.preventDefault();
      this.showMenu = false;
      this.endowment = {};
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
        this.endowment = endowment;
      });
    },
    onClick: function (e, endowment) {
      e.preventDefault();
      this.showMenu = false;
      this.endowment = {};
      this.$nextTick(() => {
        this.showMenu = true;
        this.endowment = endowment;
      });
    },
    imageMap: function () {
      _ImageMap("img[usemap]", 700);
    },
    onClose: function () {
      this.showMenu = false;
      this.endowment = {};
    },
    onCloseMenu: function () {
      this.menuDetails = false;
      this.showMenu = false;
      this.endowment = {};
    },
    onResize: function () {
      this.$nextTick(function () {
        this.imageMap();
      });
    },
    onHoverSector: function (e, sector) {
      e.preventDefault();
      this.showSector = false;
      this.sector = {};
      this.sectorX = e.clientX;
      this.sectorY = e.clientY;
      this.$nextTick(() => {
        this.showSector = true;
        this.sector = sector;
      });
    },
    onClickSector: function (e, sector) {
      e.preventDefault();
      this.showSector = false;
      this.sector = {};
      this.sectorX = e.clientX;
      this.sectorY = e.clientY;
      this.$nextTick(() => {
        this.showSector = true;
        this.sector = sector;
      });
    },
  },
};
</script>

<style scoped></style>
