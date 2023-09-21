<template>
  <details-page
    :bg="bg"
    :title="$tc('label.result_title', total, { qty: total })"
  >
    <v-card-text>
      <v-row dense>
        <v-col cols="12" itemscope itemtype="https://schema.org/WebSite">
          <meta itemprop="url" content="https://portalciudadano.idrd.gov.co/" />
          <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
            <v-form
              @submit.prevent="handleSubmit(getRecords)"
              itemprop="potentialAction"
              itemscope
              itemtype="https://schema.org/SearchAction"
            >
              <meta
                itemprop="target"
                content="https://portalciudadano.idrd.gov.co/parques?q={search_term_string}"
              />
              <v-validation-provider
                v-if="showLocationsFirst"
                v-slot="{ errors }"
                :rules="{
                  numeric: true,
                  required: !form.park_type && !form.query,
                }"
                :name="$t('label.location').toLowerCase()"
              >
                <v-select
                  :error-messages="errors"
                  name="location"
                  :loading="finding"
                  :readonly="finding"
                  item-text="name"
                  item-value="id"
                  autocomplete="off"
                  clearable
                  required="required"
                  v-model.number="location"
                  :items="localities"
                  prepend-icon="mdi-map"
                  menu-props="auto"
                  :label="$t('help.location')"
                >
                  <template
                    v-if="$vuetify.breakpoint.mdAndUp"
                    v-slot:append-outer
                  >
                    <v-btn
                      v-if="!show"
                      :aria-label="$t('input.search')"
                      :loading="finding"
                      :disabled="finding"
                      type="submit"
                      small
                      color="primary"
                    >
                      <v-icon left>mdi-magnify</v-icon>
                      {{ $t("input.search") }}
                    </v-btn>
                    <v-btn
                      :aria-label="$t('input.advance_search')"
                      :loading="finding"
                      :disabled="finding"
                      @click="onAdvance"
                      small
                      color="primary"
                    >
                      <v-icon left>mdi-filter-variant</v-icon>
                      {{
                        show
                          ? $t("input.less_options")
                          : $t("input.more_options")
                      }}
                    </v-btn>
                  </template>
                </v-select>
              </v-validation-provider>
              <v-validation-provider
                v-else-if="showTypesFirst"
                v-slot="{ errors }"
                :rules="{
                  numeric: true,
                  required: !form.location && !form.query,
                }"
                :name="$t('label.park_type').toLowerCase()"
              >
                <v-select
                  :error-messages="errors"
                  name="park_type"
                  :loading="finding"
                  :readonly="finding"
                  item-text="name"
                  item-value="id"
                  autocomplete="off"
                  clearable
                  required="required"
                  v-model.number="park_type"
                  :items="scales"
                  prepend-icon="mdi-pine-tree"
                  menu-props="auto"
                  :label="$t('help.park_type')"
                >
                  <template
                    v-if="$vuetify.breakpoint.mdAndUp"
                    v-slot:append-outer
                  >
                    <v-btn
                      v-if="!show"
                      :aria-label="$t('input.search')"
                      :loading="finding"
                      :disabled="finding"
                      type="submit"
                      small
                      color="primary"
                    >
                      <v-icon left>mdi-magnify</v-icon>
                      {{ $t("input.search") }}
                    </v-btn>
                    <v-btn
                      :loading="finding"
                      :aria-label="$t('input.advance_search')"
                      :disabled="finding"
                      @click="onAdvance"
                      small
                      color="primary"
                    >
                      <v-icon left>mdi-filter-variant</v-icon>
                      {{
                        show
                          ? $t("input.less_options")
                          : $t("input.more_options")
                      }}
                    </v-btn>
                  </template>
                </v-select>
              </v-validation-provider>
              <v-validation-provider
                v-else
                v-slot="{ errors }"
                :rules="{ required: !form.park_type && !form.location }"
                :name="$t('label.parks').toLowerCase()"
              >
                <v-text-field
                  :error-messages="errors"
                  :loading="finding"
                  :readonly="finding"
                  v-model="query"
                  prepend-icon="mdi-pine-tree"
                  menu-props="auto"
                  :hint="$t('help.park')"
                  persistent-hint
                  :label="$t('label.parks')"
                  name="search_term_string"
                  itemprop="query-input"
                  required
                  clearable
                >
                  <template
                    v-if="$vuetify.breakpoint.mdAndUp"
                    v-slot:append-outer
                  >
                    <app-btn
                      v-if="!show"
                      path="input.search"
                      :loading="finding"
                      :disabled="finding"
                      type="submit"
                      small
                      color="primary"
                      icon-text="mdi-magnify"
                    />
                    <app-btn
                      :loading="finding"
                      :disabled="finding"
                      :path="`input.${show ? 'less_options' : 'more_options'}`"
                      icon-text="mdi-filter-variant"
                      color="primary"
                      small
                      @click="onAdvance"
                    />
                  </template>
                </v-text-field>
              </v-validation-provider>
              <v-expand-transition>
                <v-col
                  v-if="$vuetify.breakpoint.smAndDown"
                  cols="12"
                  class="text-center"
                >
                  <app-btn
                    v-if="!show"
                    path="input.search"
                    :loading="finding"
                    :disabled="finding"
                    type="submit"
                    small
                    color="primary"
                    icon-text="mdi-magnify"
                  />
                  <app-btn
                    :loading="finding"
                    :disabled="finding"
                    :path="`input.${show ? 'less_options' : 'more_options'}`"
                    icon-text="mdi-filter-variant"
                    color="primary"
                    small
                    text
                    block
                    class="mt-4"
                    @click="onAdvance"
                  />
                </v-col>
              </v-expand-transition>
            </v-form>
          </v-validation-observer>
        </v-col>
        <v-col cols="12">
          <v-expand-x-transition>
            <v-validation-observer
              v-show="show"
              ref="advance"
              v-slot="{ handleSubmit }"
            >
              <v-form @submit.prevent="handleSubmit(getRecords)">
                <v-col
                  v-if="showLocationsFirst || showTypesFirst"
                  class="mx-auto"
                  cols="12"
                  md="8"
                  sm="12"
                >
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="{
                      required: !form.park_type && !form.location,
                    }"
                    :name="$t('label.parks').toLowerCase()"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :loading="finding"
                      :readonly="finding"
                      v-model="query"
                      prepend-icon="mdi-pine-tree"
                      menu-props="auto"
                      :hint="$t('help.park')"
                      persistent-hint
                      :label="$t('label.parks')"
                      required
                      clearable
                    >
                    </v-text-field>
                  </v-validation-provider>
                </v-col>
                <!-- Location -->
                <v-col
                  v-if="!showLocationsFirst"
                  class="mx-auto"
                  cols="12"
                  md="8"
                  sm="12"
                >
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="{
                      numeric: true,
                      required: !form.park_type && !form.query,
                    }"
                    :name="$t('label.location').toLowerCase()"
                  >
                    <v-select
                      :error-messages="errors"
                      name="location"
                      :loading="finding"
                      :readonly="finding"
                      item-text="name"
                      item-value="id"
                      autocomplete="off"
                      clearable
                      required="required"
                      v-model.number="location"
                      :items="localities"
                      prepend-icon="mdi-map"
                      menu-props="auto"
                      :label="$t('help.location')"
                    >
                    </v-select>
                  </v-validation-provider>
                </v-col>
                <!-- Park Type -->
                <v-col
                  v-if="!showTypesFirst"
                  class="mx-auto"
                  cols="12"
                  md="8"
                  sm="12"
                >
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="{
                      numeric: true,
                      required: !form.location && !form.query,
                    }"
                    :name="$t('label.park_type').toLowerCase()"
                  >
                    <v-select
                      :error-messages="errors"
                      name="park_type"
                      :loading="finding"
                      :readonly="finding"
                      item-text="name"
                      item-value="id"
                      autocomplete="off"
                      clearable
                      required="required"
                      v-model.number="park_type"
                      :items="scales"
                      prepend-icon="mdi-pine-tree"
                      menu-props="auto"
                      :label="$t('help.park_type')"
                    >
                    </v-select>
                  </v-validation-provider>
                </v-col>
                <!-- Submit -->
                <v-col class="mx-auto text-right" cols="12" md="8" sm="12">
                  <app-btn
                    path="input.search"
                    type="submit"
                    :loading="finding"
                    :disabled="finding"
                    :small="$vuetify.breakpoint.smAndDown"
                    color="primary"
                    icon-text="mdi-magnify"
                  >
                  </app-btn>
                </v-col>
              </v-form>
            </v-validation-observer>
          </v-expand-x-transition>
        </v-col>
        <v-col cols="12" v-if="meaningText">
          <v-card-text class="mt-0">
            <p>{{ meaningText }}</p>
          </v-card-text>
        </v-col>
        <v-col cols="12" sm="12" md="6" class="text-center mx-auto">
          <p>
            <v-icon
              left
              class="lighten-1 success white--text"
              v-text="'mdi-pine-tree'"
            ></v-icon>
            {{ $tc("label.has_office", 0) }}
          </p>
          <p>
            <v-icon
              left
              class="lighten-1 grey white--text"
              v-text="'mdi-pine-tree'"
            ></v-icon>
            {{ $tc("label.has_office", 1) }}
          </p>
        </v-col>
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
              <template #default="props">
                <v-list three-line subheader>
                  <v-subheader inset>{{
                    $tc("label.result", total, { qty: total })
                  }}</v-subheader>
                  <v-list-item
                    v-for="item in props.items"
                    :key="item.code"
                    :to="{
                      name: 'Park',
                      params: { id: item.code, data: item },
                    }"
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
                      <v-btn icon>
                        <v-icon color="grey lighten-1">mdi-information</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </template>
              <template v-slot:no-data>
                <empty-state
                  class="my-2"
                  rounded
                  icon="mdi-alphabetical-off"
                  :label="$t('label.no_data')"
                  :description="$t('label.no_data_desc')"
                ></empty-state>
              </template>
              <template #no-results>
                <empty-state
                  class="my-2"
                  icon="mdi-alphabetical-off"
                  :label="$tc('label.result', 0)"
                ></empty-state>
              </template>
            </v-data-iterator>
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </details-page>
</template>

<route>
{
  name: "Search",
  path: "buscar",
  props: true,
  meta: {
    can: true,
  },
},
</route>

<script>
import { sync, dispatch } from "vuex-pathify";
import EmptyState from "@/components/global/EmptyState";
import { Park } from "@/models/services/Park";
import SelectsMixin from "@/mixins/selects";
import AppBtn from "@/components/app/Btn";
import DetailsPage from "@/components/custom/details/DetailsPage";
export default {
  name: "SearchList",
  layout: "landing",
  mixins: [SelectsMixin],
  components: { DetailsPage, AppBtn, EmptyState },
  props: {
    initial: {
      type: [Object, Array],
      default: () => ({}),
    },
    showLocationsFirst: {
      type: Boolean,
    },
    showTypesFirst: {
      type: Boolean,
    },
  },
  data: () => ({
    bg: require("@/assets/img/landing/profile.jpg"),
    show: false,
    model: new Park(),
    finding: false,
    timer: null,
    // items: [],
    // itemsPerPage: 10,
    // itemsPerPageArray: [10, 15, 20, 25, 30],
    reset: true,
    meaningText: null,
  }),
  mounted() {
    this.getLocalities();
    this.getScales();
    this.$nextTick(() => {
      if (this.$route.params.type_id) {
        this.validateParams();
      }
      this.show = !!(
        (this.form.park_type && !this.showTypesFirst) ||
        (this.form.location && !this.showLocationsFirst)
      );
      if (this.items.length === 0) {
        this.onGetRecords();
      }
    });
  },
  methods: {
    onGetRecords: function () {
      const routeParam = this.$route.params.type_id
        ? parseInt(this.$route.params.type_id)
        : null;
      if (
        this.items.length === 0 ||
        (routeParam && (!this.showTypesFirst || !this.showLocationsFirst))
      ) {
        this.finding = true;
        const { page } = this.pagination;
        const { query, location, park_type } = this.form;
        const params = {
          query: query || this.$route.query.q,
          locality_id: location,
          type_id: park_type || routeParam,
          page: page,
          per_page: this.itemsPerPage,
        };

        this.model
          .index({ params: params })
          .then((response) => {
            this.requested_at = response;
            this.items = response.data;
            this.total = response.meta.total;
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.finding = false;
            this.reset = true;
            this.show = false;
          });
      }
    },
    validateParams: function () {
      if (/^[0-9]+$/.test(this.$route.params.type_id)) {
        const park_type = parseInt(this.$route.params.type_id);
        dispatch("selects/resetForm").then(() => {
          this.park_type = park_type;
        });
      } else {
        this.$router.push({ name: "Search" });
      }
    },
    getRecords: function () {
      dispatch("search/resetItems")
        .then(() => {})
        .finally(() => this.onGetRecords());
    },
    onAdvance: function () {
      this.show = !this.show;
      if (!this.show) {
        dispatch("selects/resetForm").finally(() => {
          this.form = {
            query: null,
            location:
              this.form.location && this.showLocationsFirst
                ? this.form.location
                : null,
            park_type:
              this.form.park_type && this.showTypesFirst
                ? this.form.park_type
                : null,
          };
        });
      }
    },
    getMeaning: function () {
      const means = ["regional", "metropolitan", "zonal", "local", "pocket"];
      const index = this.form.park_type - 1;
      this.bg = means[index]
        ? require(`@/assets/img/landing/${means[index]}.jpg`)
        : require("@/assets/img/landing/profile.jpg");
      this.meaningText = means[index] ? this.$t(`text.${means[index]}`) : null;
    },
  },
  computed: {
    requested_at: sync("search/requested_at"),
    pagination: sync("search/pagination"),
    itemsPerPage: sync("search/itemsPerPage"),
    itemsPerPageArray: sync("search/itemsPerPageArray"),
    total: sync("search/total"),
    items: sync("search/items"),
    form: sync("selects/form"),
    query: sync("selects/form@query"),
    location: sync("selects/form@location"),
    park_type: sync("selects/form@park_type"),
  },
  watch: {
    "pagination.page": function () {
      this.onGetRecords();
    },
    itemsPerPage: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getRecords();
      } else {
        this.onGetRecords();
      }
    },
    "form.park_type": function () {
      this.getMeaning();
    },
    "$i18n.locale": function () {
      this.getMeaning();
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
};
</script>

<style scoped></style>
