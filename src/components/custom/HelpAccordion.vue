<template>
  <v-expansion-panels>
    <slot name="prepend-panel" />
    <v-expansion-panel>
      <v-expansion-panel-header>
        <i18n class="primary--text font-weight-bold" path="help.tutorials" />
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text v-if="!!src">
            <iframe
              v-if="youtube"
              width="100%"
              height="315"
              :src="src"
              :title="title"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <v-img
              v-else
              :src="src"
              :lazy-src="src"
              aspect-ratio="16/9"
              contain
              alt="Infografía"
            >
              <template #placeholder>
                <v-img
                  :src="placeholder"
                  :lazy-src="placeholder"
                  aspect-ratio="16/9"
                  contain
                  alt="No disponible"
                />
              </template>
            </v-img>
          </v-card-text>
          <v-card-text v-else>
            <slot v-if="$slots['tutorial-panel']" name="tutorial-panel" />
            <v-empty-state
              v-else
              label="No hay tutorial disponible"
              icon="mdi-clipboard-text-off-outline"
            />
          </v-card-text>
          <v-card-actions v-if="!!src">
            <app-btn
              block
              color="primary"
              icon-text="mdi-play"
              :href="src"
              target="_blank"
              :path="`buttons.${youtube ? 'ViewOnYoutube' : 'OpenInNewWindow'}`"
            />
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <slot name="append-panel" />
    <!--
    <v-expansion-panel>
      <v-expansion-panel-header>
        <i18n class="primary--text font-weight-bold" path="help.questions" />
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="d-flex flex-column align-md-start px-0">
          <i18n path="help.questionsText" />
          <span class="d-flex flex-column align-md-start">
            <span>
              <v-icon small left>mdi-phone</v-icon>
              (+57 1) 660 5400
            </span>
            <span>
              <v-icon small left>mdi-email</v-icon>
              <i18n path="dashboard.invoice.email" />
            </span>
          </span>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <i18n class="primary--text font-weight-bold" path="help.experience" />
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="12" class="mx-auto">
                <div
                  class="d-flex flex-column justify-space-around px-0 flex-md-row"
                >
                  <span class="d-flex flex-column text-center">
                    <v-icon
                      :aria-label="$t('help.easy')"
                      size="50"
                      color="success"
                      >mdi-check-circle</v-icon
                    >
                    <i18n path="help.easy" />
                  </span>
                  <span class="d-flex flex-column text-center">
                    <v-icon
                      :aria-label="$t('help.hard')"
                      size="50"
                      color="error"
                      >mdi-close-circle</v-icon
                    >
                    <i18n path="help.hard" />
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <app-btn
              :href="`mailto:${$t('dashboard.invoice.email')}`"
              target="_blank"
              block
              color="primary"
              icon-text="mdi-email"
              path="buttons.ContactUs"
            />
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <i18n class="primary--text font-weight-bold" path="help.answers" />
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text>
            <app-btn
              :href="pqrs"
              target="_blank"
              block
              color="primary"
              icon-text="mdi-help"
              path="buttons.pqrds"
            />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    -->
  </v-expansion-panels>
</template>

<script>
export default {
  name: "HelpAccordion",
  props: {
    youtube: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: "Video de YouTube",
    },
  },
  data: () => ({
    placeholder: require("@/assets/img/error/no_image.png"),
  }),
  computed: {
    pqrs() {
      return "https://www.idrd.gov.co/transparencia-acceso-informacion-publica/informacion-especifica/respuestas-peticionarios-anonimos";
    },
  },
};
</script>

<style scoped></style>
