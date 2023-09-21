<template>
  <details-page :title="title">
    <v-card-text>
      <endowment-item :loaxding="loading" :item="item" />
    </v-card-text>
  </details-page>
</template>

<script>
import { ParkEndowment } from "@/models/services/ParkEndowment";
export default {
  name: "ParkEndowment",
  props: {
    forBooking: Boolean,
  },
  data: (vm) => ({
    title: "router.parkendowment",
    form: new ParkEndowment(vm.$route.params.id, vm.$route.params.endowmentId),
    item: {},
    loading: false,
  }),
  created() {
    this.loading = true;
    this.form
      .index()
      .then((response) => {
        this.item = response.data;
      })
      .catch((errors) => {
        this.$snackbar.error(errors.message);
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
