<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-bind="$attrs" depressed outlined color="grey" v-on="on">
        <v-icon>$vuetify.icons.facebook</v-icon>
      </v-btn>
    </template>
    <terms-and-conditions>
      <template #header>
        <v-spacer />
        <app-btn
          path="buttons.Close"
          icon-text="mdi-close"
          icon
          @click="dialog = false"
        />
      </template>
      <v-spacer />
      <app-btn color="primary" path="buttons.Accept" @click="toggleLogin" />
    </terms-and-conditions>
  </v-dialog>
</template>

<script>
import { Sdk } from "@/util/facebook-sdk";
export default {
  inheritAttrs: false,
  name: "FacebookLogin",
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    appId: {
      type: String,
      default: process.env.VUE_APP_FACEBOOK_CLIENT_ID,
    },
    version: {
      type: String,
      default: "v13.0", // https://developers.facebook.com/docs/graph-api/changelog/
    },
    options: {
      type: Object,
      default: () => ({ cookie: true, xfbml: true, autoLogAppEvents: true }), // https://developers.facebook.com/docs/javascript/quickstart
    },
    loginOptions: {
      type: Object,
      default: () => ({ scope: "email,public_profile" }),
    },
    asyncDelay: {
      type: Number,
      default: 0,
    },
    sdkLocale: {
      type: String,
      default: "es_LA",
    },
  },
  data: () => ({
    error: null,
    working: true,
    dialog: false,
    connected: false,
  }),
  watch: {
    value({ error, working, connected }) {
      this.error = error;
      this.working = working;
      this.connected = connected;
    },
    // eslint-disable-next-line no-unused-vars
    scope({ login, logout, toggleLogin, ...restScope }) {
      this.$emit("input", restScope);
    },
  },
  async created() {
    window.fbLogin = this.toggleLogin;
    this.async(async () => {
      const { appId, version, options, sdkLocale } = this;
      const sdk = await Sdk.subscribe(
        { appId, version, ...options },
        sdkLocale
      );
      if (this.error) return void 0;
      this.$emit("sdk-init", { FB: sdk, scope: this.scope });
      const { status, authResponse } = await Sdk.getLoginStatus();
      if (Sdk.isConnected(status)) {
        this.connected = true;
        this.$emit(
          authResponse ? "success" : "error",
          authResponse.accessToken,
          "facebook"
        );
        this.$emit("login", authResponse, "facebook");
      }
    });
  },
  beforeDestroy() {
    Sdk.unsubscribe();
  },
  computed: {
    idle() {
      return !this.working && !this.hasError;
    },
    enabled() {
      return !this.disabled;
    },
    disabled() {
      return this.working || this.hasError || !this.appId;
    },
    disconnected() {
      return !this.connected;
    },
    hasError() {
      return Boolean(this.error);
    },
    scope() {
      return {
        idle: this.idle,
        error: this.error,
        hasError: this.hasError,
        login: this.login,
        logout: this.logout,
        working: this.working && !this.hasError,
        enabled: this.enabled,
        disabled: this.disabled,
        connected: this.connected,
        toggleLogin: this.toggleLogin,
        disconnected: this.disconnected,
      };
    },
  },
  methods: {
    toggleLogin() {
      this.connected ? this.logout() : this.login();
    },
    async login() {
      return this.async(async () => {
        const response = await Sdk.login(this.loginOptions);
        if (Sdk.isConnected(response.status)) {
          this.connected = true;
          this.$emit(
            response.authResponse ? "success" : "error",
            response.authResponse.accessToken,
            "facebook"
          );
          this.$emit("login", response, "facebook");
        }
        this.$emit("error", response);
        return response;
      });
    },
    async logout() {
      return this.async(async () => {
        const response = await Sdk.getLoginStatus();
        if (Sdk.isConnected(response.status)) await Sdk.logout();
        this.connected = false;
        this.$emit("logout", response, "facebook");
        console.log("Logout", response);
        return response;
      });
    },
    async async(asyncFn) {
      this.working = true;
      const promise = await asyncFn().catch(this.catchHandler);
      const delay = new Promise((resolve) =>
        setTimeout(resolve, this.asyncDelay)
      );
      const [, result] = await Promise.all([delay, promise]);
      this.working = false;
      return result;
    },
    catchHandler(error) {
      this.error = error;
      this.$emit("error", error);
      console.error(this.error); // eslint-disable-line no-console
    },
  },
};
</script>

<style scoped></style>
