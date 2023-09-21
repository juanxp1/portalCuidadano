<template>
  <v-card flat color="transparent" class="mt-sm-8 mt-md-5">
    <div class="card-padding pb-0">
      <v-icon color="text-primary text-gradient" size="100">
        $vuetify.icons.idrd_logo_color
      </v-icon>
      <i18n
        tag="h3"
        class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
        path="register.title"
      />
      <i18n tag="p" class="mb-0 text-body" path="register.description" />
      <router-link :to="{ name: 'Login' }">
        <i18n
          tag="p"
          class="mb-0 mt-2 primary--text font-weight-bold"
          path="register.account"
        />
      </router-link>
    </div>
    <div class="pb-4">
      <v-card flat color="transparent" id="register-form">
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card
            :elevation="hover ? 16 : 2"
            height="50"
            class="d-flex align-center mt-5"
            @click="register = true"
          >
            <div class="flex-grow-1 text-center">
              <v-icon left>mdi-email</v-icon>
              Registrarme con correo y contraseña
            </div>
          </v-card>
        </v-hover>
        <i18n
          tag="h4"
          class="text-center text-border grey--text mt-4 mb-3"
          path="o"
        />
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card
            :elevation="hover ? 16 : 2"
            height="50"
            class="d-flex align-center mt-3"
            @click="registerCode = true"
          >
            <div class="flex-grow-1 text-center">
              <v-icon left>mdi-numeric</v-icon>
              Ya tengo un código, continuar con mi registro
            </div>
          </v-card>
        </v-hover>
        <v-card-actions class="text-center align-center">
          <router-link :to="{ name: 'StatusRegister' }">
            <i18n
              tag="p"
              class="mb-0 mt-2 text-center primary--text font-weight-bold"
              path="¿No recibiste el código?"
            />
          </router-link>
        </v-card-actions>
      </v-card>
      <!--
      <div
        id="social-register"
        class="d-flex justify-space-around align-center mx-10"
      >
        <facebook-login
          :aria-label="$t('buttons.SignUpWithFacebook')"
          @success="onSocial"
        />
        <google-login
          :aria-label="$t('buttons.SignUpWithGoogle')"
          @success="onSocial"
        />
      </div>
      -->
    </div>
    <v-dialog v-model="register" fullscreen>
      <v-card flat>
        <v-card-title>
          <i18n
            tag="h3"
            class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
            path="register.title"
          />
          <v-spacer />
          <v-btn icon @click="register = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-register-form @on-code="onCode" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="registerCode" fullscreen>
      <v-card flat>
        <v-card-title>
          <i18n
            tag="h3"
            class="text-h3 font-weight-bolder text-primary text-gradient mb-2"
            path="register.title"
          />
          <v-spacer />
          <v-btn icon @click="registerCode = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="registerCode">
          <v-complete-register-form :pre-data="form" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { dispatch } from "vuex-pathify";
import { User } from "@/models/services/User";
export default {
  name: "RegisterView",
  props: {
    email: {
      type: String,
      default: undefined,
    },
    code: {
      type: [String, Number],
      default: undefined,
    },
  },
  data: () => ({
    registerCode: false,
    register: false,
    dialog: false,
    loading: false,
    show: false,
    form: {},
  }),
  mounted() {
    if (this.email && this.code) {
      this.onCode({
        email: this.email,
      });
    }
  },
  methods: {
    // Social
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
            if (user.profile && !user.profile.document) {
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
            });
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
          dispatch("auth/logout");
        });
    },
    onCode(data) {
      this.form = {};
      if (data.email) {
        this.form = data;
      }
      const that = this;
      setTimeout(function () {
        that.registerCode = true;
      }, 300);
    },
  },
};
</script>
