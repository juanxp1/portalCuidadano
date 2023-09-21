<template>
  <details-page :title="title">
    <v-card-text>
      <v-activity-item @success="getData" :item="item" />
    </v-card-text>
  </details-page>
</template>

<script>
import { CitizenPortal } from "@/models/services/CitizenPortal";
export default {
  name: "ActivityDetails",
  metaInfo() {
    const evt = this.item;
    return {
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "Event",
            name: evt.activity_name,
            description: `Programa: ${evt.program_name} - Actividad: ${evt.activity_name} - Escenario: ${evt.stage_name} - Cupos: ${evt.quota} - Horarios: ${evt.weekday_name} ${evt.daily_name} - Edades: ${evt.min_age} - ${evt.max_age}`,
            image: evt.image,
            startDate: evt.start_date,
            endDate: evt.final_date || evt.start_date,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: evt.stage_name,
              address: {
                "@type": "PostalAddress",
                streetAddress: `${evt.park_address} - ${evt.park_name}`,
                addressLocality: "BOGOTA",
                postalCode: "111221",
                addressCountry: "CO",
              },
            },
            performer: {
              "@type": "Person",
              name: "IDRD",
            },
          },
        },
      ],
    };
  },
  data: () => ({
    title: "router.activitydetails",
    form: new CitizenPortal(),
    item: {},
    loading: false,
  }),
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.form
        .show(this.$route.params.id)
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
  },
};
</script>
