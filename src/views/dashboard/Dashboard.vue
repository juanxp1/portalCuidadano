<template>
  <dashboard-card-view
    card-icon="mdi-calendar"
    :card-title-i18n="`Tu agenda para ${
      $refs.calendar ? $refs.calendar.title : 'este mes'
    }`"
    :loading="loading"
    :requested-at="requested_at"
    :card-toolbar-actions="actions"
  >
    <template #beforeCard>
      <v-col cols="12">
        <v-alert
          v-if="completion && completion < 90"
          color="warning"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-alert"
        >
          <i18n class="caption" path="alerts_dashboard.profile">
            <template #name>{{ user.name }}</template>
          </i18n>
          <template #append>
            <v-btn
              :aria-label="$t('buttons.Go')"
              x-small
              rounded
              color="primary"
              :to="{ name: 'Profile' }"
            >
              {{ $t("buttons.Go") }}
            </v-btn>
          </template>
        </v-alert>
        <v-alert
          v-for="(pay, i) in toPay"
          text
          dense
          type="info"
          :key="i"
        >
          <span
            class="caption"
            v-text="`Actividad pendiente de pago: ${pay.activity}`"
          />
          <app-timer
            tag="h2"
            class="caption"
            :time="Date.parse(pay.payment_at) - Date.now()"
            v-slot="{ days, hours, minutes, seconds }"
          >
            {{
              `Quedan: ${days} día(s) : ${hours} hora(s) : ${minutes} minuto(s) : ${seconds} segundo(s)`
            }}
          </app-timer>
          <template #append>
            <v-btn
              :to="{
                name: 'SubscriptionDetails',
                params: { id: pay.id },
              }"
              x-small
              color="primary"
              v-text="$t('buttons.GoToPay')"
            />
          </template>
        </v-alert>
      </v-col>
    </template>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="12" md="6">
          <v-list v-if="bookings.length" dense three-line>
            <v-list-item
              v-for="booking in bookings"
              :key="booking.id"
              class="pa-0 ma-0"
            >
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="booking.name" />
                <v-list-item-subtitle
                  v-text="
                    `${booking.date} - ${booking.start_hour} / ${booking.final_hour}`
                  "
                />
                <v-list-item-subtitle v-text="booking.park" />
                <v-list-item-subtitle v-text="booking.address" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-empty-state
            v-else
            icon="mdi-calendar-remove"
            description="No tienes agenda para esta semana, reserva una cancha o un asador. O participa de alguna de las actividades que ofrecemos paea tí"
          >
            <v-card flat color="transparent">
              <v-card-actions>
                <v-btn color="primary" :to="{ name: 'Booking' }" small
                  ><v-icon left small>mdi-book</v-icon>Reservar</v-btn
                >
                <v-btn outlined color="primary" :to="{ name: 'Home' }" small
                  ><v-icon left small>mdi-magnify</v-icon>Buscar
                  Actividades</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-empty-state>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-sheet height="400">
            <v-calendar
              ref="calendar"
              :locale="$i18n.locale"
              :now="$moment().format('YYYY-MM-DD')"
              :value="$moment().format('YYYY-MM-DD')"
              :events="bookings"
              color="primary"
              type="month"
              @click:more="onMore"
              @click:date="onMore"
              @click:day="onMore"
              @click:event="showEvent"
            />
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card min-width="350px" max-height="600px" flat>
                <v-toolbar color="primary" dark>
                  <v-toolbar-title v-text="'Reservas'" />
                  <v-spacer />
                  <v-btn icon @click="onClose">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-list v-if="more.length" dense three-line>
                    <v-list-item
                      v-for="evt in more"
                      :key="evt.id"
                      class="pa-0 ma-0"
                    >
                      <v-list-item-icon class="hidden-sm-and-down">
                        <v-icon>mdi-calendar</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="evt.name" />
                        <v-list-item-subtitle
                          v-text="
                            `${evt.date} - ${evt.start_hour} / ${evt.final_hour}`
                          "
                        />
                        <v-list-item-subtitle v-text="evt.park" />
                        <v-list-item-subtitle v-text="evt.address" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-empty-state
                    v-else
                    icon="mdi-calendar-remove"
                    description="No tienes reservas para este día"
                  />
                </v-card-text>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
    <template #afterCard>
      <v-col cols="12" class="my-4">
        <div class="font-weight-light mt-1 v-sheet" style="font-size: 25px">
          Servicios
        </div>
      </v-col>
      <v-col v-for="(card, i) in cards" sm="12" md="3" :key="i">
        <material-card color="transparent" image hover-reveal>
          <template #image>
            <v-img
              class="rounded"
              :src="card.image"
              :lazy-src="card.image"
              :alt="card.title"
              :eager="true"
              max-height="100"
            />
          </template>
          <template #reveal-actions>
            <app-btn
              path="buttons.Details"
              icon
              icon-text="mdi-view-split-vertical"
              class="mx-1"
              :disabled="!!card.disabled"
              v-bind="card.props"
            />
          </template>
          <v-card-title
            class="justify-center font-weight-bold display-serif-1"
            v-text="card.title"
          />
          <v-card-text
            class="body-2 text-center mb-3 font-weight-light grey--text"
            v-text="card.description"
          />
          <v-card-actions class="pa-0 ma-0">
            <app-btn
              path="buttons.Details"
              block
              text
              small
              color="primary"
              :disabled="!!card.disabled"
              v-bind="card.props"
            />
          </v-card-actions>
          <template #actions>
            <div class="font-weight-bold caption" v-text="card.price" />
            <v-spacer />
            <span class="caption grey--text darken-4">
              <v-icon small left>mdi-map-marker</v-icon>
              {{ card.place }}
            </span>
          </template>
        </material-card>
      </v-col>
      <v-col cols="12" class="my-4">
        <div class="font-weight-light mt-1 v-sheet" style="font-size: 25px">
          Actividades que te pueden interesar
        </div>
      </v-col>
      <v-col cols="12">
        <v-skeleton-loader :loading="loadingEvents" class="mx-auto" type="card">
          <div
            class="d-flex flex-nowrap py-12"
            style="width: 100%; overflow-x: auto"
          >
            <template v-if="eventsIDRD.length > 0">
              <agenda-events
                v-for="evt in eventsIDRD"
                :key="evt.id"
                :event="evt"
              />
              <v-card flat color="transparent" class="mx-16">
                <v-card-text
                  class="d-flex fill-height align-center justify-center text-center"
                >
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        :aria-label="$t('buttons.More')"
                        color="primary"
                        fab
                        x-large
                        v-bind="attrs"
                        v-on="on"
                        :to="{ name: 'AgendaEvents' }"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <i18n tag="span" path="buttons.More" />
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </template>
            <template v-else>
              <v-card flat color="transparent" class="mx-auto">
                <v-card-text>
                  <v-empty-state
                    icon="mdi-calendar"
                    label="No hay eventos programados"
                    description="No hay eventos programados para este día, regresa más tarde."
                  >
                    <v-btn
                      :aria-label="$t('buttons.More')"
                      color="primary"
                      :to="{ name: 'AgendaEvents' }"
                    >
                      {{ $t("buttons.More") }}
                      <v-icon right>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-empty-state>
                </v-card-text>
              </v-card>
            </template>
          </div>
        </v-skeleton-loader>
      </v-col>
    </template>
  </dashboard-card-view>
</template>

<script>
import { get, sync } from "vuex-pathify";
import { Booking } from "@/models/services/Booking";
import { IDRDEvent } from "@/models/services/IDRDEvent";
export default {
  name: "DashboardView",
  props: {
    activity: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    loading: null,
    requested_at: null,
    booking: new Booking(),
    bookings: [],
    loadingEvents: false,
    event: new IDRDEvent(),
    eventsIDRD: [],
    more: [],
    toPay: [],
    selectedEvent: {},
    selectedOpen: false,
    selectedElement: null,
  }),
  mounted() {
    this.$refs.calendar.scrollToTime(this.$moment().format("HH:mm"));
    this.getBookings();
    this.getPending();
    this.getEvents();
    if (!this.has_document) {
      this.$router.push({
        name: "Profile",
        params: { complete: true },
      });
    }
  },
  methods: {
    onMore({ date }, nativeEvent) {
      const open = () => {
        this.more = this.bookings.filter((event) => event.date === date);
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      if (this.selectedOpen) {
        this.more = [];
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.more = [event];
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.more = [];
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    onClose() {
      this.more = [];
      this.selectedOpen = false;
    },
    getBookings() {
      this.loading = true;
      const params = {
        start_date: this.$moment().startOf("month").format("YYYY-MM-DD"),
        final_date: this.$moment().endOf("month").format("YYYY-MM-DD"),
      };
      this.booking
        .bookings({ params })
        .then((response) => {
          this.bookings = response.data;
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getEvents() {
      this.loadingEvents = true;
      this.event
        .events(5)
        .then((response) => {
          this.eventsIDRD = response;
        })
        .finally(() => {
          this.loadingEvents = false;
        });
    },
    getPending() {
      this.loading = true;
      this.booking
        .pendingToPay()
        .then((response) => {
          this.toPay = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    user: get("auth/user"),
    completion: get("auth/user@profile.completion"),
    activated: get("auth/user@email_verified_at"),
    has_document: get("auth/user@profile.document"),
    profiles: sync("auth/profiles"),
    cards() {
      return [
        {
          title: "Canchas Sintéticas",
          image: require("@/assets/img/landing/field.jpg"),
          props: {
            to: { name: "Booking" },
          },
          description: "Servicio de alquiler de canchas sintéticas.",
          place: "Parques de Bogotá",
          price: "",
        },
        {
          title: "Asadores",
          image: require("@/assets/img/landing/grill.jpg"),
          props: {
            to: { name: "Booking" },
          },
          description: "Servicio de alquiler de asadores.",
          place: "Parques de Bogotá",
          price: "",
        },
        {
          title: "Otros Servicios",
          image: require("@/assets/img/landing/recreation.jpeg"),
          props: {
            to: { name: "Services" },
          },
          description: "Otros servicios de reservas y pagos en línea.",
          place: "Parques de Bogotá",
          price: "",
        },
        {
          title: "Actividades",
          image: require("@/assets/img/landing/sports.jpg"),
          props: {
            to: {
              name: "SportActivities",
            },
          },
          description: "Programas de recreación y deporte.",
          place: "Parques de Bogotá",
          price: "",
        },
      ];
    },
    actions() {
      return [
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.getBookings,
        },
      ];
    },
  },
};
</script>
