<route>
{
  props: {
  showParallax: true,
  showFab: true,
  },
  meta: {
    title: i18n.t(`router.home`),
    can: true,
  },
}
</route>
<template>
  <v-main class="main main-raised elevation-24">
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="12" class="mx-auto text-center mt-2">
          <info-content
            id="services-card"
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-information-outline"
            subtitle="landing.index.services.title"
          >
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <p
                  class="display-1 font-weight-regular mb-5"
                  v-text="$t('landing.index.services.description')"
                />
              </v-col>
              <!-- Fields -->
              <v-col cols="12" sm="12" md="6">
                <app-circles-card
                  title="menu.syntheticfields"
                  :src="require('@/assets/img/landing/field.jpg')"
                  icon="mdi-soccer-field"
                  :to="{ name: 'SyntheticFields' }"
                />
              </v-col>
              <!-- Grills -->
              <v-col cols="12" sm="12" md="6">
                <app-circles-card
                  title="menu.grills"
                  :src="require('@/assets/img/landing/grill.jpg')"
                  icon="mdi-grill"
                  :to="{ name: 'Grills' }"
                />
              </v-col>
            </v-row>
          </info-content>
        </v-col>
        <!-- Intro -->
        <v-col cols="12" sm="12" md="12">
          <info-content
            id="activities-card"
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-information-outline"
            subtitle="landing.index.activities.title"
          >
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <p
                  class="display-1 font-weight-regular mb-5"
                  v-text="$t('landing.index.activities.description')"
                />
              </v-col>
              <v-col
                v-for="(card, i) in $t('landing.index.activities.cards')"
                :key="i"
                cols="12"
                sm="12"
                md="6"
              >
                <material-blog-post
                  :image="card.image"
                  symmetrical
                  icon="mdi-post"
                  icon-color="info"
                  :category="card.category"
                  :title="card.title"
                  color="transparent"
                >
                  <ul
                    class="caption"
                    v-for="(txt, i) in card.description"
                    :key="`p-${i}`"
                  >
                    <li>{{ txt }}</li>
                  </ul>
                  <template #author>
                    <v-btn
                      :disabled="card.disabled"
                      color="primary"
                      class="text-left"
                      small
                      :to="card.to"
                    >
                      {{ $t("label.see_more") }}
                    </v-btn>
                  </template>
                </material-blog-post>
              </v-col>
            </v-row>
          </info-content>
          <info-content
            id="agenda-card"
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-calendar"
            subtitle="landing.index.agenda.title"
          >
            <p
              class="display-1 font-weight-regular mb-5"
              v-text="$t('landing.index.agenda.description')"
            />
            <v-skeleton-loader
              :loading="loadingEvents"
              class="mx-auto"
              type="card"
            >
              <v-slide-group show-arrows>
                <v-slide-item v-for="evt in events" :key="evt.id">
                  <agenda-events :event="evt" />
                </v-slide-item>
                <v-slide-item>
                  <v-card flat color="transparent">
                    <v-card-text
                      class="d-flex fill-height align-center justify-center text-center"
                    >
                      <v-tooltip top>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :aria-label="$t('buttons.More')"
                            color="primary"
                            fab
                            x-large
                            v-bind="attrs"
                            v-on="on"
                            :to="{ name: 'AgendaEvents' }"
                          >
                            <v-icon>mdi-arrow-right</v-icon>
                          </v-btn>
                        </template>
                        <i18n tag="span" path="buttons.More" />
                      </v-tooltip>
                    </v-card-text>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-skeleton-loader>
          </info-content>
          <info-content
            id="parks-card"
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-pine-tree"
            subtitle="landing.index.parks.title"
          >
            <v-row dense>
              <v-col cols="12" sm="12" md="6">
                <v-lazy :options="{ threshold: 0.5 }">
                  <app-animation
                    :animation-data="defaultOptionsPark"
                    loop
                    auto-play
                  />
                </v-lazy>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="6"
                class="display-1 grey--text font-weight-regular mt-md-12"
              >
                <p v-text="$t('landing.index.parks.description')" />
              </v-col>
            </v-row>
          </info-content>
        </v-col>
        <!-- Vital Passport -->
        <v-col cols="12" sm="12" md="6" class="mx-auto text-center">
          <v-card color="transparent" class="text-center">
            <v-img
              height="150"
              :alt="$t('menu.passport')"
              aspect-ratio="16/9"
              :src="require('@/assets/img/landing/vital.jpg')"
              :lazy-src="require('@/assets/img/landing/vital.jpg')"
              class="align-center"
            >
              <v-overlay
                absolute
                opacity="0.6"
                class="align-center text-center"
              >
                <v-card-title
                  class="display-serif-2 mb-2 text-center align-center"
                >
                  <v-icon left class="hidden-sm-and-down">mdi-card</v-icon>
                  <h4 class="text-center">{{ $t("menu.passport") }}</h4>
                </v-card-title>
                <v-card-text class="text-center">
                  <v-btn
                    rounded
                    color="primary"
                    :aria-label="$t('label.see_more')"
                    class="mt-1"
                    href="https://sim.idrd.gov.co/pasaporte-vital-en-linea/es"
                    target="_blank"
                  >
                    {{ $t("label.see_more") }}
                  </v-btn>
                </v-card-text>
              </v-overlay>
            </v-img>
          </v-card>
        </v-col>
        <!-- President Hall -->
        <v-col cols="12" sm="12" md="6" class="mx-auto text-center">
          <v-card color="transparent" class="text-center">
            <v-img
              height="150"
              :alt="$t('menu.president')"
              aspect-ratio="16/9"
              :src="require('@/assets/img/landing/president.jpg')"
              :lazy-src="require('@/assets/img/landing/president.jpg')"
              class="align-center"
            >
              <v-overlay
                absolute
                opacity="0.6"
                class="align-center text-center"
              >
                <v-card-title
                  class="display-serif-2 mb-2 text-center align-center"
                >
                  <v-icon left class="hidden-sm-and-down">mdi-card</v-icon>
                  <h4 class="text-center">{{ $t("menu.president") }}</h4>
                </v-card-title>
                <v-card-text class="text-center">
                  <v-btn
                    rounded
                    color="primary"
                    :aria-label="$t('label.see_more')"
                    class="mt-1"
                    href="https://sim.idrd.gov.co/reserva-salon/"
                    target="_blank"
                  >
                    {{ $t("label.see_more") }}
                  </v-btn>
                </v-card-text>
              </v-overlay>
            </v-img>
          </v-card>
        </v-col>
        <!-- Scales -->
        <v-col
          v-for="(card, i) in cards"
          cols="12"
          sm="12"
          :md="card.flex"
          :key="`card-${i}-rotate`"
        >
          <material-rotating-card
            manual-rotate
            :manual-rotate-state="card.rotate"
            :back-card-image="card.image"
            :front-card-image="card.image"
          >
            <template #frontRotateCardContent>
              <v-card :id="card.cardId" flat dark color="transparent">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title
                      class="display-serif-2"
                      style="word-break: break-word"
                    >
                      <v-icon left class="hidden-sm-and-down"
                        >mdi-pine-tree</v-icon
                      >
                      <h4 v-text="$t(card.title)" />
                    </v-card-title>
                    <v-card-subtitle class="display-1 mt-5 font-weight-medium">
                      <p
                        v-if="card.summary"
                        v-text="`${$t(card.text)}`.substr(0, 200) + '...'"
                      />
                      <p v-else v-text="$t(card.text)" />
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        :id="card.btnId"
                        outlined
                        rounded
                        small
                        @click="card.rotate = true"
                        v-text="$t('label.see_more')"
                      >
                      </v-btn>
                    </v-card-actions>
                  </div>
                </div>
              </v-card>
            </template>
            <template #backRotateCardContent>
              <div class="align-center">
                <v-card-title
                  class="display-serif-2 white--text"
                  style="word-break: break-word"
                >
                  <h4 v-text="$t(card.title)" />
                </v-card-title>
                <v-card-subtitle class="mt-5 font-weight-medium white--text">
                  <div
                    class="ma-0 pa-0"
                    style="max-height: 150px; overflow-y: scroll"
                  >
                    <p v-text="$t(card.text)" />
                  </div>
                  <v-btn
                    class="mt-5 mx-1"
                    color="white"
                    outlined
                    rounded
                    small
                    @click="card.rotate = false"
                    v-text="$t('label.go_back')"
                  />
                  <v-btn
                    class="mt-5 mx-1"
                    rounded
                    small
                    :to="
                      filterBy(
                        card.to,
                        $t(card.title).replaceAll(' ', '-').toLowerCase()
                      )
                    "
                    color="primary"
                    v-text="$t('label.see_parks')"
                  />
                </v-card-subtitle>
              </div>
            </template>
          </material-rotating-card>
        </v-col>
        <!-- Map -->
        <v-col id="v-step-desktop-5" cols="12" md="12">
          <bogota-map />
        </v-col>
        <!-- Diagrams -->
        <v-col id="v-step-desktop-6" cols="12" sm="12" md="12">
          <info-content
            id="diagrams-card"
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
                  <empty-state
                    class="my-2"
                    :rounded="$vuetify.breakpoint.mdAndUp"
                    icon="mdi-alphabetical-off"
                    :label="$t('label.no_data')"
                    :description="$t('label.no_data_desc')"
                  ></empty-state>
                </template>
                <template v-slot:no-results>
                  <empty-state
                    class="my-2"
                    icon="mdi-alphabetical-off"
                    :label="$tc('label.result', 0)"
                  ></empty-state>
                </template>
              </v-data-iterator>
            </v-skeleton-loader>
          </info-content>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import * as park from "@/assets/anims/park.json";
import Map from "@/components/custom/Map";
import { Park } from "@/models/services/Park";
import MaterialRotatingCard from "@/components/global/MaterialRotatingCard";
import MaterialBlogPost from "@/components/global/MaterialBlogPost";
import { IDRDEvent } from "@/models/services/IDRDEvent";
import AgendaEvents from "@/components/custom/AgendaEvents";
import AppAnimation from "@/components/app/Animation";
import AppCirclesCard from "@/components/app/CirclesCard";
import { dispatch } from "vuex-pathify";

export default {
  name: "IndexView",
  layout: "landing",
  components: {
    AppCirclesCard,
    AppAnimation,
    AgendaEvents,
    MaterialRotatingCard,
    MaterialBlogPost,
    InfoContent: () => import("@/components/global/InfoContent"),
    EmptyState: () => import("@/components/global/EmptyState"),
    BogotaMap: Map,
  },
  data: () => ({
    loadingEvents: false,
    reveal: false,
    dialog: false,
    regionalCard: false,
    is_available: false,
    defaultOptionsPark: park.default,
    cards: [],
    items: [],
    itemsPerPage: 10,
    itemsPerPageArray: [10, 15, 20, 25, 30],
    finding: false,
    total: 0,
    pagination: {},
    event: new IDRDEvent(),
    events: [],
  }),
  mounted() {
    dispatch("search/resetItems");
    dispatch("selects/resetForm");
    this.getRecords();
    this.getEvents();
  },
  methods: {
    filterBy: function (id, name = "") {
      return {
        name: "SearchType",
        params: { type_id: id, name: name },
      };
    },
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
        .finally(() => (this.finding = false));
    },
    getEvents() {
      this.loadingEvents = true;
      this.event
        .events(5)
        .then((response) => {
          this.events = response;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loadingEvents = false;
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

<style scoped>
.v-card--reveal {
  bottom: -200px;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
