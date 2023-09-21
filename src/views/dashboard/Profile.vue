<template>
  <v-container fluid tag="section">
    <v-parallax
      :lazy-src="bg"
      height="300"
      class="text-center border-radius-xl"
      :src="bg"
    >
      <v-overlay absolute class="bg-gradient-primary opacity-6" />
    </v-parallax>
    <v-card flat color="transparent" class="main main-raised mb-12">
      <v-row>
        <v-col cols="12">
          <material-card class="elevation-24" flat :ident-icon="identicon">
            <template #after-heading>
              <v-skeleton-loader
                :loading="loading"
                type="article"
                :width="$vuetify.breakpoint.mdAndUp ? '600' : '300'"
              >
                <div
                  class="d-flex flex-wrap flex-sm-nowrap"
                  style="word-break: break-word"
                >
                  <div class="flex-grow-1">
                    <div
                      class="d-flex justify-space-between align-md-start align-sm-center flex-wrap mb-1"
                    >
                      <div class="d-flex flex-column">
                        <profile-header
                          :name="profile.full_name"
                          :status="profile.status"
                          :color="profile.color"
                          :verified="!!profile.verified_at"
                        >
                        </profile-header>
                        <div class="d-flex flex-wrap mb-4 pr-2 body-1">
                          <profile-info
                            v-if="!!profile.profile_type"
                            :text="profile.profile_type"
                            type="profile"
                          />
                          <profile-info
                            v-if="!!profile.city_residence"
                            :text="profile.city_residence"
                            type="location"
                          />
                          <profile-info
                            v-if="!!profile.email"
                            :text="profile.email"
                            type="email"
                          />
                        </div>
                      </div>
                    </div>
                    <!--
                    <div
                      class="d-flex flex-wrap justify-space-between align-center"
                    >
                      <div
                        class="d-flex align-center w-200px w-sm-300px flex-column"
                      >
                        <div class="d-flex justify-space-between w-100">
                          <i18n
                            tag="span"
                            class="body-2 grey--text darken-1"
                            path="portal.forms.templates.completion"
                          />
                          <span
                            class="body-2 font-weight-bold grey--text darken-1"
                            v-text="`${parseInt(profile.completion) || 0}%`"
                          />
                        </div>
                        <div class="h-5px mx-3 w-100 bg-light">
                          <v-progress-linear
                            rounded
                            :value="profile.completion || 0"
                            color="success"
                          />
                        </div>
                      </div>
                    </div>
                    -->
                  </div>
                </div>
              </v-skeleton-loader>
            </template>
            <template #toolbar>
              <app-card-toolbar
                v-if="$vuetify.breakpoint.mdAndUp"
                :loading="loading"
                :requested-at="requested_at"
                :items="actions"
                menu-id="profile-menu"
              >
                <app-btn
                  path="buttons.Help"
                  icon-text="mdi-help-circle"
                  icon
                  @click="onTour"
                />
              </app-card-toolbar>
              <app-menu
                v-else
                id="mobile-profile-menu"
                :btn-attrs="{ block: true, icon: false, class: 'mt-4' }"
                :items="actions"
              />
            </template>
            <v-card-text>
              <v-divider class="my-2" />
              <div class="d-flex justify-center flex-wrap">
                <app-mini-stat
                  v-for="(stat, i) in stats"
                  :loading="loading"
                  :item="stat"
                  :key="i"
                />
              </div>
            </v-card-text>
          </material-card>
        </v-col>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-text>
              <v-tabs
                v-model="tab"
                show-arrows
                color="primary"
                center-active
                class="v-tabs--pill"
                hide-slider
                :active-class="`primary ${
                  $vuetify.theme.dark ? 'black' : 'white'
                }--text`"
              >
                <v-tab
                  v-for="(item, i) in tabs"
                  :key="item"
                  :id="`tab-header-${i}`"
                >
                  {{ item }}
                </v-tab>
              </v-tabs>
            </v-card-text>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card-text>
                  <v-skeleton-loader
                    :loading="loading"
                    type="list-item-avatar-two-line@10"
                  >
                    <v-row>
                      <v-col
                        v-for="(key, i) in userData"
                        :key="i"
                        cols="12"
                        sm="12"
                        md="6"
                      >
                        <v-list v-if="!!profile[key.value]">
                          <v-list-item>
                            <v-list-item-icon v-if="!!key.icon">
                              <v-icon v-text="key.icon" />
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title v-text="profile[key.value]" />
                              <v-list-item-subtitle
                                v-if="!!key.text"
                                v-text="key.text"
                              />
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-skeleton-loader>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <v-user-activities
                    v-if="profile.id"
                    :profile-id="profile.id"
                  />
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <v-observations v-if="profile.id" :profile-id="profile.id" />
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <v-attachments v-if="profile.id" :profile-id="profile.id" />
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <h2 class="font-weight-light display-2">
                        Cambiar contraseña
                      </h2>
                    </v-col>
                    <v-col cols="12">
                      <v-form-template
                        form-id="register-form"
                        reset-form
                        :form.sync="change_password"
                        :loading="loading"
                        :sections="changePassword"
                        i18n_path="portal.forms.beneficiary"
                        method="changePassword"
                        @success="onSuccess"
                      >
                      </v-form-template>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <h2 class="font-weight-light display-2">Cambiar email</h2>
                    </v-col>
                    <v-col cols="12">
                      <v-form-template
                        ref="changeEmailForm"
                        form-id="register-form"
                        :form.sync="change_email"
                        reset-form
                        has-email-confirmation
                        :email-confirmation-text="success_text"
                        :loading="loading"
                        :sections="changeEmail"
                        i18n_path="portal.forms.beneficiary"
                        method="changeEmail"
                        @success="onSuccessMessage"
                      >
                        <template #message>
                          <v-card flat color="transparent">
                            <v-card-text class="text-center">
                              <p class="text-body">
                                Por favor digita el código enviado a tu nueva
                                dirección de correo
                              </p>
                              <v-otp-input
                                length="6"
                                v-model="confirm_change_email.code"
                                @finish="onConfirmText"
                              />
                              <app-timer
                                tag="p"
                                class="caption"
                                :time="timerBtn"
                                @end="onTimeOut"
                                v-slot="{ seconds }"
                              >
                                {{
                                  `Podrás reenviar un nuevo código en ${seconds} segundo(s).`
                                }}
                              </app-timer>
                              <v-overlay absolute :value="loadingOTP">
                                <v-progress-circular
                                  indeterminate
                                  color="primary"
                                />
                              </v-overlay>
                            </v-card-text>
                            <v-card-actions class="text-center">
                              <app-btn
                                :aria-label="$t('buttons.Resend')"
                                outlined
                                color="primary"
                                :loading="loading"
                                :disabled="loading || !enable_btn"
                                depressed
                                v-text="$t('buttons.Resend')"
                                @click="onResend"
                              />
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-form-template>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-check-dialog
      width="600"
      ref="helpDialog"
      title="buttons.Help"
      toolbar-color="primary"
      :show-btn="false"
      use-i18n
    >
      <help-accordion>
        <template #tutorial-panel>
          <profiles-help />
        </template>
      </help-accordion>
    </v-check-dialog>
    <v-form-dialog
      ref="formDialog"
      fullscreen
      use-i18n
      title="buttons.Update"
      @close:dialog="onClose"
    >
      <beneficiary-form
        v-if="dialog"
        :form-data="profile"
        for-profile
        @success="getUser"
      />
    </v-form-dialog>
  </v-container>
</template>

<script>
import ProfilesHelp from "@/pages/help/ProfilesHelp.md";
import { get as _get } from "lodash";
import { dispatch, sync, get } from "vuex-pathify";
import { toSvg } from "jdenticon";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import { User } from "@/models/services/User";

export default {
  name: "ProfileView",
  components: {
    ProfilesHelp: ProfilesHelp.vue.component,
  },
  created() {
    this.getUser();
  },
  mounted() {
    const complete = this.$route.params.complete;
    if (complete) {
      this.onUpdate();
    }
    if (this.showHelpProfile) {
      this.onTour();
    }
  },
  data: () => ({
    bg: require("@/assets/img/dashboard/profile/profile.avif"),
    tab: null,
    loading: false,
    form: new Beneficiary(),
    headers: [],
    expanded: [],
    history: [],
    requested_at: null,
    tabs: ["Perfil", "Actividades", "Observaciones", "Archivos", "Seguridad"],
    dialog: false,
    timeOut: null,
    user: new User(),
    change_password: new User({
      current_password: null,
      new_password: null,
      new_password_confirmation: null,
    }),
    change_email: new User({
      email: null,
      password: null,
    }),
    confirm_change_email: new User({
      code: null,
    }),
    success_text: undefined,
    enable_btn: false,
    loadingOTP: false,
    timerBtn: 1000 * 60,
  }),
  computed: {
    auth: get("auth/user"),
    profile: sync("auth/user@profile"),
    showHelpProfile: sync("user/showHelpProfile"),
    stats() {
      return [
        {
          text: "Actividades",
          value: this.profile.activities_count || 0,
          icon: "mdi-soccer",
        },
        {
          text: "Observaciones",
          value: this.profile.observations_count || 0,
          icon: "mdi-message-text",
        },
        {
          text: "Archivos",
          value: this.profile.files_count || 0,
          icon: "mdi-paperclip",
        },
      ];
    },
    identicon() {
      return toSvg(this.name, 128);
    },
    userData() {
      const except = ["full_name", "profile_type", "status"];
      const items = [...this.headers, ...this.expanded];
      return items.filter((key) => {
        return (
          !except.includes(key.value) && !!this.profile[key.value] && key.icon
        );
      });
    },
    actions() {
      return [
        {
          icon: "mdi-pencil",
          text: "buttons.Update",
          action: this.onUpdate,
        },
        {
          icon: "mdi-help-circle",
          text: "buttons.Help",
          action: this.onHelp,
        },
        {
          icon: "mdi-refresh",
          text: "buttons.Refresh",
          action: this.getUser,
        },
      ];
    },
    name() {
      const full_name = _get(this.profile, "full_name", "");
      const user = _get(this.auth, "name", "");
      const email = _get(this.auth, "email", "");
      let name = "";
      if (full_name.length > 4) {
        name = full_name;
      } else if (user.length > 4) {
        name = user;
      }
      if (name) {
        //split the above string into an array of strings
        //whenever a blank space is encountered
        const arr = (name || "").split(" ");

        //loop through each element of the array and capitalize the first letter.

        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }

        //Join all the elements of the array back into a string
        //using a blankspace as a separator
        return arr.join(" ");
      } else {
        return email;
      }
    },
    // Settings Forms
    changePassword() {
      const that = this;
      return [
        {
          title: "Cambiar contraseña",
          fields: [
            {
              name: "current_password",
              icon: "mdi-lock",
              type: "password",
              rules: that.change_password.validations.input_password_required,
              flex: 12,
              attrs: {
                minlength: 8,
                maxlength: 32,
                required: true,
                autocomplete: "current-password",
                counter: 32,
                hint: "La contraseña debe contener al menos 8 caracteres con una mayúscula, minúscula, números y caracteres especiales. Ejemplo: C0ntr4s3ñ4_53gur4",
                persistentHint: true,
              },
            },
            {
              name: "new_password",
              icon: "mdi-lock",
              type: "password",
              rules: that.change_password.validations.input_password_required,
              flex: 12,
              attrs: {
                minlength: 8,
                maxlength: 32,
                required: true,
                autocomplete: "new-password",
                counter: 32,
                hint: "La contraseña debe contener al menos 8 caracteres con una mayúscula, minúscula, números y caracteres especiales. Ejemplo: C0ntr4s3ñ4_53gur4",
                persistentHint: true,
              },
            },
            {
              name: "new_password_confirmation",
              icon: "mdi-lock",
              type: "password",
              rules:
                that.change_password.validations.input_password_confirmation(
                  "new_password"
                ),
              flex: 12,
              attrs: {
                minlength: 8,
                maxlength: 32,
                required: true,
                autocomplete: "new-password",
                counter: 32,
              },
            },
          ],
        },
      ];
    },
    changeEmail() {
      const that = this;
      return [
        {
          title: "Cambiar email",
          fields: [
            {
              name: "email",
              alias: "Nuevo correo electrónico",
              icon: "mdi-email",
              type: "email",
              rules: that.change_email.validations.input_email_required,
              flex: 12,
              attrs: {
                minlength: 3,
                maxlength: 125,
                required: true,
                autocomplete: "email",
                counter: 125,
              },
            },
            {
              name: "password",
              icon: "mdi-lock",
              alias: "Contraseña actual",
              type: "password",
              rules: that.change_email.validations.input_password_required,
              flex: 12,
              attrs: {
                minlength: 8,
                maxlength: 32,
                required: true,
                autocomplete: "new-password",
                counter: 32,
                hint: "Digita tu contraseña actual",
                persistentHint: true,
              },
            },
          ],
        },
      ];
    },
  },
  methods: {
    getUser() {
      this.loading = true;
      if (this.profile.id) {
        this.form
          .show(this.profile.id)
          .then((response) => {
            this.profile = response.data;
            this.headers = response.details.headers;
            this.expanded = response.details.expanded;
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.user
          .index()
          .then((response) => {
            dispatch("auth/setUser", response.data);
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    onHelp() {
      this.$refs.helpDialog.open();
    },
    onClose() {
      this.dialog = false;
    },
    onUpdate() {
      const that = this;
      if (that.timeOut) {
        clearTimeout(that.timeOut);
      }
      const open = () => {
        if (that.timeOut) {
          clearTimeout(that.timeOut);
        }
        that.dialog = true;
        that.timeOut = setTimeout(that.$refs.formDialog.open, 10);
      };

      if (that.dialog) {
        that.dialog = false;
        that.form = that.model.clone();
        that.timeOut = setTimeout(open, 10);
      } else {
        open();
      }
    },
    onTour() {
      const that = this;
      const tour = this.$shepherd({
        useModalOverlay: true,
      });
      const menus = [`activities-menu`, `observations-menu`, `attach-menu`];
      const pos = [3, 5, 7];
      const desc = [
        `Podrás visualizar la información que has registrado en el sistema.`,
        `Podrás visualizar las actividades a las que te has pre-inscrito y su respectivo estado de aprobación.`,
        `Podrás visualizar las observaciones recibidas al perfil o beneficiario por parte de los funcionarios del IDRD.`,
        `Podrás visualizar y adjuntar los archivos solicitados en el sistema.`,
        `Podrás realizar el cambio de contraseña o actualizar tu dirección de correo electrónico.`,
      ];
      const steps = this.tabs.map((tab, i) => ({
        attachTo: { element: `#tab-header-${i}`, on: "top" },
        defaultStepOptions: {
          scrollTo: {
            behavior: "smooth",
            block: "center",
          },
          cancelIcon: {
            enabled: true,
          },
        },
        canClickTarget: false,
        title: tab,
        text: desc[i],
        buttons: [
          {
            action() {
              return this.next();
            },
            text: that.$t("buttons.Next"),
          },
        ],
        when: {
          show: function () {
            that.tab = i;
          },
        },
      }));
      tour.addSteps([
        {
          attachTo: { element: "#profile-menu", on: "top" },
          defaultStepOptions: {
            scrollTo: {
              behavior: "smooth",
              block: "center",
            },
            cancelIcon: {
              enabled: true,
            },
          },
          canClickTarget: false,
          title: "Menú de opciones",
          text: `<p>Al dar clic sobre el botón aparecerá una lista de opciones que permitirán realizar acciones dentro del sistema.</p>
            <ul style="margin-left: 20px; margin-top: 5px;">
              <li>Actualizar Información del Perfil</li>
              <li>Ver información de ayuda</li>
              <li>Actualizar datos en pantalla</li>
            </ul>
          `,
          buttons: [
            {
              action() {
                return this.next();
              },
              text: that.$t("buttons.Next"),
            },
          ],
        },
        ...steps,
      ]);
      menus.map((menu, i) => {
        tour.addStep(
          {
            attachTo: { element: `#${menu}`, on: "top" },
            defaultStepOptions: {
              scrollTo: {
                behavior: "smooth",
                block: "center",
              },
              cancelIcon: {
                enabled: true,
              },
            },
            canClickTarget: false,
            title: "Menú de opciones",
            text: `<p>Al dar clic sobre el botón aparecerá una lista de opciones que permitirán realizar acciones dentro del sistema.</p>`,
            buttons: [
              {
                action() {
                  return this.next();
                },
                text: that.$t("buttons.Next"),
              },
            ],
          },
          pos[i]
        );
      });
      tour.start();
      ["close", "cancel", "complete"].forEach((event) =>
        tour.on(event, () => {
          that.tab = 0;
          that.showHelpProfile = false;
        })
      );
    },
    // Settings
    onConfirmText() {
      this.loadingOTP = true;
      this.confirm_change_email
        .confirmChangeEmail()
        .then((response) => {
          this.onSuccess(response);
          this.getUser();
          this.$refs.changeEmailForm.setStep(0);
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loadingOTP = false;
        });
    },
    onResend() {
      this.confirm_change_email
        .resendConfirmChangeEmail()
        .then(this.onSuccess)
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.enable_btn = false;
          this.timerBtn = this.timerBtn * 60;
        });
    },
    onSuccess(response) {
      this.$snackbar.success(response.data);
    },
    onSuccessMessage(response) {
      this.onSuccess(response);
      this.success_text = response.data;
    },
    onTimeOut() {
      this.enable_btn = true;
    },
  },
};
</script>
