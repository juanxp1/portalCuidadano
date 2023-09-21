<template>
  <v-container fluid>
    <v-card
      v-for="(invoice, i) in statusTransfers"
      class="overflow-hidden"
      :key="`invoice-key-${i}`"
    >
      <v-img
        :src="require('@/assets/img/dashboard/invoice/invoice.jpeg')"
        aspect-ratio="16/9"
      >
        <v-toolbar dense flat color="transparent">
          <v-spacer />
          <app-menu menu-icon-color="white" :items="actions" />
        </v-toolbar>
        <v-row justify="center" class="py-8 px-8 py-md-27 px-md-0">
          <v-col cols="12" sm="12" md="9" class="mx-auto">
            <div
              class="d-flex justify-space-between body-2 pb-10 pb-md-20 flex-column flex-md-row"
            >
              <i18n
                tag="h1"
                class="display-3 white--text text-sm-center font-weight-black mt-md-10"
                path="dashboard.invoice.header"
              />
              <div class="d-flex flex-column align-md-end px-0">
                <a :href="link" target="_blank" class="mb-5 text-sm-center">
                  <v-icon dark size="80">$vuetify.icons.idrd</v-icon>
                </a>
                <span
                  class="white--text d-flex flex-column align-md-end opacity-70"
                >
                  <span>
                    <v-icon small dark left>mdi-pin</v-icon>
                    <i18n path="dashboard.invoice.address" />
                  </span>
                  <span>
                    <v-icon small dark left>mdi-phone</v-icon>
                    <i18n path="dashboard.invoice.phone" />
                  </span>
                  <span>
                    <v-icon small dark left>mdi-email</v-icon>
                    <i18n path="dashboard.invoice.email" />
                  </span>
                </span>
              </div>
            </div>
            <v-divider class="opacity-20 w-100" dark></v-divider>
            <div class="d-flex justify-space-between body-2 white--text pt-6">
              <div class="d-flex flex-column flex-root">
                <i18n
                  tag="span"
                  class="font-weight-bold mb-2"
                  path="dashboard.invoice.date"
                />
                <span class="opacity-70" v-text="invoice.paid_at" />
              </div>
              <div class="d-flex flex-column flex-root">
                <i18n
                  tag="span"
                  class="font-weight-bold mb-2"
                  path="dashboard.invoice.number"
                />
                <span class="opacity-70" v-text="invoice.transaction_id"></span>
              </div>
              <div
                v-if="$vuetify.breakpoint.mdAndUp"
                class="d-flex flex-column"
              >
                <i18n
                  tag="span"
                  class="font-weight-bold mb-2"
                  path="dashboard.invoice.receipt"
                />
                <span class="opacity-70">
                  {{ invoice.name }} <br />
                  {{ invoice.phone }} <br />
                  {{ invoice.email }}
                </span>
              </div>
            </div>
            <div
              v-if="$vuetify.breakpoint.smAndDown"
              class="d-flex justify-space-between body-2 white--text pt-6"
            >
              <div class="d-flex flex-column">
                <i18n
                  tag="span"
                  class="font-weight-bold mb-2"
                  path="dashboard.invoice.receipt"
                />
                <span class="opacity-70">
                  {{ invoice.name }} <br />
                  {{ invoice.phone }} <br />
                  {{ invoice.email }}
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-img>
      <v-card-text class="pa-0">
        <v-row justify="center" class="py-8 px-8 py-md-10 px-md-0">
          <v-col cols="12" sm="12" md="9" class="mx-auto">
            <v-skeleton-loader
              :loading="loading"
              type="article@2, actions"
              class="mx-auto"
            >
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <i18n
                        tag="th"
                        class="pl-0 font-weight-bold text-muted text-uppercase"
                        path="dashboard.invoice.table.concept"
                      />
                      <i18n
                        tag="th"
                        class="text-right font-weight-bold text-muted text-uppercase"
                        path="dashboard.invoice.table.tax"
                      />
                      <i18n
                        tag="th"
                        class="text-right font-weight-bold text-muted text-uppercase"
                        path="dashboard.invoice.table.amount"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="font-weight-bold border-bottom-0">
                      <td class="pl-0 pt-7">{{ invoice.concept }}</td>
                      <td class="text-right pt-7">{{ invoice.tax }}</td>
                      <td class="text-danger pr-0 pt-7 text-right">
                        $ {{ invoice.amount }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-skeleton-loader>
          </v-col>
          <v-col cols="12" sm="12" md="9" class="mx-auto">
            <v-alert elevation="1" v-bind="getInvoiceType(invoice.status)">
              <i18n tag="h4" :path="getInvoiceType(invoice.status).data" />
            </v-alert>
          </v-col>
        </v-row>
        <v-row
          justify="center"
          class="grey py-8 px-8 py-md-10 px-md-0"
          :class="styles"
        >
          <v-col cols="12" sm="12" md="9" class="mx-auto">
            <v-skeleton-loader
              :loading="loading"
              type="article, actions"
              class="mx-auto"
            >
              <div class="d-flex justify-space-between flex-column flex-md-row">
                <div class="d-flex flex-column mb-10 mb-md-0">
                  <i18n
                    tag="div"
                    class="font-weight-bold mb-3 text-uppercase"
                    path="dashboard.invoice.status_pay"
                  />
                  <div class="d-flex justify-space-between mb-3">
                    <i18n
                      tag="span"
                      class="mr-15 font-weight-bold"
                      path="dashboard.invoice.reference"
                    />
                    <span class="text-right">{{ invoice.reference }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-3">
                    <i18n
                      tag="span"
                      class="mr-15 font-weight-bold"
                      path="dashboard.invoice.currency"
                    />
                    <span class="text-right">{{ invoice.currency }}</span>
                  </div>
                  <div class="d-flex justify-space-between mb-3">
                    <i18n
                      tag="span"
                      class="mr-15 font-weight-bold"
                      path="dashboard.invoice.status"
                    />
                    <span class="text-right">{{ invoice.status_bank }}</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <i18n
                      tag="span"
                      class="mr-15 font-weight-bold"
                      path="dashboard.invoice.method"
                    />
                    <span class="text-right">
                      <v-tooltip class="pa-0 ma-0" top>
                        <template #activator="{ on, attrs }">
                          <v-icon
                            :aria-label="`${$t('dashboard.invoice.method')} ${
                              invoice.method
                            }`"
                            v-if="
                              (invoice.method || '').toUpperCase() === 'PSE'
                            "
                            class="pa-0 ma-0"
                            size="50"
                            v-bind="attrs"
                            v-on="on"
                          >
                            $vuetify.icon.pse
                          </v-icon>
                          <v-icon
                            v-else
                            :aria-label="`${$t('dashboard.invoice.method')} ${
                              invoice.method
                            }`"
                            size="30"
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-cash-multiple
                          </v-icon>
                        </template>
                        <span>{{ invoice.method }}</span>
                      </v-tooltip>
                    </span>
                  </div>
                </div>
                <div class="d-flex flex-column text-md-right">
                  <i18n
                    tag="span"
                    class="mb-1 text-uppercase font-weight-bold"
                    path="dashboard.invoice.total"
                  />
                  <span class="font-weight-black text-danger display-2 mb-1">
                    $ {{ invoice.amount }}
                  </span>
                  <i18n tag="span" path="dashboard.invoice.taxes" />
                </div>
              </div>
            </v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row justify="center" class="px-8 pb-sm-8 px-md-0">
          <v-col cols="12" sm="12" md="9" class="mx-auto">
            <v-alert type="info" colored-border border="left">
              <i18n
                tag="h4"
                class="font-weight-regular"
                path="dashboard.payments.invoiceAlert"
              />
            </v-alert>
          </v-col>
        </v-row>
        <v-row justify="end" class="px-8 pb-8 px-md-0 hidden-sm-and-down">
          <v-col cols="12" sm="12" md="9" class="mx-auto">
            <div class="d-flex justify-space-between flex-column flex-md-row">
              <app-btn
                :loading="loading"
                :disabled="loading"
                text
                color="primary"
                path="router.payments"
                icon-text="mdi-keyboard-backspace"
                :to="{ name: 'Payments' }"
              />
              <app-btn
                :loading="loading"
                :disabled="loading"
                color="primary"
                path="buttons.Print"
                icon-text="mdi-printer"
                @click="getVoucherUser"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { Booking } from "@/models/services/Booking";
export default {
  name: "DashboardPayment",
  data: (vm) => ({
    loading: false,
    requested_at: vm.$moment().format("YYYY-MM-DD hh:mm:ss"),
    payment: new Booking(),
    statusTransfers: [],
    link: process.env.VUE_APP_FOOTER_LINK,
  }),
  computed: {
    actions() {
      return [
        {
          icon: "mdi-keyboard-backspace",
          text: "buttons.Back",
          exact: true,
          to: { name: "Payments" },
        },
        {
          icon: "mdi-printer",
          text: "buttons.Print",
          action: this.getVoucherUser,
        },
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.fetchData,
        },
      ];
    },
    styles() {
      return this.$vuetify.theme.dark ? "darken-3" : "lighten-3";
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.getStatus();
      this.setStatus();
    },
    getStatus() {
      this.loading = true;
      this.payment
        .status(this.$route.params.id)
        .then((response) => {
          this.requested_at = response.requested_at;
          this.statusTransfers = response.data.map((status) => {
            return {
              status: status ? status.status.id : "notexist",
              status_bank: status ? status.status_bank : "-",
              name: status ? status.name + " " + status.last_name : "-",
              paid_at: status ? status.date_payment : "-",
              reference: status ? status.code_payment : "-",
              transaction_id: status ? status.transaccion_id_pse : "-",
              amount: status ? status.amount : "-",
              currency: status ? status.currently : "-",
              business_name: status ? status.document : "-",
              phone: status ? status.phone : "-",
              email: status ? (status.email || "").toLocaleLowerCase() : "-",
              concept: status ? status.concept : "-",
              tax: status ? status.tax : "0.0",
              method: status ? status.method.Nombre : "-",
            };
          });
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setStatus() {
      this.loading = true;
      this.payment
        .paymentStatus(this.$route.params.id)
        .then((response) => response)
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getInvoiceType(status) {
      switch (status) {
        case 1:
          return {
            type: "info",
            data: "dashboard.invoice.alerts.pending",
          };
        case 2:
          return {
            type: "success",
            data: "dashboard.invoice.alerts.success",
          };
        case 3:
          return {
            type: "error",
            data: "dashboard.invoice.alerts.canceled",
          };
        case 4:
          return {
            type: "warning",
            data: "dashboard.invoice.alerts.rejected",
          };
        case 5:
          return {
            type: "error",
            data: "dashboard.invoice.alerts.failed",
          };
        case "notexist":
          return {
            type: "error",
            data: "dashboard.invoice.alerts.notFount",
          };
        default:
          return {
            color: "primary",
            type: "success",
            data: "dashboard.invoice.alerts.verifying",
          };
      }
    },
    getVoucherUser() {
      window.print();
      /*
      window.open(
        `${process.env.VUE_APP_PSE}/api/payment-gateway/voucher/${this.$route.params.id}`,
        "_blank"
      );
       */
    },
  },
};
</script>
