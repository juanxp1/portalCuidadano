<template>
  <v-skeleton-loader :loading="finding" type="table">
    <v-data-iterator
      :headers="headers"
      :items="items"
      :options.sync="pagination"
      :loading="finding"
      :items-per-page.sync="itemsPerPage"
      :server-items-length="total"
      show-expand
      single-expand
    >
      <template v-if="!!title" #header>
        <v-toolbar flat>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>
      </template>

      <template #default="{ items, isExpanded, expand }">
        <div
          class="d-flex flex-nowrap py-12"
          style="width: 100%; overflow-x: auto"
        >
          <material-card
            v-for="item in items"
            :key="item.id"
            color="transparent"
            class="ma-1 pa-1"
            image
            hover-reveal
            :max-width="$vuetify.breakpoint.mdAndUp ? '320' : '250'"
          >
            <template #image>
              <v-img
                class="rounded"
                :src="item.image"
                :lazy-src="item.image"
                :alt="item.endowment"
                :eager="true"
                height="200"
                gradient="to top right, rgba(0,0,0,.4), rgba(0,0,0,.1)"
              >
                <v-app-bar dense absolute flat color="rgba(0, 0, 0, 0)">
                  <v-app-bar-title class="font-weight-bold">
                    # {{ item.id }}
                  </v-app-bar-title>
                </v-app-bar>
                <template #placeholder>
                  <v-img
                    class="rounded"
                    :src="placeholder"
                    :lazy-src="placeholder"
                    alt="No Image"
                    :eager="true"
                    height="200"
                    gradient="to top right, rgba(0,0,0,.4), rgba(0,0,0,.1)"
                  />
                </template>
              </v-img>
            </template>
            <template #reveal-actions>
              <app-btn
                path="input.window"
                :x-small="$vuetify.breakpoint.smAndDown"
                text
                :href="item.image"
                target="_blank"
                icon-text="mdi-image-outline"
              />
            </template>
            <v-card-text class="pa-0 ma-0">
              <v-list dense class="pa-0 ma-0">
                <v-list-item
                  v-for="(header, i) in headers"
                  :key="`header-${i}`"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item[header.value]" />
                    <v-list-item-subtitle v-text="header.text" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions
              class="flex-wrap align-center justify-center pa-0 ma-0"
            >
              <v-divider class="my-2" />
              <app-btn
                path="buttons.Details"
                text
                block
                color="primary"
                class="mx-1"
                icon-text="mdi-view-split-vertical"
                :to="{
                  name: 'ParkEndowment',
                  params: {
                    id: item.park_code || item.park_id,
                    endowmentId: item.id,
                  },
                }"
              />
            </v-card-actions>
          </material-card>
        </div>
      </template>
    </v-data-iterator>
  </v-skeleton-loader>
</template>

<script>
import { Park } from "@/models/services/Park";

export default {
  name: "EquipmentIterator",
  props: {
    title: {
      type: [Number, String],
      default: undefined,
    },
    park_id: {
      type: [Number, String],
      required: true,
    },
    equipment_id: {
      type: [Number, String],
      required: true,
    },
  },
  mounted() {
    this.getRecords();
  },
  data: () => ({
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    model: new Park(),
    finding: false,
    showImage: true,
    placeholder: require("@/assets/img/error/no_image.png"),
  }),
  methods: {
    getRecords: function () {
      this.finding = true;
      const params = {
        page: this.pagination.page,
        per_page: this.itemsPerPage,
      };
      this.model
        .equipment(this.park_id, this.equipment_id, { params: params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
        })
        .finally(() => (this.finding = false));
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("endowment.endowment"),
          align: "start",
          sortable: false,
          value: "endowment",
        },
        {
          text: this.$t("endowment.description"),
          align: "start",
          sortable: true,
          value: "description",
        },
      ];
    },
    headers_expand() {
      return [
        {
          text: this.$t("endowment.floor_material"),
          align: "start",
          sortable: false,
          value: "floor_material",
        },
        {
          text: this.$t("endowment.status"),
          align: "start",
          sortable: false,
          value: "status",
        },
        {
          text: this.$t("endowment.material"),
          align: "start",
          sortable: false,
          value: "material",
        },
        {
          text: this.$t("endowment.dressing_room"),
          align: "start",
          sortable: false,
          value: "dressing_room",
        },
        {
          text: this.$t("endowment.illumination"),
          align: "start",
          sortable: false,
          value: "illumination",
        },
        {
          text: this.$t("endowment.economic_use"),
          align: "start",
          sortable: false,
          value: "economic_use",
        },
        {
          text: this.$t("endowment.area"),
          align: "start",
          sortable: false,
          value: "area",
        },
        {
          text: this.$t("endowment.enclosure"),
          align: "start",
          sortable: false,
          value: "enclosure",
        },
        {
          text: this.$t("endowment.light"),
          align: "start",
          sortable: false,
          value: "light",
        },
        {
          text: this.$t("endowment.water"),
          align: "start",
          sortable: true,
          value: "water",
        },
        {
          text: this.$t("endowment.gas"),
          align: "start",
          sortable: true,
          value: "gas",
        },
      ];
    },
  },
  watch: {
    "pagination.page": function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getRecords();
      }
    },
    itemsPerPage: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getRecords();
      }
    },
  },
};
</script>

<style scoped></style>
