<template>
  <v-card :max-width="$vuetify.breakpoint.smAndDown ? '' : 500">
    <v-toolbar dark color="primary">
      <v-avatar v-if="endowment.endowment_id" size="50">
        <v-img
          eager
          :lazy-src="`${baseIcon}${endowment.endowment_id}.png`"
          :src="`${baseIcon}${endowment.endowment_id}.png`"
          :alt="endowment.endowment"
        ></v-img>
      </v-avatar>
      <v-toolbar-title v-if="$vuetify.breakpoint.smAndDown" class="ml-3">
        {{ endowment.id }}
      </v-toolbar-title>
      <v-toolbar-title class="ml-3" v-else>
        {{ endowment.id }} - {{ endowment.endowment }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!endowment.for_booking"
        :aria-label="$t('input.reserve')"
        text
        :to="url"
      >
        <v-icon left size="44">$vuetify.icons.pse</v-icon>
        {{ $t("input.reserve") }}
      </v-btn>
      <v-btn :aria-label="$t('buttons.exit')" icon @click="onClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col v-if="short" cols="12">
          <v-card flat>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text-h5 mb-2"
                  v-text="endowment.endowment"
                />
                <v-card-subtitle v-text="endowment.equipment" />
                <v-card-text class="caption" v-text="endowment.description" />
                <slot></slot>
              </div>
              <v-avatar class="ma-3" size="125" tile>
                <v-img
                  :src="endowment.image"
                  aspect-ratio="16/9"
                  class="rounded"
                  :alt="endowment.endowment"
                  :eager="true"
                  :lazy-src="endowment.image"
                >
                  <template #placeholder>
                    <v-img
                      max-height="400"
                      :src="defaultPhoto"
                      :lazy-src="defaultPhoto"
                      aspect-ratio="16/9"
                      class="rounded"
                      alt="No Image"
                    />
                  </template>
                </v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
        <v-col v-else cols="12">
          <endowment-item :item="endowment" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "EndowmentComponent",
  props: {
    short: {
      type: Boolean,
      default: true,
    },
    resource: {
      type: [Object],
      default: () => ({}),
    },
    onClose: {
      type: [Function],
      default: () => ({}),
    },
  },
  data: () => ({
    baseIcon:
      "https://sim1.idrd.gov.co/SIM/Parques/ParquesPublico/public/Img/iconosDeportivos/",
    img: "",
    endowment: {},
    hideLottie: true,
    defaultPhoto: require("@/assets/img/error/no_image.png"),
  }),
  created() {
    this.endowment = this.resource;
  },
  mounted() {
    this.endowment = this.resource;
    this.$nextTick(function () {
      this.onReload();
    });
  },
  methods: {
    onReload: function () {
      this.endowment = {};
      this.$nextTick(function () {
        this.endowment = this.resource;
        this.endowment = this.resource;
      });
    },
  },
  watch: {
    resource: function (data) {
      this.endowment = data;
    },
  },
  computed: {
    url() {
      if (this.endowment.id) {
        const to = {
          name: "BookingDates",
          params: { id: this.endowment.id, item: this.endowment },
        };
        const href = {
          name: "Login",
          query: {
            redirect: this.$router.resolve(to).route.path,
          },
        };
        return this.$auth.isLoggedIn() ? to : href;
      } else {
        return undefined;
      }
    },
  },
};
</script>

<style scoped></style>
