<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-bind="$attrs" depressed outlined color="grey" v-on="on">
        <v-icon>$vuetify.icons.google</v-icon>
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
      <app-btn color="primary" path="buttons.Accept" :href="path" />
    </terms-and-conditions>
  </v-dialog>
</template>

<script>
export default {
  name: "GoogleLogin",
  data: () => ({
    dialog: false,
    id: `google-sing-in-button`,
    provider: "google",
    path: `${process.env.VUE_APP_AUTH_SERVER}/api/auth/social`,
  }),
  mounted() {
    this.onToken();
  },
  methods: {
    handleCredentialResponse(response) {
      const that = this;
      that.$emit(
        response.credential ? "success" : "error",
        response.credential,
        that.provider
      );
    },
    onLoad() {
      const that = this;
      window.google.accounts.id.initialize({
        client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
        auto_select: false,
        context: "signin",
        ux_mode: "popup",
        response_type: "code",
        nonce: "biaqbm70g23",
        callback: that.handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById(that.id),
        {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: "100%",
        } // customization attributes
      );
      window.google.accounts.id.prompt(); // also display the One Tap dialog
    },
    onToken() {
      const token = this.$route.query.token;
      if (token) {
        this.$emit("success", token, this.provider);
      }
    },
  },
};
</script>
