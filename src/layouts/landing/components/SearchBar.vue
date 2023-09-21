<template>
  <v-bottom-sheet v-model="sheet" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
        <meta itemprop="url" content="https://portalciudadano.idrd.gov.co/" />
        <v-form
          @submit.prevent="handleSubmit(onSubmit)"
          itemprop="potentialAction"
          itemscope
          itemtype="https://schema.org/SearchAction"
        >
          <meta
            itemprop="target"
            content="https://portalciudadano.idrd.gov.co/parques?q={search_term_string}"
          />
          <v-validation-provider
            v-slot="{ errors }"
            rules="required"
            :name="$t('label.parks').toLowerCase()"
          >
            <v-text-field
              :error-messages="errors"
              :loading="finding"
              :readonly="finding"
              v-model="form.query"
              prepend-icon="mdi-pine-tree"
              menu-props="auto"
              :hint="$t('help.park')"
              persistent-hint
              :label="$t('label.parks')"
              required
              clearable
              name="search_term_string"
              itemprop="query-input"
            >
              <template v-slot:append-outer>
                <v-btn
                  :aria-label="$t('input.search')"
                  id="v-step-desktop-1"
                  type="submit"
                  :loading="finding"
                  :disabled="finding"
                  small
                  color="primary"
                >
                  <v-icon left>mdi-magnify</v-icon>
                  {{ $t("input.search") }}
                </v-btn>
                <v-btn
                  :aria-label="$t('input.more_options')"
                  id="v-step-desktop-2"
                  small
                  :loading="finding"
                  :disabled="finding"
                  v-on="on"
                  color="primary"
                >
                  <v-icon left>mdi-filter-variant</v-icon>
                  {{ $t("input.more_options") }}
                </v-btn>
              </template>
            </v-text-field>
          </v-validation-provider>
        </v-form>
      </v-validation-observer>
    </template>
    <v-sheet class="text-center">
      <v-card flat>
        <v-card-title>
          {{
            $vuetify.breakpoint.smAndDown
              ? $t("input.search")
              : $t("input.more_options")
          }}
          <v-spacer></v-spacer>
          <v-btn icon @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-slide-y-transition appear>
            <v-validation-observer ref="advance" v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(onSubmit)">
                <v-row>
                  <!-- Park -->
                  <v-col class="mx-auto" cols="12" md="8" sm="12">
                    <v-validation-provider
                      v-slot="{ errors }"
                      :rules="{
                        required: !form.park_type && !form.location,
                        max: 45,
                        min: 3,
                      }"
                      :name="$t('label.parks').toLowerCase()"
                    >
                      <v-text-field
                        :error-messages="errors"
                        :loading="finding"
                        v-model="form.query"
                        counter
                        maxlength="45"
                        :readonly="finding"
                        prepend-icon="mdi-pine-tree"
                        menu-props="auto"
                        :hint="$t('help.park')"
                        persistent-hint
                        :label="$t('label.parks')"
                        clearable
                      >
                      </v-text-field>
                    </v-validation-provider>
                  </v-col>
                  <!-- Location -->
                  <v-col class="mx-auto" cols="12" md="8" sm="12">
                    <v-validation-provider
                      v-slot="{ errors }"
                      :rules="{
                        numeric: true,
                        required: !form.park_type && !form.query,
                      }"
                      :name="$t('label.location').toLowerCase()"
                    >
                      <v-select
                        :error-messages="errors"
                        name="location"
                        :loading="finding"
                        :readonly="finding"
                        item-text="name"
                        item-value="id"
                        autocomplete="off"
                        clearable
                        required="required"
                        v-model.number="form.location"
                        :items="localities"
                        prepend-icon="mdi-map"
                        menu-props="auto"
                        :label="$t('help.location')"
                      >
                      </v-select>
                    </v-validation-provider>
                  </v-col>
                  <!-- Park Type -->
                  <v-col class="mx-auto" cols="12" md="8" sm="12">
                    <v-validation-provider
                      v-slot="{ errors }"
                      :rules="{
                        numeric: true,
                        required: !form.location && !form.query,
                      }"
                      :name="$t('label.park_type').toLowerCase()"
                    >
                      <v-select
                        :error-messages="errors"
                        name="park_type"
                        :loading="finding"
                        :readonly="finding"
                        item-text="name"
                        item-value="id"
                        autocomplete="off"
                        clearable
                        required="required"
                        v-model.number="form.park_type"
                        :items="scales"
                        prepend-icon="mdi-pine-tree"
                        menu-props="auto"
                        :label="$t('help.park_type')"
                      >
                      </v-select>
                    </v-validation-provider>
                  </v-col>
                  <!-- Submit -->
                  <v-col class="mx-auto text-right" cols="12" md="8" sm="12">
                    <v-btn
                      :aria-label="$t('input.search')"
                      type="submit"
                      :loading="finding"
                      :disabled="finding"
                      :small="$vuetify.breakpoint.smAndDown"
                      color="primary"
                    >
                      <v-icon left>mdi-magnify</v-icon>
                      {{ $t("input.search") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-validation-observer>
          </v-slide-y-transition>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import { sync } from "vuex-pathify";
import { Park } from "@/models/services/Park";
import SelectsMixin from "@/mixins/selects";

export default {
  name: "AppSearchBar",
  mixins: [SelectsMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    is_not_mobile: true,
    sheet: false,
    finding: false,
    model: new Park(),
  }),
  mounted() {
    this.getLocalities();
    this.getScales();
    this.$store.dispatch("search/resetItems");
    this.total = 0;
  },
  methods: {
    onSubmit: function () {
      this.finding = true;
      this.onHome();
    },
    onHome: function () {
      let data = {};
      this.$store.dispatch("search/resetItems").then(() => {
        this.model
          .index({
            params: {
              query: this.form.query,
              locality_id: this.form.location,
              type_id: this.form.park_type,
            },
          })
          .then((response) => {
            data = response;
            this.formStored = this.form;
            this.items = response.data;
            this.total = response.meta.total;
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.finding = false;
            this.$router.push({
              name: "Search",
              params: { initial: data },
              query: { q: this.form.query },
            });
          });
      });
    },
    onClose: function () {
      this.sheet = false;
      this.$emit("onCloseSearchBar", false);
    },
  },
  computed: {
    form: sync("selects/form"),
    total: sync("search/total"),
    items: sync("search/items"),
  },
  watch: {
    "$vuetify.breakpoint.mdAndUp": function (val) {
      this.is_not_mobile = val;
    },
    show: function (val) {
      this.sheet = val;
    },
    is_not_mobile: function (val) {
      this.form.query = val ? null : this.form.query;
    },
  },
  beforeDestroy() {
    this.$bus.$off("onFilterSearch");
  },
};
</script>

<style scoped></style>
