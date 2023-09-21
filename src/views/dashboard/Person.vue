<template>
  <v-container fluid tag="section">
    <v-row>
      <v-col cols="12" class="mt-5">
        <material-card :ident-icon="identicon">
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
                        <app-btn
                          path="buttons.Help"
                          icon-text="mdi-help-circle"
                          icon
                          @click="onTour"
                        />
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
            />
            <app-menu
              v-else
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
            <v-spacer />
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
                  :profile-id="$route.params.id"
                />
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text>
                <v-observations
                  v-if="profile.id"
                  :profile-id="$route.params.id"
                />
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text>
                <v-attachments
                  v-if="profile.id"
                  :profile-id="$route.params.id"
                />
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
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
      <beneficiary-form v-if="dialog" :form-data="profile" @success="getUser" />
    </v-form-dialog>
  </v-container>
</template>

<script>
import { toSvg } from "jdenticon";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import ProfilesHelp from "@/pages/help/ProfilesHelp.md";

export default {
  name: "PersonView",
  components: {
    ProfilesHelp: ProfilesHelp.vue.component,
  },
  created() {
    this.getUser();
  },
  data: () => ({
    tab: null,
    loading: false,
    form: new Beneficiary(),
    headers: [],
    expanded: [],
    profile: {},
    history: [],
    requested_at: null,
    tabs: ["Perfil", "Actividades", "Observaciones", "Archivos"],
    dialog: false,
    timeOut: null,
  }),
  computed: {
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
      return toSvg(this.profile.full_name, 128);
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
      //split the above string into an array of strings
      //whenever a blank space is encountered
      const arr = (this.profile.full_name || "").split(" ");

      //loop through each element of the array and capitalize the first letter.

      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }

      //Join all the elements of the array back into a string
      //using a blankspace as a separator
      return arr.join(" ");
    },
  },
  methods: {
    getUser() {
      this.profile = {};
      this.loading = true;
      this.form
        .show(this.$route.params.id)
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
    },
    onHelp() {
      this.$refs.helpDialog.open();
    },
    onClose() {
      this.dialog = false;
      this.$refs.formDialog.close();
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
        })
      );
    },
  },
};
</script>
