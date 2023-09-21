<template>
  <v-skeleton-loader :loading="loading" type="card-avatar, article, actions">
    <info-content
      text-left
      info-horizontal
      icon-color="primary"
      icon="mdi-text"
      :subtitle="item.endowment"
      :subheader="item.equipment"
    >
      <v-row role="list" dense v-bind="$attrs">
        <v-col cols="12" sm="12" md="6" class="mx-auto">
          <v-img
            min-height="300"
            max-height="400"
            :src="item.image"
            :lazy-src="item.image"
            aspect-ratio="16/9"
            class="rounded"
            :alt="item.endowment"
            :eager="true"
            gradient="to top right, rgba(0,0,0,.4), rgba(0,0,0,.1)"
          >
            <v-toolbar flat dense color="transparent">
              <v-toolbar-title class="font-weight-bold white--text">
                # {{ item.id }}
              </v-toolbar-title>
              <v-spacer />
              <v-toolbar-items>
                <app-btn
                  icon
                  color="white"
                  path="input.window"
                  icon-text="mdi-image-outline"
                  :href="item.image"
                  target="_blank"
                />
              </v-toolbar-items>
            </v-toolbar>
            <template #placeholder>
              <v-img
                max-height="400"
                :src="defaultPhoto"
                :lazy-src="defaultPhoto"
                aspect-ratio="16/9"
                class="rounded"
                alt="No Image"
              />
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" sm="12" md="6" class="mx-auto">
          <v-card flat color="transparent">
            <v-card-text>
              <v-list color="transparent">
                <v-list-item-content>
                  <v-list-item-title v-text="$t('endowment.description')" />
                  <v-list-item-subtitle
                    class="display-1 font-weight-regular text-wrap"
                    v-text="item.description"
                  />
                </v-list-item-content>
              </v-list>
              <v-alert
                v-if="!item.for_booking"
                type="info"
                colored-border
                border="left"
              >
                <i18n class="grey--text" path="endowment.no_schedule" />
              </v-alert>
              <v-card-actions class="flex-wrap align-center justify-center">
                <app-btn
                  v-if="!!item.park_code || !!item.park_id"
                  path="buttons.ViewPark"
                  text
                  color="primary"
                  class="my-3"
                  icon-text="mdi-pine-tree"
                  :to="{
                    name: 'Park',
                    params: { id: item.park_code || item.park_id },
                  }"
                />
                <app-btn
                  :disabled="!item.for_booking"
                  path="buttons.Book"
                  color="primary"
                  class="my-3"
                  icon-text="mdi-currency-usd"
                  :to="url"
                />
              </v-card-actions>
              <help-accordion
                :youtube="!!tutorial.video"
                :title="tutorial.title"
                :src="tutorial.video"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels :value="0" accordion>
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold">
                <i18n path="endowment.specs" />
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col
                    v-for="(endowment, i) in endowments"
                    cols="12"
                    sm="12"
                    :md="endowment.flex"
                    :key="i"
                  >
                    <v-list-item two-line>
                      <v-list-item-avatar>
                        <v-icon v-text="icons[endowment.value]" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          :class="endowment.class"
                          v-text="item[endowment.value]"
                        />
                        <v-list-item-subtitle
                          class="font-weight-bold"
                          v-text="$t(`endowment.${endowment.value}`)"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="!!item.for_booking">
              <v-expansion-panel-header class="font-weight-bold">
                <i18n path="Horarios" />
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!--
                <v-chip-group
                  v-model="form.date"
                  mandatory
                  active-class="primary--text"
                  class="justify-center"
                  show-arrows
                  @change="getData"
                >
                  <v-chip
                    v-for="(day, i) in days"
                    :key="i"
                    :value="day.id"
                    :disabled="loading || day.disabled || loadingCal"
                  >
                    <v-icon left>mdi-calendar</v-icon>
                    {{ day.name }}
                  </v-chip>
                </v-chip-group>
                -->
                <v-skeleton-loader
                  :loading="loading || loadingCal"
                  type="heading, list-item-avatar-three-line@1"
                >
                  <v-sheet v-if="times.length" height="100vh">
                    <v-calendar
                      :locale="$i18n.locale"
                      :event-color="getEventColor"
                      ref="calendar"
                      color="primary"
                      type="custom-daily"
                      :start="$moment().add(1, 'day').format('YYYY-MM-DD')"
                      :end="$moment().add(7, 'days').format('YYYY-MM-DD')"
                      first-time="05:00"
                      interval-count="19"
                      category-show-all
                      :categories="categories"
                      :events="times"
                      v-model="form.date"
                    />
                  </v-sheet>
                  <v-list v-else two-line dense>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-clock</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="
                            `No hay horarios disponibles para la fecha ${form.date}`
                          "
                        />
                        <v-list-item-subtitle
                          v-text="`Selecciona otra fecha`"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-skeleton-loader>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="!!item.for_booking">
              <v-expansion-panel-header class="font-weight-bold">
                <i18n path="buttons.Requirements" />
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <app-md>
                  {{ item.requirements }}
                </app-md>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </info-content>
  </v-skeleton-loader>
</template>

<script>
import { Booking } from "@/models/services/Booking";
import { debounce } from "lodash";

export default {
  name: "EndowmentItem",
  props: {
    loading: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.getData();
  },
  data: (vm) => ({
    loadingCal: false,
    hideLottie: false,
    defaultPhoto: require("@/assets/img/error/no_image.png"),
    keys: [
      // value: "description", flex: 12 },
      // { value: "equipment", flex: 3 },
      // { value: "endowment", flex: 3 },
      { value: "economic_use", flex: 3 },
      { value: "endowment_num", flex: 3 },
      { value: "dunt", flex: 3 },
      { value: "capacity", flex: 3 },
      { value: "status", flex: 3 },
      { value: "material", flex: 3 },
      { value: "floor_material", flex: 3 },
      { value: "illumination", flex: 3 },
      { value: "water", flex: 3 },
      { value: "light", flex: 3 },
      { value: "gas", flex: 3 },
      { value: "lane", flex: 3 },
      { value: "positioning", flex: 3 },
      { value: "destination", flex: 3 },
      { value: "area", flex: 3 },
      { value: "long", flex: 3 },
      { value: "width", flex: 3 },
      { value: "enclosure", flex: 3 },
      { value: "enclosure_type", flex: 3 },
      { value: "enclosure_height", flex: 3 },
      { value: "covered", flex: 3 },
      { value: "bath", flex: 3 },
      { value: "sanitary_battery", flex: 3 },
      { value: "dressing_room", flex: 3 },
      { value: "male_bath", flex: 3 },
      { value: "female_bath", flex: 3 },
      { value: "disabled_bath", flex: 3 },
      { value: "car_parking", flex: 3 },
      { value: "bike_parking", flex: 3 },
      { value: "date", flex: 3 },
      { value: "maintenance_diagnosis", flex: 12, class: "text-wrap" },
      { value: "construction_diagnosis", flex: 12, class: "text-wrap" },
    ],
    icons: {
      equipment: "mdi-dots-horizontal",
      endowment: "mdi-dots-horizontal",
      description: "mdi-text",
      endowment_num: "mdi-numeric",
      status: "mdi-clipboard-check-outline",
      material: "mdi-soccer-field",
      illumination: "mdi-lightbulb-outline",
      economic_use: "mdi-currency-usd",
      area: "mdi-shape-square-plus",
      floor_material: "mdi-soccer-field",
      dressing_room: "mdi-home-city-outline",
      light: "mdi-lightbulb-outline",
      water: "mdi-water",
      gas: "mdi-gas-cylinder",
      capacity: "mdi-pound",
      lane: "mdi-highway",
      bath: "mdi-paper-roll-outline",
      sanitary_battery: "mdi-shower",
      maintenance_diagnosis: "mdi-clipboard-check-outline",
      construction_diagnosis: "mdi-clipboard-check-outline",
      positioning: "mdi-clipboard-text",
      destination: "mdi-clipboard-text",
      date: "mdi-calendar",
      enclosure: "mdi-door-closed",
      enclosure_type: "mdi-door-closed",
      enclosure_height: "mdi-arrow-split-horizontal",
      long: "mdi-arrow-split-vertical",
      width: "mdi-arrow-split-vertical",
      covered: "mdi-home",
      dunt: "mdi-skateboarding",
      male_bath: "mdi-numeric",
      female_bath: "mdi-numeric",
      disabled_bath: "mdi-numeric",
      car_parking: "mdi-parking",
      bike_parking: "mdi-parking",
    },
    form: new Booking({
      date: vm.$moment().add(1, "day").format("YYYY-MM-DD"),
    }),
    categories: ["Disponible", "Reservado"],
    times: [],
  }),
  methods: {
    getEventColor(event) {
      return event.color || "primary";
    },
    getData: debounce(function () {
      this.loadingCal = true;
      const id = this.$route.params.endowmentId || this.item.id || null;
      if (id) {
        this.form.resetOnlyWhenUpdate = false;
        this.form
          .schedules(id, {
            params: { date: this.form.date },
          })
          .then((response) => {
            this.times = response.data.map((time) => {
              return {
                ...time,
                name: time.title,
                start: this.$moment(time.start).format("YYYY-MM-DD HH:mm"),
                end: this.$moment(time.end).format("YYYY-MM-DD HH:mm"),
              };
            });
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loadingCal = false;
          });
      }
    }, 300),
  },
  computed: {
    endowments() {
      return this.keys.filter((key) => !!this.item[key.value]);
    },
    url() {
      if (this.item.id) {
        const to = {
          name: "BookingDates",
          params: { id: this.item.id, item: this.item },
        };
        const href = {
          name: "Login",
          query: {
            redirect: this.$router.resolve(to).route.path,
          },
        };
        return this.$auth.isLoggedIn() ? to : href;
      } else {
        return undefined;
      }
    },
    days() {
      const days = [1, 2, 3, 4, 5, 6, 7];
      return days.map((day) => {
        return {
          id: this.$moment().add(day, "day").format("YYYY-MM-DD"),
          name: this.$moment()
            .locale(this.$i18n.locale)
            .add(day, "day")
            .format("ddd DD MMM"),
        };
      });
    },
    tutorial() {
      return {
        title: this.item.tutorials
          ? this.item.tutorials.title
          : "Video de YouTube",
        video: this.item.tutorials ? this.item.tutorials.video : undefined,
      };
    },
  },
};
</script>
