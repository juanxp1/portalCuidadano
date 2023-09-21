<template>
  <v-menu
    v-model="menuModel"
    max-height="75vh"
    offset-y
    readonly
    @input="resetSearch"
  >
    <template #activator="{ attrs }">
      <v-row dense align="center" align-content="center" justify="center">
        <v-col cols="12">
          <v-text-field
            ref="searchInput"
            v-model="searchString"
            v-bind="attrs"
            :background-color="
              !theme.isDark && !isFocused
                ? 'grey lighten-4'
                : theme.isDark
                ? 'grey darken-3'
                : undefined
            "
            :class="isSearching ? 'rounded-b-0' : ' rounded-lg'"
            :flat="!isFocused && !isSearching"
            :placeholder="placeholder"
            autocomplete="off"
            class="mx-2 mx-md-4"
            dense
            name="search_term_string"
            hide-details
            solo
            @focus="onFocus"
          >
            <template #prepend-inner>
              <v-icon
                :color="!isFocused ? 'grey' : undefined"
                class="ml-1 mr-2"
              >
                mdi-magnify
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col
          v-show="indexes.length > 1"
          cols="12"
          md="9"
          sm="12"
          class="mx-auto"
        >
          <v-radio-group v-model="index" class="mt-4" row dense hide-details>
            <v-radio
              v-for="(text, i) in indexes"
              class="caption"
              :label="names[text]"
              :value="text"
              :key="i"
            />
          </v-radio-group>
        </v-col>
      </v-row>
    </template>
    <v-card flat>
      <ais-instant-search
        :index-name="index"
        :search-client="searchClient"
        :search-function="searchFunction"
      >
        <ais-configure
          :hitsPerPage="10"
          :query="searchString"
          :filters="filters"
        />
        <ais-hits v-slot="{ items }">
          <app-search-results
            :map="map"
            :recreation="recreation"
            :query="searchString"
            :index="index"
            :groups="items"
            @select:item="onSelect"
          />
        </ais-hits>
      </ais-instant-search>
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
    </v-card>
  </v-menu>
</template>

<script>
// Utilities
import { get } from "vuex-pathify";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

// Globals
import { IN_BROWSER } from "@/util/globals";
import AppSearchResults from "@/components/app/SearchResults";
export default {
  name: "AppSearch",
  components: { AppSearchResults },
  props: {
    map: {
      type: Boolean,
      default: false,
    },
    recreation: {
      type: Boolean,
      default: false,
    },
    parkId: {
      type: [String, Number],
      default: undefined,
    },
    indexes: {
      type: Array,
      default: () => [
        "parks_index",
        "endowment_index",
        "booking_index",
        "schedules_index",
      ],
    },
    replacePlaceholder: {
      type: String,
      default: undefined,
    },
  },
  inject: ["theme"],
  data: (vm) => ({
    index: vm.indexes[0],
    names: {
      parks_index: "Parques",
      endowment_index: "Equipamientos",
      booking_index: "Canchas y Asadores",
      schedules_index: "Actividades",
    },
    isFocused: false,
    menuModel: false,
    searchClient: instantMeiliSearch(
      process.env.VUE_APP_MEILISEARCH_HOST,
      process.env.VUE_APP_MEILISEARCH_KEY
    ),
    searchString: "",
    timeout: null,
  }),
  computed: {
    locale: get("route/params@locale"),
    search: get("route/query@search"),
    isSearching() {
      return this.searchString && this.searchString.length > 0;
    },
    placeholder() {
      let placeholder = this.$t("search.placeholder");
      if (!this.$vuetify.breakpoint.mobile) {
        placeholder += " " + this.$t("search.key-hint");
      }
      return this.replacePlaceholder ? this.replacePlaceholder : placeholder;
    },
    filters() {
      let filter =
        this.index === "schedules_index"
          ? `final_date >= ${this.$moment()
              .startOf("day")
              .unix()} AND quota > 0 AND is_initiate = true AND is_activated = true`
          : "";
      if (this.parkId) {
        filter += filter.length > 0 ? " AND " : "";
        if (this.parkId.toString().includes("-")) {
          filter += `park_code = "${this.parkId}"`;
        } else {
          filter += `park_id = ${this.parkId}`;
        }
      }
      return filter.trim();
    },
  },
  methods: {
    onSelect(item) {
      this.$emit("input", item);
    },
    async onFocus() {
      clearTimeout(this.timeout);
      this.isFocused = true;
    },
    resetSearch() {
      clearTimeout(this.timeout);
      this.$nextTick(() => {
        this.searchString = "";
        this.timeout = setTimeout(() => (this.isFocused = false));
        this.menuModel = false;
      });
    },
    onDocumentKeydown(e) {
      if (e.key === "/" && e.target !== this.$refs.searchInput.$refs.input) {
        e.preventDefault();
        this.$refs.searchInput.focus();
      }
    },
    searchFunction(helper) {
      helper.state.query && helper.search();
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
            return await searchClient.search(...args);
          } catch (error) {
            console.log(error);
            // this.$snackbar.error(error);
          }
        },
      };
    },
  },
  watch: {
    isSearching(val) {
      val ? (this.menuModel = true) : this.resetSearch();
    },
  },
  created() {
    this.searchClient = this.getSearchClient();
  },
  mounted() {
    if (!IN_BROWSER) return;
    if (this.search) {
      this.$nextTick(() => {
        this.searchString = this.search;
        this.$refs.searchInput.focus();
      });
    }
    document.addEventListener("keydown", this.onDocumentKeydown);
  },
  beforeDestroy() {
    if (IN_BROWSER) return;
    document.removeEventListener("keydown", this.onDocumentKeydown);
  },
};
</script>

<style lang="sass" scoped>
.v-menu__content
  width: 0
  &, & > *
    display: flex
    flex-direction: column
    overflow: hidden
.ais-InstantSearch
  flex: 1
  min-height: 0
  overflow-y: auto
.ais-PoweredBy
  display: flex
  justify-content: flex-end
  padding: 8px 8px 0
</style>
