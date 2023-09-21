<template>
  <dashboard-card-view
    :card-title="activity.activity_name"
    :card-icon="activity.icon || 'mdi-soccer'"
    :loading="loading"
    :card-toolbar-actions="actions"
    :requested-at="requested_at"
  >
    <v-skeleton-loader
      :loading="loading"
      type="heading, list-item-avatar-three-line@6"
    >
      <v-row dense>
        <v-col v-if="!!activity.is_paid" cols="12" class="my-1">
          <template v-if="!!activity.citizen_schedule_payment_at">
            <v-bank-attachment
              :profile-id="activity.profile_id"
              :item="activity"
              @success="getData"
            />
          </template>
        </v-col>
        <v-col v-if="!!activity.actions" cols="12" sm="12" md="12">
          <v-card flat color="transparent">
            <v-card-text>
              <v-btn block color="error" @click="onDelete">
                Desinscribirme de la actividad
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-for="(h, i) in headers" cols="12" sm="12" md="6" :key="i">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-if="h.value === 'is_paid'">
                  <i18n
                    :path="activity.is_paid ? 'Pago' : 'Gratuito'"
                    tag="span"
                  />
                </v-list-item-title>
                <v-list-item-title v-else v-text="activity[h.value]" />
                <v-list-item-subtitle v-text="h.text" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-skeleton-loader>
    <v-check-dialog ref="confirmDialog">
      <span>Confirmo que no quiero participar en esta actividad.</span>
    </v-check-dialog>
  </dashboard-card-view>
</template>

<script>
import { Beneficiary } from "@/models/services/portal/Beneficiary";
export default {
  name: "DashboardSubscriptionDetails",
  data: () => ({
    loading: false,
    model: new Beneficiary(),
    activity: {},
    requested_at: null,
    list: [],
  }),
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.model
        .subscription(this.$route.params.id)
        .then((response) => {
          this.activity = response.data;
          this.requested_at = response.requested_at;
          this.list = [
            ...response.details.headers,
            ...response.details.expanded,
          ];
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onDelete() {
      const item = this.activity;
      this.$refs.confirmDialog
        .open()
        .then((response) => {
          if (response) {
            if (item.id) {
              this.loading = true;
              this.model
                .unsubscribe(this.$route.params.id)
                .then((response) => {
                  this.$snackbar.success(response.data);
                  this.$router.push({
                    name: "Subscriptions",
                  });
                })
                .catch((errors) => {
                  this.$snackbar.error(errors.message);
                })
                .finally(() => {
                  this.loading = false;
                });
            }
          }
        })
        .catch(() => {});
    },
  },
  computed: {
    actions() {
      return [
        {
          icon: "mdi-currency-usd",
          title: "Realizar pago en línea o cargar comprobante",
          action: () => ({}),
          show: !!this.activity.is_paid,
        },
        {
          icon: "mdi-close",
          text: "Desinscribirme",
          action: this.onDelete,
          show: !!this.activity.actions,
        },
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.getData,
          show: true,
        },
      ].filter((i) => i.show);
    },
    headers() {
      return this.list.filter(
        (header) => !!this.activity[header.value] && header.value !== "actions"
      );
    },
  },
};
</script>
