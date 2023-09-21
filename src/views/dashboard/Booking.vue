<template>
  <dashboard-card-view
    card-title-i18n="router.booking"
    card-icon="mdi-book"
    :loading="loading"
    :requested-at="requested_at"
  >
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-item-group active-class="primary" mandatory v-model="method">
            <v-container>
              <v-row>
                <v-col cols="12"> Selecciona un ítem de interés </v-col>
                <v-col v-for="(n, i) in cards" :key="i" cols="12" md="4">
                  <v-item v-slot="{ active, toggle }" :value="n.value">
                    <v-card
                      class="d-flex align-center"
                      height="80"
                      :href="n.href"
                      :to="n.to"
                      target="_blank"
                      @click="toggle"
                    >
                      <v-img
                        :src="n.image"
                        :lazy-src="n.image"
                        aspect-ratio="16/9"
                        height="80"
                      >
                        <v-scroll-y-transition>
                          <v-overlay absolute :opacity="active ? '0.2' : '0.8'">
                            <div
                              v-if="active"
                              class="flex-grow-1 text-center font-weight-bold"
                            >
                              <v-icon dark x-large left>{{ n.icon }}</v-icon>
                              {{ n.title }}
                            </div>
                            <div
                              v-else
                              class="flex-grow-1 text-center font-weight-bold"
                            >
                              <v-icon dark x-large left>{{ n.icon }}</v-icon>
                              {{ n.title }}
                            </div>
                          </v-overlay>
                        </v-scroll-y-transition>
                      </v-img>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col cols="12">
                  Se muestran elementos para: {{ selected }}
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </v-col>
        <v-col cols="12">
          <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(getData)">
              <v-validation-provider v-slot="{ errors }">
                <v-text-field
                  :label="$t('input.search')"
                  persistent-hint
                  hint="Digita el nombre de un parque, localidad, upz o descripción de la cancha. Ejemplo: FUTBOL 8"
                  clearable
                  v-model="query"
                  :error-messages="errors"
                  @click:clear="getData"
                >
                  <template v-slot:append-outer>
                    <v-btn
                      :aria-label="$t('input.search')"
                      type="submit"
                      :loading="loading"
                      :disabled="loading"
                      small
                      color="primary"
                    >
                      <v-icon left>mdi-magnify</v-icon>
                      {{ $t("input.search") }}
                    </v-btn>
                  </template>
                </v-text-field>
              </v-validation-provider>
            </v-form>
          </v-validation-observer>
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader
            :loading="loading"
            transition="scale-transition"
            ref="skeleton"
            type="table"
            class="mx-auto"
          >
            <v-data-iterator
              :options.sync="pagination"
              :items-per-page.sync="itemsPerPage"
              :server-items-length="total"
              :headers="headers"
              :items="items"
              item-key="id"
              show-expand
              :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
            >
              <template v-slot:default="props">
                <v-list three-line subheader>
                  <v-list-item
                    v-for="item in props.items"
                    :key="item.park_endowment_id"
                    :to="{
                      name: 'BookingDates',
                      params: { id: item.park_endowment_id, item },
                    }"
                  >
                    <v-list-item-avatar>
                      <v-avatar size="125">
                        <v-img
                          :src="
                            item.image
                              ? item.image
                              : require('@/assets/img/dashboard/booking/field.jpg')
                          "
                          :lazy-src="
                            item.image
                              ? item.image
                              : require('@/assets/img/dashboard/booking/field.jpg')
                          "
                          :eager="true"
                          aspect-ratio="16/9"
                          :alt="item.park_name"
                        />
                      </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        <span class="font-weight-bold">{{
                          `${$t("park.code_min")}: `
                        }}</span>
                        {{ `${item.park_code}` }}
                        <span class="font-weight-bold hidden-sm-and-down">{{
                          ` - ${$t("park.name_min")}: `
                        }}</span>
                        <span class="hidden-sm-and-down">{{
                          `${item.park_name}`
                        }}</span>
                      </v-list-item-title>
                      <v-list-item-subtitle class="hidden-md-and-up">
                        <span class="font-weight-bold">{{
                          `${$t("park.name_min")}: `
                        }}</span>
                        {{ `${item.park_name}` }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle
                        v-text="item.address"
                      ></v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <span class="font-weight-bold">{{
                          `${$t("park.locality")}: `
                        }}</span>
                        {{ item.locality }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <span class="font-weight-bold">{{
                          `${$t("park.upz")}: `
                        }}</span>
                        {{ item.upz }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="item.endowment_description">
                        <span class="font-weight-bold">{{
                          `${$t("park.desc")}: `
                        }}</span>
                        {{ item.endowment_description }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="!item.for_booking">
                        <v-icon left x-small color="warning">mdi-alert</v-icon>
                        <i18n
                          tag="span"
                          class="grey--text"
                          path="endowment.no_schedule"
                        />
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
              <template #no-data>
                <v-empty-state
                  icon="mdi-book"
                  :label="$t('menu.booking')"
                  description="No hay elementos para reservar"
                >
                </v-empty-state>
              </template>
              <template #no-results>
                <v-empty-state
                  icon="mdi-book"
                  :label="$t('menu.booking')"
                  description="No se encontraron elementos para reservas"
                >
                </v-empty-state>
              </template>
            </v-data-iterator>
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </dashboard-card-view>
</template>

<script>
import { debounce } from "lodash";
import { Booking } from "@/models/services/Booking";
export default {
  name: "DashboardBooking",
  data: () => ({
    query: null,
    loading: false,
    requested_at: null,
    form: new Booking(),
    items: [],
    headers: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    method: "index",
    selected: "Canchas Sintéticas",
  }),
  created() {
    this.getData();
  },
  methods: {
    getData: debounce(function () {
      if (this.method !== "link") {
        this.loading = true;
        const params = {
          page: this.pagination.page,
          per_page: this.itemsPerPage,
          query: this.query,
        };
        this.form[this.method]({ params })
          .then((response) => {
            this.items = response.data;
            this.headers = response.details.headers;
            this.total = response.meta.total;
            this.requested_at = response.requested_at;
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }, 300),
  },
  watch: {
    "pagination.page"() {
      return this.getData();
    },
    itemsPerPage() {
      return this.getData();
    },
    method(val) {
      switch (val) {
        case "index":
          this.selected = "Canchas Sintéticas";
          break;
        case "grills":
          this.selected = "Asadores";
          break;
      }
      return this.getData();
    },
  },
  computed: {
    cards() {
      return [
        {
          title: "Canchas",
          image: require("@/assets/img/dashboard/booking/field.jpg"),
          value: "index",
          icon: "mdi-soccer-field",
        },
        {
          title: "Asadores",
          image: require("@/assets/img/dashboard/booking/grill.jpg"),
          value: "grills",
          icon: "mdi-grill",
        },
        {
          title: "Otros",
          image: require("@/assets/img/dashboard/booking/recreation.jpeg"),
          value: "link",
          to: {
            name: "Services",
          },
          icon: "mdi-currency-usd",
        },
      ];
    },
  },
};
</script>

<style scoped></style>
