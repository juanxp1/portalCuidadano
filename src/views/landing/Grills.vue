<template>
  <details-page
    :bg="bg"
    height="400"
    :title="$tc('label.result_title', total, { qty: total })"
  >
    <template #heading>
      <v-col cols="12">
        <v-card
          flat
          :light="!$vuetify.theme.dark"
          :min-width="$vuetify.breakpoint.mdAndUp ? '600' : undefined"
        >
          <v-card-text>
            <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(getRecords)">
                <v-validation-provider v-slot="{ errors }">
                  <v-text-field
                    :label="$t('input.search')"
                    persistent-hint
                    hint="Digita el nombre de un parque, localidad, upz o descripción del asador."
                    clearable
                    v-model="query"
                    :error-messages="errors"
                    @click:clear="getRecords"
                  >
                    <template v-slot:append-outer>
                      <v-btn
                        :aria-label="$t('input.search')"
                        type="submit"
                        :loading="finding"
                        :disabled="finding"
                        small
                        color="primary"
                      >
                        <v-icon left>mdi-magnify</v-icon>
                        {{ $t("input.search") }}
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-validation-provider>
              </v-form>
            </v-validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
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
              :footer-props="{
                'items-per-page-options': itemsPerPageArray,
              }"
            >
              <template v-slot:default="props">
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <v-subheader inset>{{
                      $tc("label.result", total, { qty: total })
                    }}</v-subheader>
                  </v-col>
                  <v-col
                    v-for="item in props.items"
                    :key="item.park_endowment_id"
                    cols="12"
                    sm="12"
                    md="4"
                    class="my-5"
                  >
                    <material-card
                      color="transparent"
                      image
                      hover-reveal
                      :to="{
                        name: 'ParkEndowment',
                        params: {
                          id: item.park_code || item.park_id,
                          endowmentId: item.park_endowment_id,
                        },
                      }"
                    >
                      <template #image>
                        <v-img
                          height="200"
                          class="rounded"
                          :src="item.image ? item.image : bg"
                          :lazy-src="item.image ? item.image : bg"
                          :alt="item.title"
                          :eager="true"
                          aspect-ratio="16/9"
                          gradient="to top right, rgba(0,0,0,.4), rgba(0,0,0,.1)"
                        >
                          <v-app-bar
                            dense
                            absolute
                            flat
                            color="rgba(0, 0, 0, 0)"
                          >
                            <v-app-bar-nav-icon v-bind="item.props">
                              <template #default>
                                <v-icon class="lighten-1 white--text">
                                  mdi-pine-tree
                                </v-icon>
                              </template>
                            </v-app-bar-nav-icon>
                            <v-app-bar-title class="font-weight-bold">
                              # {{ item.park_endowment_id }}
                            </v-app-bar-title>
                          </v-app-bar>
                        </v-img>
                      </template>

                      <template #reveal-actions>
                        <app-btn
                          :tooltip-attrs="{ bottom: true }"
                          path="buttons.Details"
                          icon
                          class="mx-1"
                          icon-text="mdi-view-split-vertical"
                          :to="{
                            name: 'ParkEndowment',
                            params: {
                              id: item.park_code || item.park_id,
                              endowmentId: item.park_endowment_id,
                            },
                          }"
                        />
                        <app-btn
                          :tooltip-attrs="{ bottom: true }"
                          :disabled="!item.for_booking"
                          path="buttons.Book"
                          icon
                          class="mx-1"
                          icon-text="mdi-currency-usd"
                          v-bind="item.props"
                        />
                      </template>

                      <v-card-text>
                        <p class="caption">
                          <v-icon small left>mdi-pin</v-icon>
                          {{ item.park_address }}
                        </p>
                        <v-list dense class="pa-0 ma-0">
                          <v-list-item class="pa-0 ma-0">
                            <v-list-item-content>
                              <v-list-item-title>
                                <span class="font-weight-bold">{{
                                  `${$t("park.code_min")}: `
                                }}</span>
                                {{ `${item.park_code}` }}
                                <span
                                  class="font-weight-bold hidden-sm-and-down"
                                  >{{ ` - ${$t("park.name_min")}: ` }}</span
                                >
                                <span class="hidden-sm-and-down">{{
                                  `${item.park_name}`
                                }}</span>
                              </v-list-item-title>
                              <v-list-item-subtitle class="hidden-md-and-up">
                                <span class="font-weight-bold">{{
                                  `${$t("park.name_min")}: `
                                }}</span>
                                {{ `${item.park_name}` }}
                              </v-list-item-subtitle>
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
                              <v-list-item-subtitle
                                v-if="item.endowment_description"
                              >
                                <span class="font-weight-bold">{{
                                  `${$t("park.desc")}: `
                                }}</span>
                                {{ item.endowment_description }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card-text>

                      <template #actions>
                        <app-btn
                          path="buttons.Details"
                          outlined
                          text
                          :block="$vuetify.breakpoint.smAndDown"
                          color="primary"
                          class="ma-1"
                          icon-text="mdi-view-split-vertical"
                          :to="{
                            name: 'ParkEndowment',
                            params: {
                              id: item.park_code || item.park_id,
                              endowmentId: item.park_endowment_id,
                            },
                          }"
                        />
                        <app-btn
                          :disabled="!item.for_booking"
                          path="buttons.Book"
                          :block="$vuetify.breakpoint.smAndDown"
                          color="primary"
                          class="ma-1"
                          icon-text="mdi-currency-usd"
                          v-bind="item.props"
                        />
                      </template>
                    </material-card>
                  </v-col>
                </v-row>
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
        </v-col>
      </v-row>
    </v-card-text>
  </details-page>
</template>

<script>
import { debounce } from "lodash";
import { Booking } from "@/models/services/Booking";

export default {
  name: "SyntheticFields",
  data: () => ({
    bg: require("@/assets/img/landing/grill.jpg"),
    query: null,
    finding: false,
    total: 0,
    model: new Booking(),
    items: [],
    itemsPerPage: 12,
    itemsPerPageArray: [12, 24, 36, 48, 60],
    pagination: {},
  }),
  mounted() {
    this.getRecords();
  },
  methods: {
    getRecords: debounce(function () {
      this.finding = true;
      const { page } = this.pagination;
      const { itemsPerPage, query } = this;
      const params = {
        per_page: itemsPerPage,
        page,
        query,
      };
      this.model
        .grills({ params })
        .then((response) => {
          this.items = response.data.map((item) => {
            const to = {
              to: {
                name: "BookingDates",
                params: { id: item.park_endowment_id, item },
              },
            };
            const href = {
              to: {
                name: "Login",
                query: {
                  redirect: this.$router.resolve(to.to).route.path,
                },
              },
            };
            return {
              ...item,
              props: this.$auth.isLoggedIn() ? to : href,
            };
          });
          this.total = response.meta.total;
        })
        .then(() => {
          this.$vuetify.goTo(0);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => (this.finding = false));
    }, 300),
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

<style scoped></style>
