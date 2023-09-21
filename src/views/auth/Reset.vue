<template>
  <v-card flat color="transparent" class="mt-sm-8 mt-md-5">
    <div class="card-padding pb-0">
      <v-icon color="text-primary text-gradient" size="100">
        $vuetify.icons.idrd
      </v-icon>
      <i18n
        tag="h3"
        class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
        path="reset.title"
      />
      <i18n tag="p" class="mb-0 text-body" path="reset.description" />
    </div>
    <div class="card-padding pb-4">
      <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-card-text class="text-center">
            <v-validation-provider
              v-slot="{ errors }"
              :rules="form.validations.input_password_required"
              vid="password"
              :name="$t('input.password').toLowerCase()"
            >
              <v-text-field
                v-model="form.password"
                type="password"
                :error-messages="errors"
                clearable
                counter
                :loading="loading"
                :disabled="loading"
                :maxlength="32"
                autocomplete="new-password"
                required="required"
                :type="show ? 'text' : 'password'"
                :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                :label="$t('input.password')"
                prepend-icon="mdi-lock-outline"
                @click:append="show = !show"
              />
            </v-validation-provider>
            <v-validation-provider
              v-slot="{ errors }"
              :rules="form.validations.input_password_confirmation('password')"
              vid="password_confirmation"
              :name="$t('input.password_confirmation').toLowerCase()"
            >
              <v-text-field
                v-model="form.password_confirmation"
                type="password"
                :error-messages="errors"
                clearable
                counter
                :loading="loading"
                :disabled="loading"
                :maxlength="32"
                autocomplete="new-password"
                required="required"
                :type="show ? 'text' : 'password'"
                :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                :label="$t('input.password_confirmation')"
                prepend-icon="mdi-lock-outline"
                @click:append="show = !show"
              />
            </v-validation-provider>
            <app-btn
              large
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="loading"
              block
              path="buttons.Send"
            />
          </v-card-text>
        </v-form>
      </v-validation-observer>
    </div>
  </v-card>
</template>

<script>
import { has } from "lodash";
import { User } from "@/models/services/User";
export default {
  name: "ResetView",
  data: (vm) => ({
    show: false,
    loading: false,
    form: new User({
      token: vm.$route.query.token,
      email: vm.$route.query.email,
      password: null,
      password_confirmation: null,
    }),
  }),
  beforeRouteEnter(to, from, next) {
    if (has(to, "query.token") && has(to, "query.email")) {
      next();
    } else {
      next({ name: "Home" });
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.form
        .resetPassword()
        .then((response) => {
          const that = this;
          this.$snackbar.add({
            color: "success",
            icon: "mdi-bell-plus",
            message: response.data,
          });
          setTimeout(function () {
            that.$router.push({
              name: "Login",
            });
          }, 1000);
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
