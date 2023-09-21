<template>
  <material-data-table-card
    storage-path="bookings"
    :model="model"
    card-icon="mdi-book"
    card-title-i18n="router.bookings"
    index-method="bookings"
    :show-create-button="false"
    :show-update-button="false"
    :show-delete-button="false"
    :show-export-button="false"
    :show-search-input="false"
    :has-data-table-actions="false"
  >
    <template #card-tutorial>
      <bookings-help />
    </template>
    <template #[`item.payment_code`]="{ item }">
      <app-btn
        x-small
        color="primary"
        path="buttons.View"
        :to="{ name: 'Payment', params: { id: item.payment_code } }"
      />
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
import BookingsHelp from "@/pages/help/BookingsHelp.md";
import { Booking } from "@/models/services/Booking";
export default {
  name: "DashboardBooking",
  components: {
    BookingsHelp: BookingsHelp.vue.component,
  },
  data: () => ({
    model: new Booking(),
  }),
};
</script>
