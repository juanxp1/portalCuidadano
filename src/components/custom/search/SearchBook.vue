<template>
  <div class="wrapper">
    <ais-instant-search
      index-name="booking_index"
      :search-client="searchClient"
      :stalled-search-delay="600"
      :search-function="searchFunction"
    >
      <ais-configure
        :pagination-limited-to.camel="108"
        :filters="`tag = ${filter}`"
        :query="searchString"
        snippet-ellipsis-text.camel="..."
        :hits-per-page.camel="itemsPerPage"
      />
      <v-parallax :lazy-src="bg" height="350" class="text-center" :src="bg">
        <v-overlay absolute :opacity="0.3">
          <v-row>
            <v-col cols="12">
              <ais-stats>
                <template v-slot="{ nbHits }">
                  <h1 class="display-serif-2">
                    {{ $tc("label.result_title", nbHits, { qty: nbHits }) }}
                  </h1>
                </template>
              </ais-stats>
            </v-col>
            <v-col cols="12">
              <v-card
                flat
                :light="!$vuetify.theme.dark"
                :min-width="$vuetify.breakpoint.mdAndUp ? '600' : undefined"
              >
                <v-card-text>
                  <v-text-field
                    ref="searchInput"
                    v-model="searchString"
                    :placeholder="placeholder"
                    autocomplete="off"
                    class="mx-2 mx-md-4"
                    dense
                    hide-details
                    solo
                  >
                    <template #prepend-inner>
                      <v-icon class="ml-1 mr-2"> mdi-magnify </v-icon>
                    </template>
                  </v-text-field>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-overlay>
      </v-parallax>
      <v-card class="main main-raised elevation-24 mb-12">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <ais-hits v-slot="{ items }">
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <ais-stats>
                      <template v-slot="{ nbHits }">
                        <v-subheader inset>
                          {{ $tc("label.result", nbHits, { qty: nbHits }) }}
                        </v-subheader>
                      </template>
                    </ais-stats>
                  </v-col>
                  <v-col
                    v-for="item in items"
                    :key="item.park_endowment_id"
                    cols="12"
                    sm="12"
                    md="4"
                    class="my-5"
                  >
                    <material-card color="transparent" image hover-reveal>
                      <template #image>
                        <v-img
                          height="200"
                          class="rounded"
                          :src="
                            item.image
                              ? item.image
                              : require('@/assets/img/landing/field.jpg')
                          "
                          :lazy-src="
                            item.image
                              ? item.image
                              : require('@/assets/img/landing/field.jpg')
                          "
                          :alt="item.park_name"
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
                            <v-app-bar-title
                              class="font-weight-bold body-2"
                              v-text="item.park_name"
                            />
                          </v-app-bar>
                        </v-img>
                      </template>
                      <template #reveal-actions>
                        <v-tooltip bottom>
                          <template #activator="{ attrs, on }">
                            <v-btn
                              aria-label="Reservar"
                              icon
                              class="mx-1"
                              v-bind="{ ...attrs, ...item.props }"
                              v-on="on"
                            >
                              <v-icon>mdi-view-split-vertical</v-icon>
                            </v-btn>
                          </template>
                          <span>Reservar</span>
                        </v-tooltip>
                      </template>
                      <v-card-text>
                        <p class="caption">
                          <v-icon small left>mdi-clock</v-icon>
                          Disponible desde 1:00 pm
                        </p>
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
                        <v-btn
                          aria-label="Reservar"
                          text
                          block
                          color="primary"
                          class="mx-1"
                          v-bind="item.props"
                        >
                          <v-icon left>mdi-view-split-vertical</v-icon>
                          Reservar
                        </v-btn>
                      </template>
                    </material-card>
                  </v-col>
                </v-row>
              </ais-hits>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="ais-PoweredBy">
            <a
              href="https://meilisearch.com/"
              target="_blank"
              rel="noopener"
              aria-label="search by Meilisearch"
              class="ais-PoweredBy-link"
            >
              <svg
                viewBox="0 0 70 24"
                class="ais-PoweredBy-logo ais-PoweredBy--light"
                style="height: 1.2em; width: auto"
              >
                <path
                  fill="#5D6494"
                  d="M6.97 6.68V8.3a4.47 4.47 0 0 0-2.42-.67 2.2 2.2 0 0 0-1.38.4c-.34.26-.5.6-.5 1.02 0 .43.16.77.49 1.03.33.25.83.53 1.51.83a7.04 7.04 0 0 1 1.9 1.08c.34.24.58.54.73.89.15.34.23.74.23 1.18 0 .95-.33 1.7-1 2.24a4 4 0 0 1-2.6.81 5.71 5.71 0 0 1-2.94-.68v-1.71c.84.63 1.81.94 2.92.94.58 0 1.05-.14 1.39-.4.34-.28.5-.65.5-1.13 0-.29-.1-.55-.3-.8a2.2 2.2 0 0 0-.65-.53 23.03 23.03 0 0 0-1.64-.78 13.67 13.67 0 0 1-1.11-.64c-.12-.1-.28-.22-.46-.4a1.72 1.72 0 0 1-.39-.5 4.46 4.46 0 0 1-.22-.6c-.07-.23-.1-.48-.1-.75 0-.91.33-1.63 1-2.17a4 4 0 0 1 2.57-.8c.97 0 1.8.18 2.47.52zm7.47 5.7v-.3a2.26 2.26 0 0 0-.5-1.44c-.3-.35-.74-.53-1.32-.53-.53 0-.99.2-1.37.58-.38.39-.62.95-.72 1.68h3.91zm1 2.79v1.4c-.6.34-1.38.51-2.36.51a4.02 4.02 0 0 1-3-1.13 4.04 4.04 0 0 1-1.11-2.97c0-1.3.34-2.32 1.02-3.06a3.38 3.38 0 0 1 2.6-1.1c1.03 0 1.85.32 2.46.96.6.64.9 1.57.9 2.78 0 .33-.03.68-.09 1.04h-5.31c.1.7.4 1.24.89 1.61.49.38 1.1.56 1.85.56.86 0 1.58-.2 2.15-.6zm6.61-1.78h-1.21c-.6 0-1.05.12-1.35.36-.3.23-.46.53-.46.89 0 .37.12.66.36.88.23.2.57.32 1.02.32.5 0 .9-.15 1.2-.43.3-.28.44-.65.44-1.1v-.92zm-4.07-2.55V9.33a4.96 4.96 0 0 1 2.5-.55c2.1 0 3.17 1.03 3.17 3.08V17H22.1v-.96c-.42.68-1.15 1.02-2.19 1.02-.76 0-1.38-.22-1.84-.66-.46-.44-.7-1-.7-1.68 0-.78.3-1.38.88-1.81.59-.43 1.4-.65 2.46-.65h1.34v-.46c0-.55-.13-.97-.4-1.25-.26-.29-.7-.43-1.32-.43-.86 0-1.65.24-2.35.72zm9.34-1.93v1.42c.39-1 1.1-1.5 2.12-1.5.15 0 .31.02.5.05v1.53c-.23-.1-.48-.14-.76-.14-.54 0-.99.24-1.34.71a2.8 2.8 0 0 0-.52 1.71V17h-1.57V8.91h1.57zm5 4.09a3 3 0 0 0 .76 2.01c.47.53 1.14.8 2 .8.64 0 1.24-.18 1.8-.53v1.4c-.53.32-1.2.48-2 .48a3.98 3.98 0 0 1-4.17-4.18c0-1.16.38-2.15 1.14-2.98a4 4 0 0 1 3.1-1.23c.7 0 1.34.15 1.92.44v1.44a3.24 3.24 0 0 0-1.77-.5A2.65 2.65 0 0 0 32.33 13zm7.92-7.28v4.58c.46-1 1.3-1.5 2.5-1.5.8 0 1.42.24 1.9.73.48.5.72 1.17.72 2.05V17H43.8v-5.1c0-.56-.14-.99-.43-1.29-.28-.3-.65-.45-1.1-.45-.54 0-1 .2-1.42.6-.4.4-.61 1.02-.61 1.85V17h-1.56V5.72h1.56zM55.2 15.74c.6 0 1.1-.25 1.5-.76.4-.5.6-1.16.6-1.95 0-.92-.2-1.62-.6-2.12-.4-.5-.92-.74-1.55-.74-.56 0-1.05.22-1.5.67-.44.45-.66 1.13-.66 2.06 0 .96.22 1.67.64 2.14.43.47.95.7 1.57.7zM53 5.72v4.42a2.74 2.74 0 0 1 2.43-1.34c1.03 0 1.86.38 2.51 1.15.65.76.97 1.78.97 3.05 0 1.13-.3 2.1-.92 2.9-.62.81-1.47 1.21-2.54 1.21s-1.9-.45-2.46-1.34V17h-1.58V5.72H53zm9.9 11.1l-3.22-7.9h1.74l1 2.62 1.26 3.42c.1-.32.48-1.46 1.15-3.42l.91-2.63h1.66l-2.92 7.87c-.78 2.07-1.96 3.1-3.56 3.1-.28 0-.53-.02-.73-.07v-1.34c.17.04.35.06.54.06 1.03 0 1.76-.57 2.17-1.7z"
                ></path>
              </svg>
              <svg
                viewBox="0 0 127 74"
                fill="none"
                class="ais-PoweredBy-logo ais-PoweredBy--light"
                xmlns="http://www.w3.org/2000/svg"
                style="height: 1.2em; width: auto"
              >
                <title>Meilisearch</title>
                <path
                  d="M.825 73.993l23.244-59.47A21.85 21.85 0 0144.42.625h14.014L35.19 60.096a21.85 21.85 0 01-20.352 13.897H.825z"
                  fill="url(#meilisearch_logo_svg__paint0_linear_0_6)"
                ></path>
                <path
                  d="M34.925 73.993l23.243-59.47A21.85 21.85 0 0178.52.626h14.013L69.29 60.096a21.85 21.85 0 01-20.351 13.897H34.925z"
                  fill="url(#meilisearch_logo_svg__paint1_linear_0_6)"
                ></path>
                <path
                  d="M69.026 73.993l23.244-59.47A21.85 21.85 0 01112.621.626h14.014l-23.244 59.47a21.851 21.851 0 01-20.352 13.897H69.026z"
                  fill="url(#meilisearch_logo_svg__paint2_linear_0_6)"
                ></path>
                <defs>
                  <linearGradient
                    id="meilisearch_logo_svg__paint0_linear_0_6"
                    x1="126.635"
                    y1="-4.978"
                    x2="0.825"
                    y2="66.098"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FF5CAA"></stop>
                    <stop offset="1" stop-color="#FF4E62"></stop>
                  </linearGradient>
                  <linearGradient
                    id="meilisearch_logo_svg__paint1_linear_0_6"
                    x1="126.635"
                    y1="-4.978"
                    x2="0.825"
                    y2="66.098"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FF5CAA"></stop>
                    <stop offset="1" stop-color="#FF4E62"></stop>
                  </linearGradient>
                  <linearGradient
                    id="meilisearch_logo_svg__paint2_linear_0_6"
                    x1="126.635"
                    y1="-4.978"
                    x2="0.825"
                    y2="66.098"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FF5CAA"></stop>
                    <stop offset="1" stop-color="#FF4E62"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </div>
          <v-spacer />
          <div class="v-data-footer">
            <ais-hits-per-page :items="itemsPerPageArray">
              <template v-slot="{ items, refine }">
                <div class="v-data-footer__select">
                  {{ $t("$vuetify.dataFooter.itemsPerPageText") }}
                  <v-select
                    v-model.number="itemsPerPage"
                    :items="items"
                    item-text="label"
                    item-value="value"
                    hide-details
                    @change="refine"
                  />
                </div>
              </template>
            </ais-hits-per-page>
            <ais-pagination>
              <template
                v-slot="{
                  currentRefinement,
                  isFirstPage,
                  isLastPage,
                  refine,
                }"
              >
                <nav
                  role="navigation"
                  :aria-label="$t('$vuetify.pagination.ariaLabel.wrapper')"
                >
                  <ul
                    class="v-pagination v-pagination--circle"
                    :class="theme.isDark ? 'theme--dark' : 'theme--light'"
                  >
                    <li>
                      <button
                        type="button"
                        :disabled="isFirstPage"
                        :aria-label="
                          $t('$vuetify.dataFooter.ariaLabel.previous')
                        "
                        class="v-pagination__navigation"
                        :class="
                          isFirstPage
                            ? 'v-pagination__navigation--disabled'
                            : ''
                        "
                        :data-page="currentRefinement - 1"
                        @click.prevent="refine(currentRefinement - 1)"
                      >
                        <v-icon>mdi-chevron-left</v-icon>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        :disabled="isLastPage"
                        :aria-label="$t('$vuetify.pagination.ariaLabel.next')"
                        class="v-pagination__navigation"
                        :class="
                          isLastPage ? 'v-pagination__navigation--disabled' : ''
                        "
                        :data-page="currentRefinement + 1"
                        @click.prevent="refine(currentRefinement + 1)"
                      >
                        <v-icon>mdi-chevron-right</v-icon>
                      </button>
                    </li>
                  </ul>
                </nav>
              </template>
            </ais-pagination>
          </div>
        </v-card-actions>
      </v-card>
    </ais-instant-search>
  </div>
</template>

<script>
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { IN_BROWSER } from "@/util/globals";
import MaterialCard from "@/components/global/MaterialCard";

export default {
  name: "SearchBook",
  components: { MaterialCard },
  inject: ["theme"],
  props: {
    index: {
      type: String,
      required: true,
    },
    filter: {
      type: String,
      required: true,
    },
    bg: {
      type: String,
      default: require("@/assets/img/landing/profile.jpg"),
    },
  },
  data: () => ({
    page: 0,
    itemsPerPage: 12,
    itemsPerPageArray: [
      { label: "2", value: 2 },
      { label: "12", value: 12, default: true },
      { label: "24", value: 24 },
      { label: "36", value: 36 },
      { label: "48", value: 48 },
      { label: "60", value: 60 },
      { label: "72", value: 72 },
      { label: "84", value: 84 },
      { label: "96", value: 96 },
      { label: "108", value: 108 },
    ],
    searchString: "",
    searchClient: instantMeiliSearch(
      process.env.VUE_APP_MEILISEARCH_HOST,
      process.env.VUE_APP_MEILISEARCH_KEY
    ),
  }),
  computed: {
    placeholder() {
      let placeholder = this.$t("search.placeholder");
      if (!this.$vuetify.breakpoint.mobile) {
        placeholder += " " + this.$t("search.key-hint");
      }
      return placeholder;
    },
  },
  created() {
    // this.searchClient = this.getSearchClient();
  },
  mounted() {
    if (!IN_BROWSER) return;
    document.addEventListener("keydown", this.onDocumentKeydown);
  },
  methods: {
    searchFunction(helper) {
      this.page = helper.getPage();
      helper.search();
    },
    getSearchClient() {
      const searchClient = instantMeiliSearch(
        process.env.VUE_APP_MEILISEARCH_HOST,
        process.env.VUE_APP_MEILISEARCH_KEY
      );
      return {
        ...searchClient,
        async search(...args) {
          try {
            console.log(searchClient);
            console.log(...args);
            return await searchClient.search(...args);
          } catch (error) {
            console.error(error);
            this.$snackbar.error(error);
          }
        },
      };
    },
    onDocumentKeydown(e) {
      if (e.key === "/" && e.target !== this.$refs.searchInput.$refs.input) {
        e.preventDefault();
        this.$refs.searchInput.focus();
      }
    },
  },
  beforeDestroy() {
    if (!IN_BROWSER) return;
    document.removeEventListener("keydown", this.onDocumentKeydown);
  },
};
</script>

<style lang="sass" scoped>
.ais-InstantSearch
  flex: 1
  min-height: 0
  overflow-y: auto
.ais-PoweredBy
  display: flex
  justify-content: flex-end
  padding: 8px 8px 0
</style>
