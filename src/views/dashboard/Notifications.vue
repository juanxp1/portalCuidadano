<template>
  <dashboard-card-view
    card-title-i18n="router.notifications"
    card-icon="mdi-bell-plus"
    :loading="loading || reading"
    :card-toolbar-actions="actions"
    :requested-at="requested_at"
  >
    <v-card-text>
      <v-data-iterator
        :loading="loading"
        :items="items"
        :options.sync="pagination"
        :items-per-page.sync="itemsPerPage"
        :server-items-length="total"
        item-key="name"
      >
        <template v-slot:default="{ items }">
          <v-list>
            <v-list-item v-for="item in items" :key="item.id">
              <v-list-item-icon>
                <v-icon :color="item.read_at ? '' : 'success'">
                  mdi-bell
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content @click="onClickNotification(item)">
                <v-list-item-title v-text="item.data.title" />
                <v-list-item-subtitle
                  class="caption"
                  v-text="item.data.subject"
                />
                <v-list-item-subtitle class="caption" v-text="item.data.user" />
                <v-list-item-subtitle class="caption">
                  <app-time-ago
                    :loading="loading || reading"
                    classes="caption"
                    :date-time="item.data.created_at"
                    icon="mdi-calendar"
                  />
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :aria-label="$t('buttons.MarkAsRead')"
                      icon
                      small
                      :loading="loading || reading"
                      :disabled="loading || reading || !!item.read_at"
                      color="success"
                      v-bind="attrs"
                      v-on="on"
                      @click="markAsRead(item)"
                    >
                      <v-icon small>mdi-check-all</v-icon>
                    </v-btn>
                  </template>
                  <i18n path="buttons.MarkAsRead" tag="span" />
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-action>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :aria-label="$t('buttons.Delete')"
                      icon
                      small
                      :loading="loading || reading"
                      :disabled="loading || reading"
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="onDelete(item)"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("buttons.Delete") }}</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </template>
        <template #no-data>
          <v-empty-state
            v-if="items.length === 0"
            icon="mdi-bell-off"
            :rounded="$vuetify.breakpoint.mdAndUp"
            :description="$t('notifications.EmptyNotifications')"
          >
            <v-btn
              :aria-label="$t('buttons.Refresh')"
              color="primary"
              @click="onLoadNotifications(true)"
            >
              <v-icon left>mdi-refresh</v-icon>
              <i18n path="buttons.Refresh" />
            </v-btn>
          </v-empty-state>
        </template>
        <template #no-results>
          <v-empty-state
            v-if="items.length === 0"
            icon="mdi-bell-off"
            :rounded="$vuetify.breakpoint.mdAndUp"
            :description="$t('notifications.EmptyNotifications')"
          >
            <v-btn
              :aria-label="$t('buttons.Refresh')"
              color="primary"
              @click="onLoadNotifications(true)"
            >
              <v-icon left>mdi-refresh</v-icon>
              <i18n path="buttons.Refresh" />
            </v-btn>
          </v-empty-state>
        </template>
      </v-data-iterator>
    </v-card-text>
    <v-check-dialog
      width="600"
      ref="helpDialog"
      title="buttons.Help"
      toolbar-color="primary"
      :show-btn="false"
      use-i18n
    >
      <help-accordion />
    </v-check-dialog>
  </dashboard-card-view>
</template>

<script>
import { has } from "lodash";
import { Notification } from "@/models/services/portal/Notification";
export default {
  name: "NotificationsView",
  data: () => ({
    reading: false,
    loading: false,
    requested_at: null,
    form: new Notification(),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  }),
  watch: {
    "pagination.page"() {
      return this.onLoadNotifications();
    },
    itemsPerPage() {
      return this.onLoadNotifications();
    },
  },
  methods: {
    onHelp() {
      this.$refs.helpDialog.open();
    },
    onLoadNotifications(loading = true) {
      this.loading = loading;
      this.reading = true;
      const params = {
        page: this.pagination.page,
        per_page: this.itemsPerPage,
      };
      this.form.index({ params }).then((response) => {
        if (has(response, "data.data")) {
          this.items = response.data.data;
          this.total = response.data.total;
        }
        this.loading = false;
        this.reading = false;
      });
    },
    onClickNotification(item) {
      this.form
        .show(item.id)
        .then(() => {
          this.onLoadNotifications(false);
        })
        .finally(() => {
          if (item.data.url.name !== this.$route.name) {
            this.$router.push(item.data.url);
          }
        });
    },
    markAllAsRead() {
      this.form.store().finally(() => {
        this.onLoadNotifications();
      });
    },
    markAsRead(item) {
      this.form.show(item.id).finally(() => {
        this.onLoadNotifications(false);
      });
    },
    onDelete(item) {
      this.form.destroy(item.id).finally(() => {
        this.onLoadNotifications(false);
      });
    },
  },
  computed: {
    actions() {
      const that = this;
      return [
        {
          icon: "mdi-check",
          text: "buttons.MarkAllAsRead",
          action: this.markAllAsRead,
        },
        {
          icon: "mdi-help-circle",
          text: "buttons.Help",
          action: this.onHelp,
        },
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: () => {
            that.onLoadNotifications(true);
          },
        },
      ];
    },
  },
};
</script>

<style scoped></style>
