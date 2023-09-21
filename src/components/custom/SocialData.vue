<template>
  <v-skeleton-loader
    :loading="finding"
    type="heading, list-item-avatar-three-line@6"
    width="100%"
  >
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :options.sync="pagination"
      item-key="id"
      :server-items-length="total"
      :loading="finding"
      :footer-props="{ 'items-per-page-options': itemsPerPageArray }"
    >
      <template v-slot:default="props">
        <v-row dense>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            md="6"
            sm="12"
            class="mx-auto"
          >
            <v-card class="mx-auto elevation-3">
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="item.title" class="headline">{{
                    item.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    item.professional
                  }}</v-list-item-subtitle>
                  <v-list-item-subtitle>{{ item.date }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-carousel
                height="300"
                v-if="item.images.length > 0"
                hide-delimiters
              >
                <v-carousel-item
                  cycle
                  progress
                  v-for="(image, i) in item.images"
                  :key="`image_${i}`"
                  :alt="item.reunion_type || item.title"
                  :src="image"
                  :lazy-src="image"
                >
                  <template v-slot:placeholder>
                    <lottie
                      :options="defaultOptionsPhoto"
                      :height="300"
                    ></lottie>
                  </template>
                </v-carousel-item>
              </v-carousel>
              <v-card-text>
                {{ item.objective }}
              </v-card-text>
              <v-list-item v-if="item.process">
                <v-list-item-content>
                  <v-list-item-title class="headline">{{
                    item.process
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $t("social.process")
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.who_summons">
                <v-list-item-content>
                  <v-list-item-title class="headline">{{
                    item.who_summons
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $t("social.who_summons")
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.reunion_type">
                <v-list-item-content>
                  <v-list-item-title class="headline">{{
                    item.reunion_type
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $t("social.reunion_type")
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.activities">
                <v-list-item-content>
                  <v-list-item-title class="headline">{{
                    item.activities
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $t("social.activities")
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="item.place">
                <v-list-item-content>
                  <v-list-item-title class="headline">{{
                    item.place
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $t("social.place")
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-text v-if="item.files.length > 0">
                <v-chip
                  v-for="(file, index) in item.files"
                  :key="`file_${index}`"
                  :href="file.file"
                  target="_blank"
                  :aria-label="file.type"
                >
                  <v-icon left>mdi-file</v-icon>
                  {{ file.type }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-skeleton-loader>
</template>

<script>
import { Social } from "@/models/services/Social";
import * as photo from "@/assets/anims/photo.json";

export default {
  name: "SocialData",
  data: (vm) => ({
    finding: false,
    items: [],
    itemsPerPage: 10,
    itemsPerPageArray: [10, 15, 20, 25, 30],
    pagination: {},
    total: 0,
    model: new Social(vm.$route.params.id),
    defaultOptionsPhoto: {
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: photo.default,
    },
  }),
  mounted() {
    if (this.$route.params.id) {
      this.getRecords();
    } else {
      this.$router.push({ name: "Error" });
    }
  },
  methods: {
    getRecords: function () {
      this.finding = true;
      const params = {
        page: this.pagination.page,
        per_page: this.itemsPerPage,
      };
      this.model
        .index({ params: params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
        })
        .finally(() => (this.finding = false));
    },
  },
  watch: {
    "pagination.page": function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getRecords();
      }
    },
    itemsPerPage: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getRecords();
      }
    },
  },
};
</script>

<style scoped></style>
