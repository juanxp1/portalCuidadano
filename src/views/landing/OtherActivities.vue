<template>
  <details-page custom-card :title="$t('menu.activities')">
    <material-card
      icon-avatar="mdi-pine-tree"
      class="main main-raised elevation-24 mb-12"
    >
      <app-breadcrumbs />
      <v-card-text>
        <v-row dense>
          <v-col col="12" sm="12" md="12">
            <p>
              Digita el nombre de un parque para buscar las próximas actividades
              a realizar:
            </p>
            <app-search recreation :indexes="['parks_index']" />
          </v-col>
          <v-col
            v-if="$vuetify.breakpoint.smAndDown"
            cols="12"
            class="text-center"
          >
            <v-btn
              :aria-label="$t('input.search')"
              :loading="finding"
              :disabled="finding || !code"
              :to="{ name: 'Activities', params: { id: code } }"
              small
              color="primary"
            >
              <v-icon left>mdi-magnify</v-icon>
              {{ $t("input.search") }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="12">
            <h3 class="font-weight-bold display-serif-1">
              {{ `Actividades virtuales o en otros escenarios` }}
            </h3>
            <h6 class="text-serif-h6">
              {{ `Desde ${params.start_date} hasta ${params.final_date}` }}
            </h6>
          </v-col>
          <v-col
            v-if="activities.length > 0"
            v-for="item in activities"
            :key="item.id"
            cols="12"
            sm="12"
            md="4"
          >
            <v-list three-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon
                    :class="item.color"
                    class="lighten-1 white--text"
                    v-text="'mdi-pine-tree'"
                  ></v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    :style="stylesList"
                    class="font-weight-bold"
                    v-text="(item.name || '').toUpperCase()"
                  />
                  <v-list-item-subtitle :style="stylesList" class="caption">
                    <v-row dense>
                      <v-col class="ma-0" cols="12">
                        <i18n
                          ta="span"
                          path="recreation.program"
                          class="font-weight-bold"
                        />: {{ item.program }}
                      </v-col>
                      <v-col class="ma-0" cols="12">
                        <i18n
                          ta="span"
                          path="recreation.date"
                          class="font-weight-bold"
                        />: {{ `${item.start} - ${item.end}` }}
                      </v-col>
                      <v-col class="ma-0" cols="12">
                        <i18n
                          ta="span"
                          path="recreation.activity"
                          class="font-weight-bold"
                        />: {{ item.activity }}
                      </v-col>
                      <v-col class="ma-0" cols="12">
                        <i18n
                          ta="span"
                          path="recreation.meeting"
                          class="font-weight-bold"
                        />: {{ item.meeting_point }}
                      </v-col>
                      <v-col class="ma-0" cols="12">
                        <i18n
                          ta="span"
                          path="recreation.quantity"
                          class="font-weight-bold"
                        />: {{ item.quantity }}
                      </v-col>
                      <v-col class="ma-0" cols="12">
                        <i18n
                          ta="span"
                          path="recreation.responsable"
                          class="font-weight-bold"
                        />: {{ item.responsable }}
                      </v-col>
                    </v-row>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col v-else cols="12">
            <v-empty-state
              :label="$t('label.no_data')"
              description="Prueba la búsqueda por parques."
              icon="mdi-clipboard-text-off-outline"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </material-card>
  </details-page>
</template>

<script>
import { Calendar } from "@/models/services/Calendar";
export default {
  name: "RecreationActivities",
  mounted() {
    this.onLoad();
  },
  data: (vm) => ({
    loading: false,
    finding: false,
    recreation: new Calendar(),
    activities: [],
    params: {
      start_date: vm.$moment().format("YYYY-MM-DD"),
      final_date: vm.$moment().add(5, "days").format("YYYY-MM-DD"),
    },
  }),
  methods: {
    onLoad() {
      this.loading = true;
      const { params } = this;
      this.recreation
        .others({ params })
        .then((response) => {
          this.activities = this.$lodash(response.data)
            .orderBy("end", "asc")
            .value();
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => (this.loading = false));
    },
  },
  computed: {
    stylesList: function () {
      return {
        whiteSpace: "break-spaces",
        fontSize: "0.875rem",
      };
    },
  },
};
</script>

<style scoped></style>
