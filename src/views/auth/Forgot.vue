<template>
  <v-card flat color="transparent" class="mt-sm-8 mt-md-5">
    <div class="card-padding pb-0">
      <v-icon color="text-primary text-gradient" size="100">
        $vuetify.icons.idrd
      </v-icon>
      <i18n
        tag="h3"
        class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
        path="forgot.title"
      />
      <i18n tag="p" class="mb-0 text-body" path="forgot.description">
        <br />
      </i18n>
    </div>
    <div class="card-padding pb-4">
      <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-card-text class="text-center">
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
            <app-btn
              type="submit"
              color="primary"
              class="mt-sm-3"
              dark
              block
              tile
              path="buttons.Send"
            />
          </v-card-text>
        </v-form>
      </v-validation-observer>
      <i18n
        tag="h5"
        class="text-center text-border grey--text mt-4 mb-3"
        path="forgot.social"
      />
      <div class="d-flex justify-space-around align-center mx-10">
        <app-btn
          color="primary"
          class="mt-sm-3 mb-5"
          text
          block
          tile
          path="buttons.Login"
          :to="{ name: 'Login' }"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
import { User } from "@/models/services/User";
export default {
  name: "ForgotView",
  data: () => ({
    show: false,
    loading: false,
    form: new User({
      email: null,
    }),
  }),
  methods: {
    onSubmit() {
      this.loading = true;
      this.form.setFormInstance(this.$refs.basic);
      this.form
        .forgotPassword()
        .then((response) => {
          this.$snackbar.success(response.data);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
