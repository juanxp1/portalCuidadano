<template>
  <v-card flat color="transparent" class="mt-sm-8 mt-md-5">
    <div class="card-padding pb-0">
      <router-link :to="{ name: 'Home' }">
        <v-icon color="text-primary text-gradient" size="100">
          $vuetify.icons.idrd_logo_color
        </v-icon>
      </router-link>
      <i18n
        tag="h3"
        class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
        path="login.title"
      />
      <i18n tag="p" class="mb-0 text-body" path="login.description" />
      <router-link :to="{ name: 'Register' }">
        <i18n
          tag="p"
          class="mb-0 mt-2 primary--text font-weight-bold"
          path="login.sign_up"
        />
      </router-link>
    </div>
    <div class="card-padding pb-4">
      <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
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
          <v-validation-provider
            v-slot="{ errors }"
            :rules="form.validations.input_password_required"
            vid="password"
            :name="$t('input.password').toLowerCase()"
          >
            <v-text-field
              v-model="form.password"
              :error-messages="errors"
              clearable
              counter
              :loading="loading"
              :disabled="loading"
              :maxlength="32"
              autocomplete="current-password"
              required="required"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
              :label="$t('input.password')"
              prepend-icon="mdi-lock-outline"
              @click:append="show = !show"
            />
          </v-validation-provider>
          <app-btn
            :loading="loading"
            :disabled="loading"
            type="submit"
            color="primary"
            class="mt-sm-3 mb-5"
            block
            path="buttons.Login"
          />
        </v-form>
      </v-validation-observer>
      <router-link :to="{ name: 'Forgot' }">
        <i18n tag="span" class="caption primary--text" path="login.forgot" />
      </router-link>
      <!--
      <i18n
        tag="h5"
        class="text-center text-border grey--text mt-4 mb-3"
        path="login.social"
      />
      <div class="d-flex justify-space-around align-center mx-10">
        <facebook-login
          :loading="loading"
          :disabled="loading"
          :aria-label="$t('buttons.SignInWithFacebook')"
          @success="onSocial"
        />
        <google-login
          :loading="loading"
          :disabled="loading"
          :aria-label="$t('buttons.SignInWithGoogle')"
          @success="onSocial"
        />
      </div>
      -->
    </div>
  </v-card>
</template>
<script>
import { dispatch } from "vuex-pathify";
import { User } from "@/models/services/User";
export default {
  name: "LoginView",
  data: () => ({
    show: false,
    loading: false,
    form: new User({
      email: null,
      password: null,
    }),
  }),
  methods: {
    onSubmit() {
      this.loading = true;
      this.$auth
        .login(this.form.data())
        .then((response) => {
          dispatch("auth/setToken", response)
            .then(() => {
              this.axios.defaults.headers.common[
                "Authorization"
              ] = `${response.token_type} ${response.access_token}`;
            })
            .finally(() => {
              this.getUser();
            });
        })
        .catch((errors) => {
          delete this.axios.defaults.headers.common["Authorization"];
          this.form.setFormInstance(this.$refs.basic);
          this.form.onFail(errors);
          this.$snackbar.error(errors.message);
          dispatch("auth/logout");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSocial(token, provider) {
      const params = {
        email: null,
        password: null,
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET,
        grant_type: "social",
        provider,
        access_token: token,
      };
      this.form = new User(params);
      this.form
        .social()
        .then((response) => {
          dispatch("auth/setToken", response)
            .then(() => {
              this.axios.defaults.headers.common[
                "Authorization"
              ] = `${response.token_type} ${response.access_token}`;
            })
            .finally(() => {
              this.getUser();
            });
        })
        .catch((errors) => {
          delete this.axios.defaults.headers.common["Authorization"];
          this.$snackbar.error(errors.message);
          dispatch("auth/logout");
        });
    },
    getUser() {
      this.form
        .index()
        .then((response) => {
          dispatch("auth/setUser", response.data);
          return response.data;
        })
        .then((user) => {
          if (user.email_verified_at) {
            if (this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect);
            } else if (user.profile && !user.profile.document) {
              this.$router.push({
                name: "Profile",
                params: { complete: true },
              });
            } else {
              this.$router.push({
                name: "Dashboard",
              });
            }
          } else {
            this.$router.push({
              name: "Verify",
              query: this.$route.query,
            });
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
          dispatch("auth/logout");
        });
    },
  },
};
</script>
