<template>
  <info-content
    text-center
    icon="mdi-barcode-scan"
    icon-color="default"
    :subtitle="$t('scan.title')"
    class="mt-12"
  >
    <v-card-text>
      <i18n tag="p" path="scan.text" />
      <v-img
        contain
        :src="documentFile"
        :lazy-src="documentFile"
        class="mt-2"
        max-height="150px"
        :alt="$t('card.document')"
      />
    </v-card-text>
    <v-card-text v-if="error">
      <v-alert dense outlined type="error">
        {{ error }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-dialog
        v-model="document"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp"
            small
            class="mx-2"
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small left>mdi-file</v-icon>
            <i18n path="scan.load" />
          </v-btn>
          <v-btn
            v-else
            fab
            class="mx-2"
            color="primary"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-file</v-icon>
          </v-btn>
        </template>
        <v-card flat>
          <v-toolbar color="primary">
            <v-toolbar-title class="white--text">
              <i18n path="scan.scan" />
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <app-btn
              path="buttons.Close"
              icon
              dark
              icon-text="mdi-close"
              @click="document = false"
            />
          </v-toolbar>
          <v-card-text class="mt-12 text-center">
            <i18n tag="p" path="scan.app">
              <app-btn
                slot="app"
                text
                x-small
                target="_blank"
                color="primary"
                href="https://acrobat.adobe.com/la/es/acrobat/mobile/scanner-app.html"
                icon-text="mdi-open-in-new"
                path="Adobe Scan"
              />
            </i18n>
            <v-bar-code class="mt-2" />
            <v-document-image-reader
              v-if="document"
              @decode="onDecode"
              @error="onError"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-spacer />
    </v-card-actions>
    <v-card-text>
      <i18n tag="p" class="caption" path="scan.app">
        <app-btn
          slot="app"
          text
          x-small
          target="_blank"
          color="primary"
          href="https://acrobat.adobe.com/la/es/acrobat/mobile/scanner-app.html"
          icon-text="mdi-open-in-new"
          path="Adobe Scan"
        />
      </i18n>
    </v-card-text>
  </info-content>
</template>

<script>
export default {
  name: "VCardScanner",
  data: () => ({
    decode: {},
    file: null,
    document: false,
    error: null,
    documentFile: require("@/assets/img/dashboard/barcode/documento.png"),
  }),
  methods: {
    onDecode(data, file) {
      this.file = file;
      this.decode = data;
    },
    onError(message, file) {
      this.file = file;
      this.document = false;
      this.error = message;
      this.$snackbar.error(message);
    },
  },
};
</script>
