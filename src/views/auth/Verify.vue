<template>
  <v-card flat color="transparent" class="mt-sm-8 mt-md-5">
    <div class="card-padding pb-0 text-center">
      <i18n
        tag="h3"
        class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
        path="verify.title"
      />
      <i18n tag="p" class="mb-0 text-body" path="verify.description" />
    </div>
    <div class="card-padding pb-4">
      <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-card-text class="text-center">
            <i18n tag="p" class="text-body" path="label.verify">
              <template #email>
                {{ email }}
              </template>
            </i18n>
            <v-otp-input
              v-model="code"
              length="6"
              :readonly="loading"
              v-number-only
              @finish="onSubmit"
            />
            <v-animation
              height="200"
              width="200"
              auto-play
              loop
              :animation-data="animationSuccess"
            />
            <i18n class="caption" tag="span" path="label.verify_resend" />
          </v-card-text>
          <v-card-actions class="text-center justify-center">
            <app-btn
              :aria-label="$t('buttons.Exit')"
              outlined
              color="error"
              :loading="loading"
              :disabled="loading"
              v-text="$t('buttons.Exit')"
              @click="onLogout"
            />
            <app-btn
              :aria-label="$t('buttons.Resend')"
              outlined
              color="primary"
              :loading="loading"
              :disabled="loading"
              depressed
              v-text="$t('buttons.Resend')"
              @click="onResend"
            />
          </v-card-actions>
        </v-form>
      </v-validation-observer>
    </div>
  </v-card>
</template>

<script>
import { has } from "lodash";
import { dispatch, get } from "vuex-pathify";
import * as email from "@/assets/anims/email.json";
import * as loading from "@/assets/anims/loading.json";
import { User } from "@/models/services/User";
export default {
  name: "VerifyView",
  computed: {
    email: get("auth/user@email"),
  },
  directives: {
    "number-only": {
      bind(el) {
        function checkValue(event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, "");
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true;
          }
          event.preventDefault();
        }
        el.addEventListener("keypress", checkValue);
      },
    },
  },
  data: () => ({
    code: null,
    show: false,
    loading: false,
    user: new User(),
    animationLoading: loading.default,
    animationSuccess: email.default,
    timeout: null,
  }),
  methods: {
    onSubmit() {
      this.loading = true;
      this.user
        .verify(this.code)
        .then((response) => {
          this.$snackbar.success(response.data);
          this.onRedirect(response.details);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
          if (has(errors, "details.email_verified_at")) {
            this.onRedirect(errors.details);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onResend() {
      this.loading = true;
      this.user
        .resendVerification()
        .then((response) => {
          this.$snackbar.success(response.data);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
          if (has(errors, "details.email_verified_at")) {
            this.onRedirect(errors.details);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onLogout() {
      this.$auth
        .logout()
        .catch()
        .finally(() => {
          this.$router.push({
            name: "Login",
          });
        });
    },
    onRedirect(data) {
      dispatch("auth/setUser", data).then(() => {
        const that = this;
        this.timeout = setTimeout(function () {
          if (that.$route.query.redirect) {
            that.$router.push(that.$route.query.redirect);
          } else {
            that.$router.push({
              name: "Dashboard",
            });
          }
        }, 600);
      });
    },
  },
  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },
};
</script>

<style scoped></style>
