<template>
  <v-skeleton-loader
    :loading="loading"
    type="list-item-avatar-three-line@6"
    width="100%"
  >
    <v-row class="ma-0 pa-0" dense>
      <v-col v-if="!!park.alert" cols="12" md="12" sm="12" class="ma-0 pa-0">
        <v-alert border="left" colored-border type="error">
          {{ park.alert }}
        </v-alert>
      </v-col>
      <v-col
        class="ma-0 pa-0"
        v-for="(key, i) in keys"
        :key="i"
        cols="12"
        :md="columns(key)"
        sm="12"
      >
        <v-list class="ma-0 pa-0" two-line>
          <v-list-item
            class="ma-0 pa-0"
            :href="files(key)"
            :target="!!files(key) ? '_blank' : undefined"
          >
            <v-list-item-avatar>
              <v-icon v-text="`mdi-${icons[key]}`"></v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="park[key]"></v-list-item-title>
              <v-list-item-subtitle
                class="font-weight-bold"
                v-text="$t(`park.${key}`)"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="!!files(key)">
              <v-list-item-action-text>{{
                $t("label.download")
              }}</v-list-item-action-text>
              <v-icon color="primary">mdi-cloud-download</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="ma-0 pa-0" cols="12" md="6" sm="12">
        <v-list class="ma-0 pa-0" two-line>
          <v-list-item
            class="ma-0 pa-0"
            :to="{ name: 'Social', params: { id: $route.params.id } }"
          >
            <v-list-item-avatar>
              <v-icon v-text="`mdi-pine-tree`"></v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title></v-list-item-title>
              <v-list-item-subtitle
                class="font-weight-bold"
                v-text="`${$t('buttons.view')} ${$t('menu.social')}`"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="ma-0 pa-0" cols="12" md="6" sm="12">
        <v-list class="ma-0 pa-0" two-line>
          <v-list-item
            class="ma-0 pa-0"
            :to="{ name: 'Activities', params: { id: $route.params.id } }"
          >
            <v-list-item-avatar>
              <v-icon v-text="`mdi-soccer`"></v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title></v-list-item-title>
              <v-list-item-subtitle
                class="font-weight-bold"
                v-text="`${$t('buttons.view')} ${$t('menu.activities')}`"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-skeleton-loader>
</template>

<script>
export default {
  inject: ["theme"],
  name: "ParkData",
  props: {
    park: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
    },
  },
  data: () => ({
    icons: {
      code: "pound",
      name: "pine-tree",
      address: "city",
      stratum: "layers",
      locality: "map-marker",
      upz: "crosshairs-gps",
      block: "home-city",
      scale: "relative-scale",
      regulation: "image-filter-hdr",
      concept: "file",
      phone: "phone",
      pqrs: "at",
      email: "email",
      schedule_service: "calendar",
      schedule_admin: "calendar",
      social_management: "account-multiple",
      recreation_activities: "human-male-child",
      general_info: "text",
      sports_equipment: "soccer",
      recreational_equipment: "inbox-full",
      additional_services: "format-list-text",
      // general_conditions: "information-outline",
      // loan_application: "soccer-field",
    },
  }),
  methods: {
    columns: function (key) {
      const keys = [
        "schedule_service",
        "schedule_admin",
        "general_info",
        "sports_equipment",
        "recreational_equipment",
        "additional_services",
        // "general_conditions",
        // "loan_application",
        "social_management",
        "recreation_activities",
      ];
      return keys.indexOf(key) === -1 ? 6 : 12;
    },
    files: function (key) {
      if (key === "concept") {
        return this.park["file"] ? this.park["file"] : undefined;
      }
      if (key === "regulation") {
        return this.park["regulation_file"]
          ? this.park["regulation_file"]
          : undefined;
      }
      return undefined;
    },
  },
  computed: {
    keys: function () {
      return Object.keys(this.icons).filter((key) => !!this.park[key]);
    },
  },
};
</script>

<style scoped></style>
