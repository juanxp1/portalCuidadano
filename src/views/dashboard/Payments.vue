<template>
  <material-data-table-card
    storage-path="payments"
    :model="model"
    card-icon="mdi-currency-usd"
    card-title-i18n="router.payments"
    :show-create-button="false"
    :show-update-button="false"
    :show-delete-button="false"
    :show-search-input="true"
    :has-data-table-actions="false"
    no-data-icon="mdi-currency-usd-off"
    no-data-label="dashboard.payments.noData"
    no-data-description="dashboard.payments.noDataDescription"
  >
    <template #card-tutorial>
      <payments-help />
    </template>
    <template #[`item.method`]="{ item }">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-icon
            v-if="item.method === 'PSE'"
            size="50"
            v-bind="attrs"
            v-on="on"
          >
            $vuetify.icon.pse
          </v-icon>
          <v-icon v-else size="50" v-bind="attrs" v-on="on">
            mdi-currency-usd
          </v-icon>
        </template>
        <span>{{ item.method }}</span>
      </v-tooltip>
    </template>
    <template #[`item.payment_code`]="{ item }">
      <app-btn
        x-small
        color="primary"
        path="buttons.View"
        :to="{ name: 'Payment', params: { id: item.payment_code } }"
      />
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip
        :color="item.status_color"
        class="overline mb-3"
        style="white-space: break-spaces"
        small
        v-text="item.status"
      />
    </template>
    <template #[`item.payment_at`]="{ item }">
      <app-time-ago
        v-if="!!item.created_at"
        classes="caption"
        :date-time="item.created_at"
        :prefix="$t('buttons.Created')"
      />
    </template>
    <template #[`item.total_format`]="{ item }">
      <span class="caption" v-text="item.total_format" />
    </template>
    <template #empty-state-no-data="{ refresh }">
      <v-card-actions>
        <v-row dense no-gutters justify="center" align="center">
          <v-col cols="auto">
            <app-btn
              small
              class="mx-1 mb-2"
              color="primary"
              path="Hacer una reserva"
              :to="{ name: 'Booking' }"
            />
          </v-col>
          <v-col cols="auto">
            <app-btn
              small
              outlined
              class="mx-1 mb-2"
              color="primary"
              path="buttons.Refresh"
              @click="refresh"
            />
          </v-col>
        </v-row>
      </v-card-actions>
    </template>
  </material-data-table-card>
</template>

<script>
import PaymentsHelp from "@/pages/help/PaymentsHelp.md";
import { Payment } from "@/models/services/Payment";

export default {
  name: "DashboardPayments",
  components: {
    PaymentsHelp: PaymentsHelp.vue.component,
  },
  data: () => ({
    model: new Payment(),
  }),
};
</script>

<style scoped></style>
