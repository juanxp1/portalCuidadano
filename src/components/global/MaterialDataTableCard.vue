<template>
  <dashboard-card-view
    :card-title-i18n="cardTitleI18n"
    :card-title="cardTitle"
    :card-icon="cardIcon"
    :loading="loading"
    :card-toolbar-actions="actions"
    :requested-at="requested_at"
  >
    <v-card-text v-if="$slots.beforeTable">
      <slot name="beforeTable" />
    </v-card-text>
    <v-card-text>
      <v-skeleton-loader
        :loading="loading"
        transition="scale-transition"
        ref="skeleton"
        type="table"
        class="mx-auto"
      >
        <v-data-table
          :options.sync="pagination"
          :items-per-page.sync="itemsPerPage"
          :server-items-length="total"
          :headers="headers"
          :items="items"
          :search="query"
          :item-key="itemKey"
          :show-expand="expanded && expanded.length > 0"
          :hide-default-footer="$vuetify.breakpoint.mdAndUp"
          :footer-props="{
            'items-per-page-options': itemsPerPageArray,
            showFirstLastPage: true,
          }"
          @update:page="updateRoute"
          @update:sort-by="getData"
          @update:sort-desc="getData"
        >
          <template #top>
            <v-toolbar flat color="transparent">
              <slot name="toolbarTablePrepend" />
              <v-text-field
                v-if="showSearchInput"
                v-model="query"
                append-icon="mdi-magnify"
                clearable
                hide-details
                :label="$t('label.find_by_any')"
                @click:clear="onClearSearch"
              >
                <template #append-outer>
                  <app-btn
                    :x-small="$vuetify.breakpoint.smAndDown"
                    :small="$vuetify.breakpoint.mdAndUp"
                    :fab="$vuetify.breakpoint.smAndDown"
                    path="buttons.Search"
                    color="primary"
                    icon-text="mdi-magnify"
                    @click="onSearch"
                  >
                  </app-btn>
                </template>
              </v-text-field>
              <v-spacer />
              <slot name="toolbarTableAppend" />
              <app-btn
                v-for="(action, i) in actions"
                :key="i"
                :loading="loading"
                :disabled="loading"
                fab
                x-small
                :path="action.text"
                color="primary"
                class="hidden-sm-and-down"
                @click="action.action"
              >
                <v-icon color="white" dark v-text="action.icon" />
              </app-btn>
            </v-toolbar>
          </template>
          <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
          <template
            v-for="(_, name) in $scopedSlots"
            :slot="name"
            slot-scope="slotData"
          >
            <slot :name="name" v-bind="slotData" />
          </template>
          <template v-if="hasDataTableActions" #[`item.actions`]="{ item }">
            <template v-if="showActionsAsMenu">
              <app-menu>
                <slot name="prepend-action-menu" :item="item" />
                <app-item
                  v-for="(menu, i) in tableActions"
                  :item="menu"
                  :key="`menu-action-${i}`"
                  @click="menu.action(item)"
                />
                <slot name="append-action-menu" :item="item" />
              </app-menu>
            </template>
            <template v-else>
              <slot name="prepend-action-btn" :item="item" />
              <app-btn
                v-for="(btn, i) in tableActions"
                icon
                :path="btn.title"
                @click="btn.action(item)"
                :key="`data-table-action-${i}`"
              >
                <v-icon v-text="btn.icon" />
              </app-btn>
              <slot name="append-action-btn" :item="item" />
            </template>
          </template>
          <template v-if="customExpanded" #expanded-item="{ headers, item }">
            <td :colspan="headers.length" width="100%">
              <slot name="customExpanded" :item="item" :expanded="expanded" />
            </td>
          </template>
          <template v-else #expanded-item="{ headers: data, item }">
            <td :colspan="data.length" style="width: 100%" width="100%">
              <template v-for="(expanded_item, key) in expanded">
                <v-row
                  v-if="!!item[expanded_item.value]"
                  :key="`expanded-${key}`"
                >
                  <v-col cols="12" sm="12" md="6">
                    <div class="font-weight-bold">
                      {{ expanded_item.text }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    {{ item[expanded_item.value] }}
                  </v-col>
                </v-row>
              </template>
            </td>
          </template>
          <template #footer>
            <div class="v-data-footer hidden-sm-and-down">
              <div class="v-data-footer__select">
                {{ $t("$vuetify.dataFooter.itemsPerPageText") }}
                <v-select
                  v-model.number="itemsPerPage"
                  :items="itemsPerPageArray"
                  hide-details
                />
              </div>
              <v-pagination
                v-model="routePage"
                :length="pageCount"
                class="v-data-footer__icons-before"
                circle
                :total-visible="7"
              />
            </div>
          </template>
          <template #no-data>
            <v-empty-state
              v-if="!!query"
              :icon="noResultsIcon"
              :label="$t(noResultsLabel)"
              :description="$t(noResultsDescription, { query })"
            >
              <i18n tag="p" class="grey--text" path="emptyState.suggestions" />
              <ul>
                <i18n path="emptyState.0" tag="li" class="caption" />
                <i18n path="emptyState.1" tag="li" class="caption" />
                <i18n path="emptyState.2" tag="li" class="caption" />
              </ul>
            </v-empty-state>
            <v-empty-state
              v-else
              :icon="noDataIcon"
              :label="$t(noDataLabel)"
              :description="$t(noDataDescription)"
            >
              <slot name="empty-state-no-data" :refresh="onRefresh" />
            </v-empty-state>
          </template>
          <template #no-results>
            <v-empty-state
              :icon="noResultsIcon"
              :label="$t(noResultsLabel)"
              :description="$t(noResultsDescription, { query })"
            >
              <i18n tag="p" class="grey--text" path="emptyState.suggestions" />
              <ul>
                <i18n path="emptyState.0" tag="li" class="caption" />
                <i18n path="emptyState.1" tag="li" class="caption" />
                <i18n path="emptyState.2" tag="li" class="caption" />
              </ul>
            </v-empty-state>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card-text>
    <v-card-text v-if="$slots.afterTable">
      <slot name="afterTable" />
    </v-card-text>
    <template #afterRow>
      <slot name="dialogs" />
      <v-form-dialog
        ref="formDialog"
        :fullscreen="fullscreenForm"
        use-i18n
        :title="form[itemKey] ? 'buttons.Update' : 'buttons.Create'"
        :max-width="maxWidthForm"
        @close:dialog="closeDialog"
      >
        <slot
          name="form"
          :model="form ? form.data() : model.data()"
          :open="selectedOpen"
          :refresh="refresh"
        />
      </v-form-dialog>
      <v-check-dialog ref="confirmDialog">
        <i18n path="dialogs.delete" />
      </v-check-dialog>
      <v-check-dialog
        v-if="showHelpButton"
        width="600"
        ref="helpDialog"
        title="buttons.Help"
        toolbar-color="primary"
        :show-btn="false"
        use-i18n
      >
        <help-accordion>
          <template v-if="$slots['card-tutorial']" #tutorial-panel>
            <slot name="card-tutorial"></slot>
          </template>
        </help-accordion>
      </v-check-dialog>
    </template>
  </dashboard-card-view>
</template>

<script>
import FileSaver from "file-saver";
import Request from "@/util/Request";
import Base64ToBlob from "@/util/Base64ToBlob";
import { Arrow } from "@/plugins/Arrow";
import { sync, dispatch } from "vuex-pathify";
import { Model } from "@/models/Model";
export default {
  name: "MaterialDataTableCard",
  props: {
    fullscreenForm: Boolean,
    itemKey: {
      type: String,
      default: "id",
    },
    // Card
    cardTitleI18n: {
      type: String,
      default: undefined,
    },
    cardTitle: {
      type: String,
      default: undefined,
    },
    cardIcon: {
      type: String,
      default: "mdi-card-text-outline",
    },
    cardToolbarActions: {
      type: [Array, Object],
      default: () => [],
    },
    // Buttons
    showHelpButton: {
      type: Boolean,
      default: true,
    },
    showCreateButton: {
      type: Boolean,
      default: true,
    },
    showExportButton: {
      type: Boolean,
      default: true,
    },
    showRefreshButton: {
      type: Boolean,
      default: true,
    },
    showUpdateButton: {
      type: Boolean,
      default: true,
    },
    showHistoryButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
    showSearchInput: {
      type: Boolean,
      default: true,
    },
    showActionsAsMenu: {
      type: Boolean,
      default: false,
    },
    // Table
    storagePath: {
      type: String,
      required: true,
    },
    model: {
      type: Object,
      required: true,
      validator(model) {
        return model instanceof Model;
      },
    },
    customExpanded: {
      type: Boolean,
      default: false,
    },
    itemsPerPageArray: {
      type: Array,
      default: () => [10, 30, 30, 50, 100],
      validator(array) {
        return array.some(
          (value) => parseInt(value) > 0 && parseInt(value) < 101
        );
      },
    },
    additionalParams: {
      type: Object,
      default: () => ({}),
    },
    hasDataTableActions: {
      type: Boolean,
      default: true,
    },
    dataTableActions: {
      type: [Array, Object],
      default: () => [],
    },
    indexMethod: {
      type: String,
      default: "index",
    },
    createMethod: {
      type: String,
      default: "store",
    },
    updateMethod: {
      type: String,
      default: "update",
    },
    exportMethod: {
      type: String,
      default: "export",
    },
    destroyMethod: {
      type: String,
      default: "destroy",
    },
    // EmptyState
    noDataIcon: {
      type: String,
      default: "mdi-clipboard-text-off-outline",
    },
    noDataLabel: {
      type: String,
      default: "emptyState.noDataLabel",
    },
    noDataDescription: {
      type: String,
      default: "emptyState.noDataDescription",
    },
    noResultsIcon: {
      type: String,
      default: "mdi-alphabetical-off",
    },
    noResultsLabel: {
      type: String,
      default: "emptyState.noResultsLabel",
    },
    noResultsDescription: {
      type: String,
      default: "emptyState.noResultsDescription",
    },
    maxWidthForm: {
      type: [String, Number],
      default: 600,
    },
  },
  created() {
    this.form = this.model;
    if (this.isOlder) {
      this.onRefresh();
    } else if (this.page !== this.routePage && this.items.length > 0) {
      this.$router.push({
        query: { page: this.page },
      });
    } else {
      const max = Math.max(this.page, this.routePage);
      this.updateRoute(max <= this.pageCount ? max : 1);
    }
  },
  data: () => ({
    arrow: new Arrow(window, window.document, "primary"),
    form: null,
    loading: false,
    timeOut: null,
    timeOutDialog: null,
    selectedOpen: false,
  }),
  computed: {
    requested_at: sync(`api/:storagePath@requestedAt`),
    total: sync(`api/:storagePath@total`),
    pagination: sync(`api/:storagePath@pagination`),
    page: sync(`api/:storagePath@pagination.page`),
    itemsPerPage: sync(`api/:storagePath@itemsPerPage`),
    items: sync(`api/:storagePath@items`),
    params: sync(`api/:storagePath@params`),
    query: sync(`api/:storagePath@params.query`),
    headers: sync(`api/:storagePath@headers`),
    expanded: sync(`api/:storagePath@expanded`),
    pageCount: sync(`api/:storagePath@pageCount`),
    actions() {
      const items = [
        {
          icon: "mdi-plus",
          text: "buttons.Create",
          action: this.onCreate,
          show: this.showCreateButton,
        },
        {
          icon: "mdi-cloud-download",
          text: "buttons.Export",
          action: this.onExport,
          show: this.showExportButton,
        },
        ...this.cardToolbarActions,
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.onRefresh,
          show: this.showRefreshButton,
        },
        {
          icon: "mdi-help-circle",
          text: "buttons.Help",
          action: this.onHelp,
          show: this.showHelpButton,
        },
      ];
      return this.$vuetify.breakpoint.mdAndUp
        ? items.filter((item) => item.show)
        : [];
    },
    tableActions() {
      const items = [
        ...this.dataTableActions,
        {
          icon: "mdi-pencil",
          title: "buttons.Update",
          action: this.onUpdate,
          show: this.showUpdateButton,
        },
        {
          icon: "mdi-close",
          title: "buttons.Delete",
          action: this.onDelete,
          show: this.showDeleteButton,
        },
      ];
      return items.filter((item) => item.show);
    },
    isOlder() {
      return (
        this.requested_at &&
        this.$moment(this.requested_at).isValid() &&
        this.$moment(this.requested_at)
          .add(15, "minutes")
          .isBefore(this.$moment())
      );
    },
    routePage: {
      get() {
        return parseInt(this.$route.query.page) || 1;
      },
      set(page) {
        this.updateRoute(page);
      },
    },
  },
  watch: {
    itemsPerPage() {
      this.updateRoute(1);
    },
    model(model) {
      this.form = model;
    },
  },
  methods: {
    updateRoute(page) {
      if (parseInt(this.routePage) !== page) {
        this.$router
          .push({
            query: { page },
          })
          .finally(() => {
            this.getData(page);
          });
      } else {
        this.getData(parseInt(this.routePage));
      }
    },
    getData(page = 1) {
      this.page = parseInt(page) || parseInt(this.routePage) || 1;
      this.start();
      this.params = {
        query: this.query,
        per_page: this.itemsPerPage,
        page: this.page,
        column: this.pagination.sortBy,
        order: this.pagination.sortDesc,
        ...this.additionalParams,
      };
      this.form[this.indexMethod]({ params: this.params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
          this.pageCount = response.meta.last_page;
          this.headers = response.details.headers;
          this.expanded = response.details.expanded || [];
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.stop();
        });
    },
    onRefresh() {
      dispatch("api/reset", this.storagePath).finally(() => {
        this.$nextTick(function () {
          this.updateRoute(1);
        });
      });
    },
    // Actions
    onHelp() {
      this.$refs.helpDialog.open();
    },
    onCreate() {
      const that = this;
      that.form = null;
      const open = () => {
        that.selectedOpen = true;
        that.form = that.model.clone();
        console.log(that.form);
        console.log(that.model);
        setTimeout(that.$refs.formDialog.open, 10);
      };

      if (that.selectedOpen) {
        that.form = that.model.clone();
        that.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    onUpdate(item) {
      const that = this;
      this.$emit("form:update", item);
      const open = () => {
        that.selectedOpen = true;
        that.form = that.model.clone(item);
        setTimeout(that.$refs.formDialog.open, 10);
      };

      if (that.selectedOpen) {
        that.selectedOpen = false;
        that.form = that.model.clone();
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    onDelete(item) {
      this.$refs.confirmDialog
        .open()
        .then((response) => {
          if (response) {
            if (item.id) {
              this.start();
              this.form[this.destroyMethod](item[this.itemKey])
                .then((response) => {
                  this.$snackbar.success(response.data);
                })
                .catch((errors) => {
                  this.$snackbar.error(errors.message);
                })
                .finally(() => {
                  this.stop();
                  this.getData();
                });
            }
          }
        })
        .catch(() => {});
    },
    onExport() {
      this.start();
      const params = {
        query: this.query,
        ...this.additionalParams,
      };
      const request = new Request(params);
      if (!request.anyFilled(request.keys())) {
        params.start_date = this.$moment()
          .startOf("month")
          .format("YYYY-MM-DD");
        params.final_date = this.$moment().endOf("month").format("YYYY-MM-DD");
      }
      this.form[this.exportMethod]({ params })
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
          this.stop();
        });
    },
    onSearch() {
      this.updateRoute(1);
    },
    onClearSearch() {
      const that = this;
      this.timeOut = setTimeout(function () {
        that.updateRoute(1);
      }, 200);
    },
    onClose() {
      const that = this;
      this.getData();
      this.timeOutDialog = setTimeout(function () {
        console.log("Timeout");
        that.selectedOpen = false;
        that.$refs.formDialog.close();
      }, 800);
    },
    refresh() {
      console.log("Refresh");
      this.onClose();
    },
    closeDialog() {
      this.selectedOpen = false;
      this.form.reset();
      this.form = this.model.clone();
    },
    start() {
      this.loading = true;
    },
    stop() {
      this.loading = false;
    },
  },
  beforeDestroy() {
    this.form = null;
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (this.timeOutDialog) {
      clearTimeout(this.timeOutDialog);
    }
  },
};
</script>
