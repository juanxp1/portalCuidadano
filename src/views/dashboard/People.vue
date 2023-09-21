<template>
  <material-data-table-card
    ref="datatable"
    storage-path="profiles"
    :model="form"
    card-icon="mdi-account-multiple"
    card-title-i18n="router.people"
    max-width-form="100%"
    :show-export-button="false"
    show-actions-as-menu
    :show-search-input="false"
    fullscreen-form
  >
    <template #card-tutorial>
      <beneficiary-help />
    </template>
    <template #prepend-action-menu="{ item }">
      <app-item
        :item="{
          icon: 'mdi-text',
          title: 'buttons.Details',
          to: { name: 'Person', params: { id: item.id } },
        }"
      />
      <v-list-item @click="onComment(item)">
        <v-list-item-icon>
          <v-badge
            color="red"
            :content="item.observations_count"
            overlap
            :value="item.observations_count"
          >
            <v-icon>mdi-comment-text-multiple-outline</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="menu.ViewObservations" />
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="onFiles(item)">
        <v-list-item-icon>
          <v-badge
            :color="fileColor(item)"
            :content="fileValue(item)"
            overlap
            :value="fileValue(item)"
          >
            <v-icon>mdi-file-document-multiple-outline</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="menu.ViewAttachment" />
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="onActivities(item)">
        <v-list-item-icon>
          <v-badge
            :color="item.activities_count > 0 ? 'green' : 'red'"
            :content="item.activities_count"
            overlap
            :value="item.activities_count"
          >
            <v-icon>mdi-soccer</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>
          <i18n path="menu.ViewActivities" />
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #[`item.status`]="{ item }">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-avatar
            :aria-label="item.status"
            :color="item.color"
            size="15"
            v-on="on"
          />
        </template>
        <span v-text="item.status" />
      </v-tooltip>
    </template>
    <template #[`item.profile_type`]="{ item }">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-icon :aria-label="item.profile_type" v-on="on">
            {{
              item.profile_type_id === 1
                ? "mdi-human-male-female"
                : "mdi-human-capacity-decrease"
            }}
          </v-icon>
        </template>
        <span v-text="item.profile_type" />
      </v-tooltip>
    </template>
    <template #form="{ refresh, open, model }">
      <beneficiary-form v-if="open" :form-data="model" @success="refresh" />
    </template>
    <template #dialogs>
      <v-check-dialog
        ref="observationDialog"
        toolbar-color="primary"
        title="menu.Observations"
        :show-btn="false"
        width="600"
      >
        <v-observations v-if="selectedItem.id" :profile-id="selectedItem.id" />
      </v-check-dialog>
      <v-check-dialog
        ref="profileActivitiesDialog"
        toolbar-color="primary"
        title="menu.ViewActivities"
        :show-btn="false"
        width="600"
      >
        <v-user-activities
          v-if="selectedItem.id"
          :profile-id="selectedItem.id"
        />
      </v-check-dialog>
      <v-check-dialog
        ref="attachmentsDialog"
        toolbar-color="primary"
        title="menu.Attachment"
        :show-btn="false"
        width="600"
      >
        <v-attachments v-if="selectedItem.id" :profile-id="selectedItem.id" />
      </v-check-dialog>
    </template>
  </material-data-table-card>
</template>

<script>
import BeneficiaryHelp from "@/pages/help/BeneficiaryHelp.md";
import { get } from "lodash";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import BeneficiaryForm from "@/components/custom/forms/BeneficiaryForm";
export default {
  name: "DashboardPeople",
  components: {
    BeneficiaryForm,
    BeneficiaryHelp: BeneficiaryHelp.vue.component,
  },
  data: () => ({
    form: new Beneficiary(),
    selectedItem: {},
  }),
  methods: {
    onComment(item) {
      const that = this;
      this.selectedItem = {};
      this.$nextTick(function () {
        that.selectedItem = item;
        that.$refs.observationDialog.open().catch(() => {
          that.selectedItem = {};
        });
      });
    },
    onFiles(item) {
      const that = this;
      this.selectedItem = {};
      this.$nextTick(function () {
        that.selectedItem = item;
        that.$refs.attachmentsDialog.open().catch(() => {
          that.selectedItem = {};
        });
      });
    },
    onActivities(item) {
      const that = this;
      this.selectedItem = {};
      this.$nextTick(function () {
        that.selectedItem = item;
        that.$refs.profileActivitiesDialog.open().catch(() => {
          that.selectedItem = {};
        });
      });
    },
    fileColor(item) {
      const files = parseInt(get(item, "files_count"));
      const pendingFiles = parseInt(get(item, "pending_files_count"));
      const result = files - pendingFiles;
      return result === 0 ? "green" : "red";
    },
    fileValue(item) {
      const files = parseInt(get(item, "files_count"));
      const pendingFiles = parseInt(get(item, "pending_files_count"));
      const result = files - pendingFiles;
      return result === 0 ? files : pendingFiles;
    },
  },
};
</script>
