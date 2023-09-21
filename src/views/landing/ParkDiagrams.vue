<template>
  <details-page :opacity="0.6" :title="$t('menu.parkdiagram')">
    <v-card-text>
      <info-content
        text-left
        info-horizontal
        icon-color="primary"
        icon="mdi-information-outline"
        subtitle="label.park_diagram"
      >
        <v-skeleton-loader
          :loading="finding"
          type="heading, list-item-avatar-three-line@6"
        >
          <v-data-iterator
            :items="items"
            :items-per-page.sync="itemsPerPage"
            :options.sync="pagination"
            item-key="id"
            :server-items-length="total"
            :loading="finding"
            :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
          >
            <template v-slot:default="props">
              <v-list three-line subheader>
                <v-subheader inset>{{
                  $tc("label.result", total, { qty: total })
                }}</v-subheader>
                <v-list-item
                  v-for="item in props.items"
                  :key="item.code"
                  :to="{ name: 'ParkDiagram', params: { id: item.code } }"
                >
                  <v-list-item-avatar>
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
                      <span class="hidden-sm-and-down">{{
                        `${item.name}`
                      }}</span>
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
                    <v-list-item-subtitle v-if="item.endowment_description">
                      <span class="font-weight-bold">{{
                        `${$t("park.desc")}: `
                      }}</span>
                      {{ item.endowment_description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action v-if="$vuetify.breakpoint.mdAndUp">
                    <v-btn :aria-label="$t('buttons.info')" icon small>
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </template>
            <template v-slot:no-data>
              <v-empty-state
                class="my-2"
                :rounded="$vuetify.breakpoint.mdAndUp"
                icon="mdi-alphabetical-off"
                :label="$t('label.no_data')"
                :description="$t('label.no_data_desc')"
              />
            </template>
            <template v-slot:no-results>
              <v-empty-state
                class="my-2"
                icon="mdi-alphabetical-off"
                :label="$tc('label.result', 0)"
              />
            </template>
          </v-data-iterator>
        </v-skeleton-loader>
      </info-content>
    </v-card-text>
  </details-page>
</template>

<script>
import { Park } from "@/models/services/Park";

export default {
  name: "ParkDiagram",
  mounted() {
    this.getRecords();
  },
  data: () => ({
    items: [],
    itemsPerPage: 10,
    itemsPerPageArray: [10, 15, 20, 25, 30],
    finding: false,
    total: 0,
    pagination: {},
  }),
  methods: {
    getRecords: function () {
      this.finding = true;

      const { page } = this.pagination;
      const params = {
        page: page,
        per_page: this.itemsPerPage,
      };

      new Park()
        .diagrams({ params: params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.finding = false;
          this.$vuetify.goTo("#diagrama-de-parques", { duration: 800 });
        });
    },
  },
  watch: {
    "pagination.page": function () {
      this.getRecords();
    },
    itemsPerPage: function () {
      this.getRecords();
    },
  },
};
</script>
