<template>
  <v-list dense nav three-line subheader>
    <v-subheader
      class="text--primary font-weight-black text-uppercase"
      v-text="name[index]"
    />
    <div v-if="!!groups[0] && groups[0].color" class="d-flex flex-column mx-3">
      <p class="caption">
        <v-icon
          left
          small
          class="lighten-1 success white--text"
          v-text="'mdi-pine-tree'"
        />
        {{ $tc("label.has_office", 0) }}
      </p>
      <p class="caption">
        <v-icon
          left
          small
          class="lighten-1 grey white--text"
          v-text="'mdi-pine-tree'"
        />
        {{ $tc("label.has_office", 1) }}
      </p>
    </div>
    <template v-if="groups.length > 0">
      <template v-for="(child, ci) in groups">
        <v-divider
          :key="`divider-${ci}`"
          v-if="ci !== 0"
          class="mb-2 mt-2 ml-2 mr-n2"
        />
        <search-result-item-emitter
          v-if="map"
          :key="`btn-${ci}`"
          :i18n-path="config[index].i18nPath"
          :item="child"
          :title-keys="config[index].titleKeys"
          :content-keys="config[index].contentKeys"
          ripple
          @click="$emit('select:item', child)"
        />
        <search-result-item
          v-else
          :key="`btn-${ci}`"
          :i18n-path="config[index].i18nPath"
          :item="child"
          :title-keys="config[index].titleKeys"
          :content-keys="config[index].contentKeys"
          :to="config[index].to(child)"
        />
      </template>
    </template>
    <template v-else>
      <v-empty-state
        class="my-2"
        rounded
        icon="mdi-alphabetical-off"
        :label="$t('emptyState.noResultsLabel')"
        :description="$t('emptyState.noResultsDescription', { query })"
      />
    </template>
  </v-list>
</template>

<script>
import slugify from "@/util/slugify";
import SearchResultItem from "@/components/app/SearchResultItem";
import VEmptyState from "@/components/global/EmptyState";
export default {
  name: "AppSearchResults",
  components: {
    VEmptyState,
    SearchResultItem,
    SearchResultItemEmitter: SearchResultItem,
  },
  props: ["query", "index", "groups", "recreation", "map"],
  data: (vm) => ({
    config: {
      parks_index: {
        i18nPath: "park",
        titleKeys: ["code", "name"],
        contentKeys: ["address", "locality", "upz_code", "upz", "scale"],
        to: (item) => ({
          name: vm.recreation ? "Activities" : "Park",
          params: {
            id: item.code || item.id,
          },
        }),
      },
      endowment_index: {
        i18nPath: "endowment",
        titleKeys: ["endowment", "equipment"],
        contentKeys: [
          "material",
          "floor_material",
          "equipment",
          "park_code",
          "park_name",
          "locality",
          "park_address",
          "upz_code",
          "upz",
          "scale",
        ],
        to: (item) => ({
          name: "ParkEndowment",
          params: {
            id: item.park_code || item.park_id,
            endowmentId: item.id,
          },
        }),
      },
      booking_index: {
        i18nPath: "endowment",
        titleKeys: ["endowment_description"],
        contentKeys: [
          "park_name",
          "park_address",
          "park_code",
          "locality",
          "upz_code",
          "upz",
        ],
        to: (item) => ({
          name: "ParkEndowment",
          params: {
            id: item.park_code || item.park_id,
            endowmentId: item.park_endowment_id,
          },
        }),
      },
      schedules_index: {
        i18nPath: "portal.forms.templates",
        titleKeys: ["program_name", "activity_name"],
        contentKeys: [
          "stage_name",
          "park_code",
          "park_name",
          "park_address",
          "weekday_name",
          "daily_name",
        ],
        to: (item) => ({
          name: "ActivityDetails",
          params: {
            id: item.id,
            slug: slugify((item.activity_name || "").toLocaleLowerCase()),
          },
        }),
      },
    },
  }),
  computed: {
    name() {
      return {
        parks_index: this.$t("search.parks_index"),
        endowment_index: this.$t("search.endowment_index"),
        booking_index: this.$t("search.booking_index"),
        schedules_index: this.$t("search.schedules_index"),
      };
    },
  },
};
</script>

<style lang="sass" scoped>
.v-list-item
  min-height: 0
::v-deep mark
  background: rgb(33, 150, 243, 30%)
  color: inherit
</style>
