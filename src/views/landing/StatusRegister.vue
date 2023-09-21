<template>
  <details-page height="500" title="Estado de Registro">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
            <v-form @submit.prevent="handleSubmit(onSubmit)">
              <v-row dense>
                <v-col cols="12" md="5" sm="12">
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="form.validations.input_email_required"
                    vid="email"
                    :name="$t('input.email').toLowerCase()"
                  >
                    <v-text-field
                      v-model="form.email"
                      type="email"
                      required="required"
                      :error-messages="errors"
                      clearable
                      counter
                      :loading="loading"
                      :disabled="loading"
                      :maxlength="191"
                      autocomplete="off"
                      :label="$t('input.email')"
                      prepend-icon="mdi-email"
                    />
                  </v-validation-provider>
                </v-col>
                <v-col cols="12" md="5" sm="12">
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="form.validations.input_document_required"
                    vid="document"
                    :name="'Número de documento'.toLowerCase()"
                  >
                    <v-text-field
                      v-model="form.document"
                      type="email"
                      required="required"
                      :error-messages="errors"
                      clearable
                      counter
                      :loading="loading"
                      :disabled="loading"
                      :maxlength="12"
                      autocomplete="off"
                      label="Número de documento"
                      prepend-icon="mdi-numeric"
                    />
                  </v-validation-provider>
                </v-col>
                <v-col cols="12" md="2" sm="12" class="text-center center-text">
                  <v-btn type="submit" color="primary">Consultar</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-validation-observer>
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader
            type="list-item-avatar-three-line@6"
            :loading="loading"
          >
            <v-list three-line>
              <v-list-item v-for="(status, i) in results" :key="i">
                <v-list-item-avatar class="hidden-sm-and-down">
                  <v-avatar color="primary">
                    <v-icon dark>mdi-information</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="status.status" />
                  <v-list-item-subtitle
                    v-if="!!status.created_at"
                    class="caption"
                    v-text="status.created_at"
                  />
                  <v-list-item-subtitle>
                    <app-md v-text="status.details" />
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="!!status.action">
                    <v-btn
                      x-small
                      color="primary"
                      :to="status.action.to"
                      v-text="status.action.text"
                    />
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </details-page>
</template>

<script>
import { RegisterStatus } from "@/models/services/portal/RegisterStatus";

export default {
  name: "StatusRegister",
  data: () => ({
    form: new RegisterStatus(),
    results: [],
    loading: false,
  }),
  methods: {
    onSubmit() {
      this.results = [];
      this.loading = true;
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .index({
          params: this.form.data(),
        })
        .then((response) => {
          this.results = response.data;
        })
        .catch((errors) => {
          this.$snackbar.add({
            color: "error",
            icon: "mdi-bell-plus",
            message: errors.message,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped></style>
