<template>
  <v-skeleton-loader :loading="finding" type="table">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="pagination"
      :loading="finding"
      :items-per-page.sync="itemsPerPage"
      :server-items-length="total"
      show-expand
      single-expand
    >
      <template v-if="title" #top>
        <v-toolbar flat>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>
      </template>

      <template #[`item.economic_use`]="{ item }">
        <span>{{ item.economic_use }}</span>
      </template>

      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row
            v-for="(expanded_item, key) in headers_expand"
            v-if="item[expanded_item.value]"
            :key="`expanded-${key}`"
          >
            <v-col
              v-if="expanded_item.value !== 'image'"
              cols="12"
              sm="12"
              md="6"
            >
              <div class="font-weight-bold">{{ expanded_item.text }}</div>
            </v-col>
            <v-col
              v-if="expanded_item.value !== 'image'"
              cols="12"
              sm="12"
              md="6"
            >
              {{ item[expanded_item.value] }}
            </v-col>
            <v-col
              v-else
              cols="12"
              align-self="center"
              class="text-center justify-center mx-auto"
              sm="12"
              md="12"
            >
              <v-col cols="12" md="12" class="mx-auto">
                <v-img
                  v-if="showImage"
                  :max-width="$vuetify.breakpoint.mdAndUp ? '400' : '180'"
                  aspect-ratio="16/9"
                  class="text-center justify-center align-center"
                  :lazy-src="item[expanded_item.value]"
                  :src="item[expanded_item.value]"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="mx-auto text-center">
                <v-btn
                  :aria-label="`${$t('buttons.view')} ${$t('buttons.image')}`"
                  :x-small="$vuetify.breakpoint.smAndDown"
                  text
                  @click="reloadImage"
                >
                  <v-icon left>mdi-refresh</v-icon>
                  {{ `${$t("buttons.view")} ${$t("buttons.image")}` }}
                </v-btn>
                <v-btn
                  :aria-label="$t('input.window')"
                  :x-small="$vuetify.breakpoint.smAndDown"
                  text
                  :href="item[expanded_item.value]"
                  target="_blank"
                >
                  <v-icon v-if="$vuetify.breakpoint.mdAndUp" left
                    >mdi-image-outline</v-icon
                  >
                  {{ `${$t("input.window")}` }}
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
        </td>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
import { Park } from "@/models/services/Park";

export default {
  name: "EquipmentTable",
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
    reloadImage: function () {
      this.showImage = false;
      this.$nextTick(function () {
        this.showImage = true;
      });
    },
  },
  computed: {
    headers() {
      return [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: this.$t("endowment.endowment"),
          align: "start",
          sortable: false,
          value: "endowment",
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
          text: this.$t("endowment.floor_material"),
          align: "start",
          sortable: false,
          value: "floor_material",
        },
        {
          text: this.$t("endowment.enclosure"),
          align: "start",
          sortable: false,
          value: "enclosure",
        },
      ];
    },
    headers_expand() {
      return [
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
        {
          text: this.$t("endowment.description"),
          align: "start",
          sortable: true,
          value: "description",
        },
        {
          text: this.$t("endowment.image"),
          align: "start",
          sortable: true,
          value: "image",
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
