<template>
  <v-menu
    bottom
    left
    offset-y
    origin="top right"
    transition="scale-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ attrs, on }">
      <v-btn
        :aria-label="$t('notifications.Notifications')"
        class="ml-2"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-badge color="red" overlap bordered :value="unreadNotification > 0">
          <template #badge>
            <div>{{ badge }}</div>
          </template>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card
      class="mx-auto"
      max-width="350"
      :min-width="$vuetify.breakpoint.mdAndUp ? '350' : undefined"
    >
      <v-img
        aspect-ratio="16/9"
        :alt="$t('notifications.Notifications')"
        :src="img"
        :lazy-src="img"
        class="d-flex align-center px-8"
        max-height="110"
      >
        <v-card-title>
          <v-icon dark left>mdi-bell-plus</v-icon>
          <i18n
            tag="h4"
            class="white--text m-0 flex-grow-1 mr-3"
            path="notifications.Notifications"
          />
          <v-spacer />
          <app-btn
            :tooltip-attrs="{ bottom: true }"
            path="buttons.MarkAsRead"
            icon
            small
            dark
            icon-text="mdi-check-all"
            :loading="deleting"
            :disabled="deleting"
            @click="markAllAsRead"
          />
          <app-btn
            :tooltip-attrs="{ bottom: true }"
            path="buttons.Refresh"
            icon
            small
            dark
            icon-text="mdi-refresh"
            :loading="deleting"
            :disabled="deleting"
            @click="getNotifications(true)"
          />
        </v-card-title>
      </v-img>
      <v-card-text />
      <v-virtual-scroll
        v-if="notifications.length > 0"
        :items="notifications"
        :item-height="100"
        height="300"
      >
        <template #default="{ item }">
          <app-bar-item>
            <v-list-item-icon class="hidden-sm-and-down">
              <v-icon :color="!item.read_at ? 'success' : ''">
                mdi-bell
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="onReadNotification(item)">
              <v-list-item-title>
                {{ item.data.title }} -
                <app-time-ago :date-time="item.data.created_at" />
              </v-list-item-title>
              <v-list-item-subtitle
                class="caption"
                style="white-space: break-spaces"
                v-text="
                  (item.data.subject || '').trim().length > 80
                    ? (item.data.subject || '')
                        .trim()
                        .substring(0, 80)
                        .concat('...')
                    : item.data.subject
                "
              >
              </v-list-item-subtitle>
              <v-list-item-subtitle class="caption" v-text="item.data.user" />
            </v-list-item-content>
            <v-list-item-action>
              <app-btn
                path="buttons.Delete"
                icon
                small
                color="error"
                :loading="deleting || reading"
                :disabled="deleting || reading"
                @click="onDelete(item)"
                icon-text="mdi-close"
              />
            </v-list-item-action>
          </app-bar-item>
        </template>
      </v-virtual-scroll>
      <v-card-text v-else>
        <v-empty-state
          icon="mdi-bell-off"
          :size="200"
          :description="$t('notifications.EmptyNotifications')"
        >
        </v-empty-state>
      </v-card-text>
      <v-card-actions>
        <app-btn
          path="notifications.ViewAllNotifications"
          block
          text
          small
          :to="{ name: 'Notifications' }"
        />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { remove, has } from "lodash";
import { VHover, VListItem } from "vuetify/lib";
import { Notification } from "@/models/services/portal/Notification";
export default {
  name: "AppNotifications",
  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    "white--text primary elevation-12": hover,
                  },
                  props: {
                    activeClass: "",
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              );
            },
          },
        });
      },
    },
  },
  data: () => ({
    img: require("@/assets/img/dashboard/menus/notificatios.jpg"),
    deleting: false,
    reading: false,
    form: new Notification(),
    notifications: [],
    interval: null,
    unreadNotification: 0,
  }),
  methods: {
    getNotifications(deleting = true) {
      this.deleting = deleting;
      this.reading = true;
      this.form
        .index()
        .then((response) => {
          if (has(response, "data.data")) {
            this.notifications = response.data.data || [];
            this.unreadNotification = response.details.unread || 0;
          }
          this.deleting = false;
          this.reading = false;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    onReadNotification(item) {
      this.form
        .show(item.id)
        .then(() => {
          this.getNotifications(false);
        })
        .finally(() => {
          if (item.data.url.name !== this.$route.name) {
            this.$router.push(item.data.url);
          }
        });
    },
    markAllAsRead() {
      this.form.store().finally(() => {
        this.getNotifications(true);
      });
    },
    onDelete(item) {
      this.form
        .destroy(item.id)
        .then(() => {
          this.notifications = remove(
            this.notifications,
            (object) => object.id !== item.id
          );
        })
        .finally(() => {
          this.getNotifications(false);
        });
    },
  },
  computed: {
    badge() {
      return this.unreadNotification > 98 ? "99+" : this.unreadNotification;
    },
  },
  created() {
    this.getNotifications();
  },
  mounted() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const that = this;
    this.interval = setInterval(that.getNotifications.bind(that), 60000 * 2);
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
</script>
