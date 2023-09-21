<template>
  <material-data-table-card
    ref="subscription"
    storage-path="subscriptions"
    :model="model"
    card-icon="mdi-book"
    card-title-i18n="router.subscriptions"
    index-method="subscriptions"
    :show-create-button="false"
    :show-update-button="false"
    :show-export-button="false"
    :show-search-input="false"
    destroy-method="unsubscribe"
    item-key="citizen_schedule_id"
  >
    <template #card-tutorial>
      <activities-help />
    </template>
    <template #[`item.citizen_schedule_id`]="{ item }">
      <router-link
        :to="{
          name: 'SubscriptionDetails',
          params: { id: item.citizen_schedule_id },
        }"
        v-text="item.citizen_schedule_id"
      />
    </template>
    <template #[`item.is_paid`]="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            :color="item.is_paid ? 'primary' : ''"
            v-bind="attrs"
            v-on="on"
          >
            {{ item.is_paid ? "mdi-currency-usd" : "mdi-currency-usd-off" }}
          </v-icon>
        </template>
        <i18n :path="item.is_paid ? 'Yes' : 'No'" tag="span" />
      </v-tooltip>
    </template>
    <template #[`item.schedule_status_name`]="{ item }">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-avatar :color="item.schedule_status_color" size="15" v-on="on" />
        </template>
        <span v-text="item.schedule_status_name" />
      </v-tooltip>
    </template>
    <template #customExpanded="{ item, expanded }">
      <v-row v-for="(expanded_item, key) in expanded" :key="`expanded-${key}`">
        <v-col cols="12" sm="12" md="6">
          <div class="font-weight-bold">
            {{ expanded_item.text }}
          </div>
        </v-col>
        <v-col
          v-if="expanded_item.value === 'is_initiate'"
          cols="12"
          sm="12"
          md="6"
        >
          <i18n :path="item.is_initiate ? 'Yes' : 'No'" />
        </v-col>
        <v-col v-else cols="12" sm="12" md="6">
          {{ item[expanded_item.value] }}
        </v-col>
      </v-row>
    </template>
    <template #empty-state-no-data>
      <v-card-actions>
        <v-row dense no-gutters justify="center" align="center">
          <v-col cols="auto">
            <app-btn
              small
              class="mx-1 mb-2"
              color="primary"
              path="Buscar Actividades"
              :to="{ name: 'SportActivities' }"
            />
          </v-col>
        </v-row>
      </v-card-actions>
    </template>
    <template #prepend-action-menu="{ item }">
      <template v-if="!!item.citizen_schedule_payment_at">
        <v-form-dialog title="Comprobante de pago">
          <template #action="{ props }">
            <v-list-item v-on="props.on">
              <v-list-item-icon>
                <v-icon class="mx-auto" v-text="menu.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  class="text-capitalize"
                  v-text="$t(menu.title)"
                />
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-bank-attachment
            :profile-id="item.profile_id"
            :item="item"
            @success="$refs.subscription.onRefresh"
          />
        </v-form-dialog>
      </template>
    </template>
    <template #prepend-action-btn="{ item }">
      <template v-if="!!item.citizen_schedule_payment_at">
        <v-form-dialog title="Comprobante de pago">
          <template #action="{ props }">
            <app-btn icon color="success" :path="menu.title" v-on="props.on">
              <v-icon v-text="menu.icon" />
            </app-btn>
          </template>
          <v-bank-attachment
            :profile-id="item.profile_id"
            :item="item"
            @success="$refs.subscription.onRefresh"
          />
        </v-form-dialog>
      </template>
    </template>
  </material-data-table-card>
</template>

<script>
import ActivitiesHelp from "@/pages/help/ActivitiesHelp.md";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
export default {
  name: "DashboardSubscriptions",
  components: {
    ActivitiesHelp: ActivitiesHelp.vue.component,
  },
  data: () => ({
    show: true,
    model: new Beneficiary(),
  }),
  computed: {
    menu() {
      return {
        icon: "mdi-cash-multiple",
        title: "Realizar pago en línea o cargar comprobante",
      };
    },
  },
};
</script>
