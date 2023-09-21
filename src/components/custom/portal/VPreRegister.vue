<template>
  <div>
    <v-dialog v-model="dialog" persistent>
      <template #activator="props">
        <slot name="activator" :props="props" :loading="loading" />
      </template>
      <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-card flat>
            <v-card-title>
              <v-list width="100%">
                <v-list-item>
                  <v-list-item-avatar class="hidden-sm-and-down">
                    <v-avatar color="grey">
                      <v-icon dark v-text="selectedItem.icon || 'mdi-text'" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-subtitle class="caption">
                      <v-icon small left>mdi-bookmark-multiple</v-icon>
                      {{ selectedItem.program_name }}
                    </v-list-item-subtitle>
                    <v-list-item-title
                      class="primary--text display-serif-1 font-weight-bold"
                    >
                      {{ selectedItem.activity_name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <app-btn
                      path="buttons.Close"
                      icon-text="mdi-close"
                      icon
                      @click="onClose"
                    />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-title>
            <v-card-text>
              <info-content
                icon="mdi-alert"
                icon-color="warning"
                info-horizontal
                text-left
                subtitle="portal.forms.preRegister.title"
              >
                <i18n
                  tag="p"
                  class="font-weight-regular"
                  path="portal.forms.preRegister.description"
                />
                <v-alert type="warning" colored-border border="left">
                  <i18n path="portal.forms.preRegister.verified" />
                </v-alert>
                <app-btn
                  path="buttons.UpdateProfile"
                  class="mb-2"
                  small
                  color="primary"
                  :to="{ name: 'Profile' }"
                />
                <app-btn
                  path="buttons.UpdateBeneficiary"
                  class="mb-2"
                  small
                  color="primary"
                  :to="{ name: 'People' }"
                />
                <v-validation-provider
                  v-slot="{ errors }"
                  :rules="profile.validations.required"
                  vid="profile"
                  :name="
                    $t(
                      'portal.forms.beneficiary.beneficiary'
                    ).toLocaleLowerCase()
                  "
                >
                  <v-select
                    id="profile"
                    v-model="profile.profile_id"
                    name="profile"
                    :error-messages="errors"
                    :disabled="loading"
                    :loading="loading"
                    :label="$t('portal.forms.beneficiary.signUp')"
                    :items="profiles"
                    item-text="name"
                    item-value="id"
                  >
                    <template #item="{ item, on, attrs }">
                      <v-list-item
                        two-line
                        :disabled="notAvailable(item)"
                        v-on="on"
                        v-bind="attrs"
                      >
                        <v-list-item-avatar>
                          <v-icon>mdi-account</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.name" />
                          <v-list-item-subtitle v-if="notAvailableAge(item)">
                            <v-icon left x-small color="red">mdi-alert</v-icon>
                            <i18n
                              path="portal.forms.preRegister.ageUnavailable"
                            />
                          </v-list-item-subtitle>
                          <v-list-item-subtitle v-if="notAvailableVerified(item)">
                            <v-icon left x-small color="red">mdi-alert</v-icon>
                            <i18n path="portal.forms.preRegister.verified" />
                          </v-list-item-subtitle>
                          <v-list-item-subtitle v-if="forDisability(item)">
                            <v-icon left x-small color="red">mdi-alert</v-icon>
                            <i18n path="portal.forms.preRegister.disability" />
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-validation-provider>
                <v-list subheader three-line>
                  <v-activity-list-item no-action :item="selectedItem" />
                </v-list>
                <v-validation-provider
                  v-if="informed_consents.length === 0"
                  v-slot="{ errors }"
                  :rules="profile.validations.required"
                  vid="terms"
                  :name="
                    $t('portal.forms.preRegister.terms').toLocaleLowerCase()
                  "
                >
                  <v-checkbox
                    :value="1"
                    id="terms"
                    name="terms"
                    v-model="profile.terms"
                    :error-messages="errors"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <template #label>
                      <i18n
                        tag="span"
                        class="caption"
                        path="portal.forms.preRegister.accept"
                      >
                        <template #link>
                          <v-dialog max-width="500">
                            <template v-slot:activator="{ on }">
                              <i18n
                                tag="a"
                                class="text-lowercase"
                                href="javascript:;"
                                path="portal.forms.preRegister.terms"
                                v-on="on"
                              />
                            </template>
                            <terms-and-conditions />
                          </v-dialog>
                        </template>
                      </i18n>
                    </template>
                  </v-checkbox>
                </v-validation-provider>
                <v-validation-provider
                  v-for="c in informed_consents"
                  v-slot="{ errors }"
                  :rules="profile.validations.required"
                  :vid="`consent-${c.id}`"
                  :name="(c.title || '').toLocaleLowerCase()"
                  :key="c.id"
                >
                  <v-checkbox
                    :value="c.id"
                    :id="`consent-${c.id}`"
                    :name="`consent`"
                    v-model="profile.consent"
                    :error-messages="errors"
                    :loading="loading"
                    :disabled="loading"
                  >
                    <template #label>
                      <i18n
                        tag="span"
                        class="caption"
                        path="portal.forms.preRegister.accept_other"
                      >
                        <template #link>
                          <v-dialog max-width="800">
                            <template v-slot:activator="{ on }">
                              <a
                                class="text-lowercase"
                                href="javascript:;"
                                v-on="on"
                              >
                                {{ c.title }}
                              </a>
                            </template>
                            <v-card flat>
                              <v-card-title
                                class="align-center justify-center text-center"
                              >
                                <v-icon aria-label="IDRD" size="80">
                                  $vuetify.icons.bogota
                                </v-icon>
                              </v-card-title>
                              <v-card-text
                                style="height: 300px; overflow-y: scroll"
                              >
                                <v-skeleton-loader
                                  :loading="loading"
                                  type="article"
                                >
                                  <app-md>{{ c.text }}</app-md>
                                </v-skeleton-loader>
                              </v-card-text>
                            </v-card>
                          </v-dialog>
                        </template>
                      </i18n>
                    </template>
                  </v-checkbox>
                </v-validation-provider>
                <v-alert v-if="error.message" type="error">
                  {{ error.message }}
                  <template #close>
                    <v-icon
                      :aria-label="$t('buttons.Close')"
                      dark
                      @click="error.message = null"
                      v-text="'mdi-close'"
                    />
                  </template>
                </v-alert>
              </info-content>
            </v-card-text>
            <v-card-actions class="text-right">
              <v-spacer />
              <app-btn
                path="buttons.Cancel"
                :disabled="loading"
                :loading="loading"
                text
                outlined
                @click="onClose"
              />
              <app-btn
                path="buttons.PreRegister"
                color="primary"
                :disabled="loading"
                :loading="loading"
                type="submit"
              />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-validation-observer>
    </v-dialog>
    <v-dialog v-model="info" max-width="400">
      <v-card flat>
        <v-card-title
          class="font-weight-bold display-serif-2 v-sheet text-center justify-center align-center"
        >
          <i18n tag="p" path="portal.forms.preRegister.successDialog.title" />
        </v-card-title>
        <v-card-text class="text-center">
          <i18n
            tag="p"
            path="portal.forms.preRegister.successDialog.paragraph"
          />
          <i18n tag="p" path="portal.forms.preRegister.successDialog.notify">
            <template #btn>
              <app-btn
                text
                x-small
                outlined
                color="primary"
                icon-text="mdi-bell-plus"
                path="buttons.Notifications"
              />
            </template>
          </i18n>
          <app-animation
            :animation-data="successAnim"
            auto-play
            loop
            width="200"
          />
          <app-btn
            v-if="!!selectedItem.is_paid && !!citizen_schedule_id"
            path="buttons.GoToPay"
            color="primary"
            :disabled="loading"
            :loading="loading"
            :to="{
              name: 'SubscriptionDetails',
              params: { id: citizen_schedule_id },
            }"
          />
          <app-btn
            v-else
            path="buttons.GoToActivities"
            color="primary"
            :disabled="loading"
            :loading="loading"
            :to="{ name: 'Subscriptions' }"
          />
        </v-card-text>
        <v-card-actions>
          <app-btn
            path="buttons.Close"
            color="danger"
            block
            outlined
            :disabled="loading"
            :loading="loading"
            @click="info = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get, debounce } from "lodash";
import * as success from "@/assets/anims/success.json";
import { Beneficiary } from "@/models/services/portal/Beneficiary";

export default {
  name: "VPreRegister",
  props: {
    selectedItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    loading: false,
    dialog: false,
    info: false,
    successAnim: success.default,
    profile: new Beneficiary({
      profile_id: null,
      terms: null,
      consent: [],
    }),
    profiles: [],
    error: {},
    citizen_schedule_id: null,
  }),
  created() {
    this.getProfiles();
  },
  methods: {
    onSubmit() {
      if (this.selectedItem.id && this.profile.profile_id) {
        this.loading = true;
        this.profile
          .subscribe(this.profile.profile_id, this.selectedItem.id)
          .then((response) => {
            this.$snackbar.success(response.data);
            this.citizen_schedule_id = response.details;
            this.info = true;
            this.$emit("success");
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
            this.error = errors;
            this.$emit("success");
          })
          .finally(() => {
            this.profile.profile_id = null;
            this.profile.terms = null;
            this.loading = false;
          });
      }
    },
    getProfiles() {
      this.info = false;
      this.profile
        .profilesList()
        .then((response) => {
          this.profiles = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    onClose() {
      this.info = false;
      this.dialog = false;
      this.profile.profile_id = null;
      this.profile.terms = null;
    },
    notAvailable(item) {
      return (
        item.age < this.selectedItem.min_age ||
        item.age > this.selectedItem.max_age ||
        !item.verified ||
        (this.selectedItem.disability && item.disability !== "SI")
      );
    },
    notAvailableAge(item) {
      return (
        item.age < this.selectedItem.min_age ||
        item.age > this.selectedItem.max_age
      );
    },
    notAvailableVerified(item) {
      return !item.verified;
    },
    forDisability(item) {
      return this.selectedItem.disability && item.disability !== "SI";
    },
  },
  computed: {
    informed_consents() {
      return (this.selectedItem.consent || []).filter(
        (c) => parseInt(c.profile_id) === parseInt(this.profile.profile_id)
      );
    },
    informed_consent_title() {
      return get(this.selectedItem, "consent.0.title", "");
    },
    informed_consent_text() {
      return get(
        (this.selectedItem.consent || []).filter(
          (c) => parseInt(c.profile_id) === parseInt(this.profile.profile_id)
        ),
        "0.text",
        ""
      );
    },
  },
};
</script>
