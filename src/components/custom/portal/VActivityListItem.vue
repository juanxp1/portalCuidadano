<template>
  <v-list-item v-bind="$attrs" ripple :to="url" :title="item.activity_name">
    <v-list-item-avatar v-if="!noAction">
      <v-avatar color="grey">
        <v-icon dark v-text="item.icon || 'mdi-text'" />
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-subtitle v-if="!noAction" class="caption">
        <v-icon small left>mdi-bookmark-multiple</v-icon>
        {{ item.program_name }}
      </v-list-item-subtitle>
      <v-list-item-title
        v-if="!noAction"
        class="primary--text display-serif-1 font-weight-bold"
      >
        <v-icon v-if="!!item.disability" small left>
          mdi-wheelchair-accessibility
        </v-icon>
        {{ `${item.id} - ${item.activity_name}` }}
      </v-list-item-title>
      <v-list-item-subtitle class="caption">
        <v-icon small left>mdi-pin</v-icon>
        {{ address }}
      </v-list-item-subtitle>
      <v-list-item-subtitle class="caption">
        <v-chip v-if="!!parkUrl" :to="parkUrl" small>
          <v-icon x-small left>mdi-open-in-new</v-icon>
          {{ park }}
        </v-chip>
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <v-chip-group column>
          <v-chip :color="item.is_paid ? 'success' : ''" small>
            <v-icon small left>
              {{ item.is_paid ? "mdi-currency-usd" : "mdi-currency-usd-off" }}
            </v-icon>
            <i18n
              :path="`portal.forms.templates.${item.is_paid ? 'paid' : 'free'}`"
            />
          </v-chip>
          <v-chip color="primary" small>
            <v-icon small left> mdi-pound </v-icon>
            {{
              $t("portal.forms.preRegister.quota", {
                qty: item.quota,
              })
            }}
          </v-chip>
          <v-chip small :color="quota > 0 ? 'success' : undefined">
            <v-icon
              left
              small
              v-text="quota > 0 ? 'mdi-clock' : 'mdi-playlist-remove'"
            />
            {{
              $tc("portal.forms.preRegister.quotaLeft", quota, {
                qty: quota,
              })
            }}
          </v-chip>
          <v-chip small>
            <v-icon small left>mdi-human-male-female-child</v-icon>
            {{
              $t("portal.forms.preRegister.ages", {
                min: item.min_age,
                max: item.max_age,
              })
            }}
          </v-chip>
          <v-chip small>
            <v-icon small left>mdi-calendar</v-icon>
            {{
              $t("portal.forms.preRegister.schedules", {
                day: item.weekday_name,
                hour: item.daily_name,
              })
            }}
          </v-chip>
        </v-chip-group>
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="!!item.disability">
        <v-alert text dense icon="mdi-wheelchair-accessibility" type="warning">
          Actividad para personas en situación de discapacidad
        </v-alert>
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="!noAction" class="hidden-md-and-up">
        <app-btn
          path="buttons.PreRegister"
          small
          color="primary"
          :disabled="quota < 1"
          icon-text="mdi-account-plus"
          v-bind="action.attrs"
          v-on="action.on"
        />
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="!noAction" class="hidden-sm-and-down">
      <app-btn
        path="buttons.PreRegister"
        small
        color="primary"
        :disabled="quota < 1"
        icon-text="mdi-account-plus"
        v-bind="action.attrs"
        v-on="action.on"
      />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import slugify from "@/util/slugify";

export default {
  name: "VActivityListItem",
  props: {
    noAction: Boolean,
    item: {
      type: Object,
      default: () => ({
        id: undefined,
        icon: undefined,
        program_name: undefined,
        activity_name: undefined,
        stage_name: undefined,
        park_code: undefined,
        park_name: undefined,
        park_address: undefined,
        weekday_name: undefined,
        daily_name: undefined,
        min_age: undefined,
        max_age: undefined,
        quota: undefined,
        is_paid: undefined,
        is_initiate: undefined,
        start_date: undefined,
        final_date: undefined,
        is_activated: undefined,
        taken: undefined,
        users_schedules_count: undefined,
        created_at: undefined,
        updated_at: undefined,
      }),
    },
  },
  methods: {
    onClick() {
      this.$emit("click:activity", this.item);
    },
  },
  computed: {
    slug() {
      return slugify((this.item.activity_name || "").toLocaleLowerCase());
    },
    url() {
      return this.item.id && !this.noAction
        ? {
            name: "ActivityDetails",
            params: { id: this.item.id, slug: this.slug },
          }
        : undefined;
    },
    address() {
      const addrs = `- ${this.item.park_address || ""}`;
      return `${this.item.stage_name} ${addrs.length > 1 ? addrs : ""}`.trim();
    },
    parkUrl() {
      return this.item.park_code
        ? {
            name: "Park",
            params: { id: this.item.park_code },
          }
        : undefined;
    },
    park() {
      return `${this.item.park_code || ""} - ${this.item.park_name || ""}`;
    },
    quota() {
      return this.item.quota - this.item.users_schedules_count;
    },
    action() {
      const on = {
        click: this.onClick,
      };
      const attrs = {
        to: {
          name: "Login",
          query: {
            redirect: this.$router.resolve({
              name: "ActivityDetails",
              params: { id: this.item.id, slug: this.slug },
            }).route.path,
          },
        },
      };
      return {
        on: this.$auth.isLoggedIn() ? on : {},
        attrs: this.$auth.isLoggedIn() ? {} : attrs,
      };
    },
  },
};
</script>
