<template>
  <v-data-iterator
    :options.sync="pagination"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="total"
    :items="items"
    item-key="id"
    :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
    :loading="loading"
  >
    <template #header>
      <app-card-toolbar
        :loading="loading"
        :requested-at="requested_at"
        :items="actions"
        menu-id="activities-menu"
      />
    </template>
    <template #default="{ items }">
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in items" :key="i">
          <v-expansion-panel-header>
            {{ `${item.id} - ${item.activity_name}` }}
            <template #actions>
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-avatar
                    :aria-label="item.schedule_status_name"
                    :color="item.schedule_status_color"
                    size="15"
                    v-on="on"
                  />
                </template>
                <span v-text="item.schedule_status_name" />
              </v-tooltip>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card flat color="transparent">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-alert
                      v-if="
                        item.citizen_pse_reference &&
                        item.citizen_pse_reference.status_id
                      "
                      elevation="1"
                      v-bind="
                        getInvoiceType(item.citizen_pse_reference.status_id)
                      "
                    >
                      <i18n
                        tag="h4"
                        :path="
                          getInvoiceType(item.citizen_pse_reference.status_id)
                            .data
                        "
                      />
                      <template #append>
                        <app-btn
                          x-small
                          color="primary"
                          path="buttons.View"
                          :to="{
                            name: 'Payment',
                            params: {
                              id: item.citizen_pse_reference.payment_code,
                            },
                          }"
                        />
                      </template>
                    </v-alert>
                    <v-bank-attachment :item="item" :profile-id="profileId" />
                  </v-col>
                  <v-col
                    v-for="(key, i) in keys"
                    cols="12"
                    sm="12"
                    md="6"
                    :key="`item-${i}`"
                  >
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            <app-time-ago
                              v-if="key.value === 'citizen_schedule_created_at'"
                              classes="caption"
                              :date-time="item[key.value]"
                            />
                            <v-list-item-title
                              v-else-if="
                                [
                                  'is_activated',
                                  'is_paid',
                                  'is_initiate',
                                ].includes(key.value)
                              "
                              v-text="
                                $t(
                                  `portal.forms.templates.${
                                    item[key.value] ? 'Yes' : 'No'
                                  }`
                                )
                              "
                            />
                            <span v-else v-text="item[key.value]" />
                          </v-list-item-title>
                          <v-list-item-subtitle
                            v-text="$t(`portal.forms.templates.${key.title}`)"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12">
                    <v-list>
                      <v-list-item
                        v-for="(file, j) in item.citizen_schedule_payment_files"
                        :key="`file-list-${j}`"
                        @click="onDownload(file)"
                      >
                        <v-list-item-avatar v-if="$vuetify.breakpoint.mdAndUp">
                          <v-avatar :color="file.color">
                            <v-icon dark>mdi-file</v-icon>
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="file.file" />
                          <v-list-item-subtitle v-text="file.file_type" />
                          <v-list-item-subtitle>
                            <v-avatar size="15" :color="file.color" left />
                            {{ file.status }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <app-time-ago :date-time="file.created_at" />
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action class="hidden-sm-and-down">
                          <v-menu offset-y left>
                            <template #activator="{ on: menu, attrs }">
                              <v-tooltip left>
                                <template #activator="{ on: tooltip }">
                                  <v-btn
                                    :aria-label="$t('buttons.MoreOptions')"
                                    icon
                                    v-bind="attrs"
                                    v-on="{ ...menu, ...tooltip }"
                                  >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ $t("buttons.MoreOptions") }}</span>
                              </v-tooltip>
                            </template>
                            <v-list dense>
                              <v-list-item @click="onDownload(file)">
                                <v-list-item-icon>
                                  <v-icon>mdi-cloud-download</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>
                                  {{ $t("buttons.Download") }}
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template #no-data>
      <v-empty-state
        icon="mdi-soccer"
        :label="$t('portal.forms.states.UserActivities')"
      />
    </template>
    <template #loading>
      <v-skeleton-loader type="list-item-avatar-two-line@5" />
    </template>
  </v-data-iterator>
</template>

<script>
import { get } from "lodash";
import FileSaver from "file-saver";
import Base64ToBlob from "@/util/Base64ToBlob";
import { Arrow } from "@/plugins/Arrow";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import { File } from "@/models/services/portal/File";
import { Booking } from "@/models/services/Booking";

/**
 * Identificador del tipo de archivo "CONSIGNACIÓN" en la base de datos
 *
 * @type {number}
 */
const PAYMENT = 3;

export default {
  name: "VUserActivities",
  props: {
    profileId: {
      type: [Number, String],
    },
  },
  watch: {
    profileId() {
      this.getData();
    },
    "pagination.page"() {
      return this.form && this.getData();
    },
    itemsPerPage() {
      return this.form && this.getData();
    },
  },
  data: (vm) => ({
    arrow: new Arrow(window, window.document, "primary"),
    show: true,
    requested_at: null,
    loading: false,
    form: new Beneficiary(),
    items: [],
    total: 0,
    pagination: {},
    itemsPerPage: 10,
    itemsPerPageArray: [10, 30, 30, 50, 100],
    payment: new File(vm.profileId, {
      file_type_id: PAYMENT,
      file: null,
      citizen_schedule_id: null,
    }),
    booking: new Booking(),
    redirect: null,
  }),
  methods: {
    getData() {
      this.loading = true;
      const params = {
        per_page: this.itemsPerPage,
        page: this.pagination.page,
      };
      this.form
        .activities(this.profileId, { params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onOpen(item) {
      const that = this;
      const open = () => {
        that.payment.citizen_schedule_id = item.citizen_schedule_id;
        setTimeout(() => {
          return that.$refs.payment[0].open();
        }, 10);
      };

      if (this.payment.citizen_schedule_id) {
        this.payment.citizen_schedule_id = null;
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    onSuccess() {
      this.getData();
      this.$nextTick(function () {
        this.$refs.payment[0].close();
      });
    },
    onDownload(item, download = true) {
      this.loading = true;
      this.payment
        .download(this.profileId, item.id)
        .then((response) => {
          FileSaver.saveAs(
            new Base64ToBlob(response.data.file).blob(),
            response.data.name
          );
        })
        .then(() => {
          this.arrow.show(6000);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onPayment(pse, item) {
      if (item.citizen_schedule_id && pse.payment) {
        this.loading = true;
        this.booking
          .reference(item.citizen_schedule_id, pse.payment)
          .then((response) => {
            this.$snackbar.success(response.data);
            window.location.href = pse.bank_url;
          })
          .catch((errors) => {
            this.$snackbar.success(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$snackbar.error(
          "El servicio de pagos en línea PSE no está disponible, por favor intente más tarde."
        );
      }
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
    availableToPay(item) {
      const payment = get(item, "citizen_pse_reference.status_id", 0);
      const f =
        !!item.citizen_schedule_payment_at && // Tiene fecha de pago
        this.show && // La fecha de pago aún está vigente
        !item.citizen_schedule_payment_files.length &&
        payment !== 2; // No tiene Archivos o el estado de pago aún no es aprobado
      console.log(
        !!item.citizen_schedule_payment_at,
        this.show,
        !item.citizen_schedule_payment_files.length,
        payment !== 2,
        !item.citizen_schedule_payment_files.length || payment !== 2
      );
      return f;
    },
  },
  computed: {
    keys() {
      return [
        {
          title: "schedule_created_at",
          value: "citizen_schedule_created_at",
        },
        {
          title: "program",
          value: "program_name",
        },
        {
          title: "activity",
          value: "activity_name",
        },
        {
          title: "park_code",
          value: "park_code",
        },
        {
          title: "park",
          value: "park_name",
        },
        {
          title: "address",
          value: "park_address",
        },
        {
          title: "weekday",
          value: "weekday_name",
        },
        {
          title: "daily",
          value: "daily_name",
        },
        {
          title: "start_date",
          value: "start_date",
        },
        {
          title: "final_date",
          value: "final_date",
        },
        {
          title: "min_age",
          value: "min_age",
        },
        {
          title: "is_paid",
          value: "is_paid",
        },
        {
          title: "is_initiate",
          value: "is_initiate",
        },
        {
          title: "is_activated",
          value: "is_activated",
        },
        {
          title: "created_at",
          value: "created_at",
        },
      ];
    },
    actions() {
      return [
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.getData,
        },
      ];
    },
    sections() {
      return [
        {
          title: "",
          fields: [
            {
              name: "file",
              icon: "mdi-paperclip",
              type: "dropzone",
              rules: this.payment.validations.pdf_file_required,
              flex: 12,
              attrs: {
                accept: "application/pdf",
                required: true,
              },
            },
          ],
        },
      ];
    },
  },
};
</script>
