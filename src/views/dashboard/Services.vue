<template>
  <dashboard-card-view
    card-icon="mdi-currency-usd"
    card-title-i18n="Otros Servicios"
    :loading="loading"
    :requested-at="requested_at"
  >
    <v-card-text>
      <p>
        Aquí podrás pagar en línea los servicios y espacios administrados por el
        IDRD de forma fácil y segura.
      </p>
      <v-select
        v-if="!!payment.document"
        id="profile"
        v-model="profile.profile_id"
        name="profile"
        :disabled="loading"
        :loading="loading"
        label="Selecciona quién tomará el servicio"
        :items="profiles"
        item-text="full_name"
        item-value="document"
        @change="onChangeProfile"
      >
        <template #item="{ item, on, attrs }">
          <v-list-item
            two-line
            :disabled="notAvailable(item)"
            v-on="on"
            v-bind="attrs"
          >
            <v-list-item-avatar>
              <v-icon>mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="`${item.name} ${item.surname}`" />
              <v-list-item-subtitle v-if="notAvailable(item)">
                <v-icon left x-small color="red">mdi-alert</v-icon>
                <span>El usuario debe tener los datos verificados.</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-pse-form
        v-if="!!payment.document"
        :payment="payment"
        :show-details="false"
        show-alert
        @success="onSuccess"
      />
      <v-row v-else>
        <v-col cols="12">
          <v-empty-state
            icon="mdi-currency-usd-off"
            :label="$t('dashboard.payments.emptyState.label')"
            :description="$t('dashboard.payments.emptyState.description')"
          >
            <v-btn
              :aria-label="`${$t('buttons.Update')} ${$t('router.profile')}`"
              color="primary"
              :to="{ name: 'Profile' }"
            >
              {{ `${$t("buttons.Update")} ${$t("router.profile")}` }}
            </v-btn>
          </v-empty-state>
        </v-col>
      </v-row>
    </v-card-text>
  </dashboard-card-view>
</template>

<script>
import { Booking } from "@/models/services/Booking";
import { Beneficiary } from "@/models/services/portal/Beneficiary";

export default {
  name: "ServicesView",
  data: () => ({
    loading: false,
    requested_at: null,
    booking: new Booking(),
    payment: {
      name: null,
      surname: null,
      document_type_id: null,
      document: null,
      email: null,
      phone: null,
      booking_id: null,
      amount: null,
      park_id: null,
      service_id: null,
      concept: null,
      person_type_id: null,
      bank_id: null,
      ip_address: null,
    },
    profile: new Beneficiary({
      profile_id: null,
    }),
    profiles: [],
  }),
  created() {
    this.onCreate();
    this.getProfiles();
  },
  methods: {
    onSuccess(response) {
      window.location.href = response.bank_url;
    },
    onCreate() {
      this.loading = true;
      this.booking
        .autocomplete()
        .then((response) => {
          this.payment = response.data;
          this.profile.profile_id = this.payment.document;
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getProfiles() {
      this.info = false;
      this.profile
        .profilesList()
        .then((response) => {
          const profiles = response.data.filter((p) => !!p.to_payment);
          this.profiles = profiles.map((p) => {
            return {
              ...p.to_payment,
              full_name: `${p.to_payment.name} ${p.to_payment.surname}`,
            };
          });
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    notAvailable(item) {
      return !item.verified;
    },
    onChangeProfile(document) {
      const principal_profile = this.profiles.filter((p) => p.principal)[0];
      const payer = {
        namePayer: principal_profile.name,
        lastNamePayer: principal_profile.surname,
        documentTypeSelectedPayer: principal_profile.document_type_id,
        documentPayer: principal_profile.document,
        emailPayer: principal_profile.email,
        phonePayer: principal_profile.phone,
      };
      if (document) {
        const profile = this.profiles.filter((p) => p.document === document);
        const data_to_merge = profile[0] ? profile[0] : {};
        this.payment = {
          ...this.payment,
          ...payer,
          ...data_to_merge,
        };
      } else {
        const data_to_merge = principal_profile[0] ? principal_profile[0] : {};
        this.payment = {
          ...this.payment,
          ...payer,
          ...data_to_merge,
        };
      }
    },
  },
};
</script>

<style scoped></style>
