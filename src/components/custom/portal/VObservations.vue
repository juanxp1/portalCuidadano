<template>
  <v-data-iterator
    :options.sync="pagination"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="total"
    :items="items"
    item-key="id"
    :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
    :loading="loading"
  >
    <template #header>
      <app-card-toolbar
        :title="toolbarTitle || title"
        :loading="loading"
        :requested-at="requested_at"
        :items="actions"
        menu-id="observations-menu"
      />
    </template>
    <template #default="{ items }">
      <v-row dense>
        <v-col v-for="item in items" :key="item.id" cols="12">
          <v-card>
            <v-card-text>
              <v-list min-width="100%" three-line>
                <v-list-item class="grow">
                  <v-list-item-avatar>
                    <v-avatar rounded class="elevation-1">
                      <div class="mt-1" v-html="icon(item.user || 'PORTAL')" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.user || 'PORTAL'" />
                    <v-list-item-subtitle>
                      <v-icon small left>mdi-message-text</v-icon>
                      <app-time-ago :date-time="item.created_at" />
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      style="-webkit-line-clamp: none"
                      v-text="item.observation"
                    />
                  </v-list-item-content>
                  <v-list-item-action>
                    <app-btn
                      :color="!!item.read_at ? '' : 'success'"
                      :disabled="!!item.read_at || loadingBtn"
                      :loading="loadingBtn"
                      fab
                      x-small
                      icon-text="mdi-check"
                      path="buttons.MarkAsRead"
                      @click="markAsRead(item)"
                    />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template #no-data>
      <v-empty-state
        icon="mdi-message-text"
        :label="$t('portal.forms.states.Observations')"
      >
        <v-card flat color="transparent">
          <v-card-text>
            <app-btn path="buttons.Help" color="primary" @click="onTour" />
          </v-card-text>
        </v-card>
      </v-empty-state>
    </template>
    <template #loading>
      <v-skeleton-loader type="list-item-avatar-two-line@5" />
    </template>
  </v-data-iterator>
</template>

<script>
import { toSvg } from "jdenticon";
import { Observation } from "@/models/services/portal/Observation";

export default {
  name: "VObservations",
  props: {
    profileId: {
      type: [Number, String],
    },
    toolbarTitle: String,
  },
  watch: {
    profileId(val) {
      this.form = new Observation(val);
      this.getObservations();
    },
    "pagination.page"() {
      return this.form && this.getObservations();
    },
    itemsPerPage() {
      return this.form && this.getObservations();
    },
  },
  data: (vm) => ({
    title: null,
    requested_at: null,
    loading: false,
    loadingBtn: false,
    form: new Observation(vm.profileId),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 30, 30, 50, 100],
    history: [],
  }),
  methods: {
    getObservations(loading = true) {
      this.loading = loading;
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      };
      this.form
        .index({ params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
          this.requested_at = response.requested_at;
          this.title = response.details.title;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    markAsRead(item) {
      this.loadingBtn = true;
      this.form
        .show(item.id)
        .then((response) => {
          this.$snackbar.success(response.data);
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loadingBtn = false;
          this.getObservations(false);
        });
    },
    marlAllAsRead() {
      this.loadingBtn = true;
      this.form
        .store()
        .then((response) => {
          this.$snackbar.success(response.data);
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loadingBtn = false;
          this.getObservations(false);
        });
    },
    icon(item) {
      return toSvg(item.user, 40);
    },
    onTour() {
      const tour = this.$shepherd({
        useModalOverlay: true,
      });
      tour.addStep({
        attachTo: { element: "#observations-menu", on: "top" },
        defaultStepOptions: {
          scrollTo: {
            behavior: "smooth",
            block: "center",
          },
          cancelIcon: {
            enabled: true,
          },
        },
        canClickTarget: false,
        title: "Menú de opciones",
        text: `<p>Al dar clic sobre el botón aparecerá una lista de opciones que permitirán realizar acciones dentro del sistema.</p>
            <ul style="margin-left: 20px; margin-top: 5px;">
              <li>Marcar todas las observaciones como leídas.</li>
              <li>Actualizar el listado de observaciones.</li>
            </ul>
          `,
        buttons: [
          {
            action() {
              return this.next();
            },
            text: "Entendido",
          },
        ],
      });
      tour.start();
    },
  },
  computed: {
    actions() {
      return [
        {
          icon: "mdi-check",
          text: "buttons.MarkAllAsRead",
          action: this.marlAllAsRead,
        },
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.getObservations,
        },
      ];
    },
  },
};
</script>
