<template>
  <v-main class="main main-raised elevation-24">
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="12" class="mx-auto text-center mt-2">
          <info-content
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-information-outline"
            subtitle="landing.index.services.title"
          >
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <p
                  tabindex="0"
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
              <!-- Swimming -->
              <v-col cols="12" sm="12" md="6">
                <app-circles-card
                  title="menu.swimming"
                  :src="require('@/assets/img/landing/swim.jpg')"
                  icon="mdi-swim"
                  :to="{
                    name: 'SportActivities',
                    params: {
                      query: 'NATACIÓN',
                    },
                  }"
                />
              </v-col>
              <!-- Grills -->
              <v-col cols="12" sm="12" md="6">
                <app-circles-card
                  title="menu.schools"
                  :src="require('@/assets/img/landing/school.jpeg')"
                  icon="mdi-school"
                  :to="{
                    name: 'SportActivities',
                    params: {
                      program_id: [2],
                    },
                  }"
                />
              </v-col>
              <!-- Orfeo -->
              <v-col cols="12" sm="12" md="8" class="mx-auto text-center">
                <app-circles-card
                  title="Reconocimiento deportivo a clubes deportivos"
                  title-class="display-serif-1"
                  :src="require('@/assets/img/landing/president.jpg')"
                  icon="mdi-domain"
                  :to="{ name: 'OrfeoClub' }"
                />
              </v-col>
            </v-row>
          </info-content>
        </v-col>
        <!-- Intro -->
        <v-col cols="12" sm="12" md="12">
          <info-content
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-ticket"
            subtitle="landing.index.activities.title"
          >
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <p
                  tabindex="0"
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
                  <ul role="list" class="caption">
                    <li
                      v-for="(txt, i) in card.description"
                      :key="`p-${i}`"
                      tabindex="0"
                      role="listitem"
                      v-text="txt"
                    />
                  </ul>
                  <template #author>
                    <v-btn
                      tabindex="0"
                      :aria-label="$t('label.see_more')"
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
              <div
                class="d-flex flex-nowrap py-12"
                style="width: 100%; overflow-x: auto"
              >
                <template v-if="events.length > 0">
                  <agenda-events
                    v-for="evt in events"
                    :key="evt.id"
                    :event="evt"
                  />
                  <v-card flat color="transparent" class="mx-16">
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
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>
                        <i18n tag="span" path="buttons.More" />
                      </v-tooltip>
                    </v-card-text>
                  </v-card>
                </template>
                <template v-else>
                  <v-card flat color="transparent" class="mx-auto">
                    <v-card-text>
                      <v-empty-state
                        icon="mdi-calendar"
                        label="No hay eventos programados"
                        description="No hay eventos programados para este día, regresa más tarde."
                      >
                        <v-btn
                          :aria-label="$t('buttons.More')"
                          color="primary"
                          :to="{ name: 'AgendaEvents' }"
                        >
                          {{ $t("buttons.More") }}
                          <v-icon right>mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-empty-state>
                    </v-card-text>
                  </v-card>
                </template>
              </div>
            </v-skeleton-loader>
          </info-content>
          <info-content
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
        <!-- Other Services -->
        <v-col cols="12" sm="12" md="12">
          <info-content
            text-left
            info-horizontal
            icon-color="primary"
            icon="mdi-information-outline"
            subtitle="landing.index.other.title"
          >
            <v-row dense>
              <!-- Vital Passport -->
              <v-col cols="12" sm="12" md="12" class="mx-auto text-center">
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
                        <v-icon left class="hidden-sm-and-down">
                          mdi-card
                        </v-icon>
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
            </v-row>
          </info-content>
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
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import * as park from "@/assets/anims/park.json";
import { IDRDEvent } from "@/models/services/IDRDEvent";
import { dispatch, get } from "vuex-pathify";

export default {
  name: "IndexView",
  metaInfo() {
    const m = this.events.map((evt) => {
      return {
        type: "application/ld+json",
        json: {
          "@context": "https://schema.org",
          "@type": "Event",
          name: evt.name,
          description: evt.description,
          image: evt.image,
          startDate: evt.start_date,
          endDate: evt.end_date || evt.start_date,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: evt.place,
            address: {
              "@type": "PostalAddress",
              streetAddress: evt.place,
              addressLocality: "BOGOTA",
              postalCode: "111221",
              addressCountry: "CO",
            },
          },
          performer: {
            "@type": "Person",
            name: "IDRD",
          },
        },
      };
    });
    return {
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "Website",
            name: "Portal Ciudadano - IDRD",
            url: `${process.env.VUE_APP_CANONICAL}`,
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.VUE_APP_CANONICAL}parques/buscar?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        },
        ...m,
      ],
    };
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
    this.getEvents();
  },
  computed: {
    ...get("route", ["hash", "name"]),
  },
  methods: {
    filterBy: function (id, name = "") {
      return {
        name: "SearchType",
        params: { type_id: id, name: name },
      };
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
    hash() {
      this.goToHash();
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
