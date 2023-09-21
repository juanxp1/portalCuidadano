<template>
  <details-page height="500" title="Actividades">
    <template #heading>
      <v-col cols="12" v-if="$vuetify.breakpoint.mdAndUp">
        <v-card flat :light="!$vuetify.theme.dark">
          <v-card-text>
            <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
              <v-form @submit.prevent="handleSubmit(getRecords)">
                <v-validation-provider v-slot="{ errors }">
                  <v-text-field
                    label="Buscar por palabra clave"
                    hint="Realiza la búsqueda por actividad de interés, deporte, parque u horarios, por ejemplo: Natación"
                    persistent-hint
                    clearable
                    v-model="form.query"
                    :error-messages="errors"
                    @click:clear="getRecords"
                  >
                    <template v-slot:append-outer>
                      <v-btn
                        :aria-label="$t('input.search')"
                        type="submit"
                        :loading="loading"
                        :disabled="loading"
                        small
                        color="primary"
                      >
                        <v-icon left>mdi-magnify</v-icon>
                        {{ $t("input.search") }}
                      </v-btn>
                      <v-btn
                        :aria-label="$t('input.more_options')"
                        small
                        :loading="loading"
                        @click="sheet = true"
                        :disabled="loading"
                        color="primary"
                      >
                        <v-badge color="red" :value="badge" :content="badge">
                          <template #default>
                            <v-icon left>mdi-filter-variant</v-icon>
                            {{ $t("input.more_options") }}
                          </template>
                        </v-badge>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-validation-provider>
              </v-form>
            </v-validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <info-content
            text-left
            info-horizontal
            icon-color="warning"
            icon="mdi-information-outline"
            subtitle="Para tener en cuenta"
          >
            <v-row dense>
              <v-col cols="12">
                <p class="body-2">
                  La preinscripción debe ser diligenciada por un adulto mayor de
                  18 años de edad, si desea inscribir un menor el adulto será el
                  responsable de inscribir los datos del menor de edad.
                </p>
                <p class="body-2">
                  Si ya tiene usuario y clave (credenciales de acceso) y desea
                  preinscribir un usuario, debe hacer el proceso de toma de cupo
                  ingresando con estas credenciales en el menú de esta página,
                  de lo contrario no puede hacer el proceso correctamente.
                </p>
              </v-col>
              <v-col cols="12" sm="12" md="3" class="mt-3">
                <h3 class="display-serif-2 mb-5">Programas</h3>
                <v-select
                  label="Selecciona un programa"
                  v-model="form.program_id"
                  multiple
                  chips
                  small-chips
                  deletable-chips
                  :items="programs"
                  item-text="composed_name"
                  item-value="id"
                  @change="getRecords"
                />
                <h3 class="display-serif-2 mb-5">Escenarios</h3>
                <v-autocomplete
                  label="Selecciona un escenario"
                  v-model="form.stage_id"
                  multiple
                  chips
                  small-chips
                  deletable-chips
                  :items="stages"
                  item-text="name"
                  item-value="id"
                  @change="getRecords"
                >
                  <template #item="{ item, on, attrs }">
                    <v-list-item v-on="on" v-bind="attrs">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="`${item.name} (${item.schedules_count})`"
                        />
                        <v-list-item-subtitle
                          v-text="
                            `${item.park_code || ''} - ${item.park_name || ''}`
                          "
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <h3 class="display-serif-2 mb-5">Precio</h3>
                <v-chip-group
                  v-model="form.is_paid"
                  active-class="deep-purple--text text--accent-4 my-1 mx-3"
                  column
                  @change="getRecords"
                >
                  <v-chip :value="0" small>
                    <v-icon small left v-text="`mdi-currency-usd-off`" />
                    Gratuito
                  </v-chip>
                  <v-chip :value="1" small>
                    <v-icon small left v-text="`mdi-currency-usd`" />
                    Pago
                  </v-chip>
                </v-chip-group>
                <h3 class="display-serif-2 mb-5">Edad</h3>
                <v-slider
                  v-model="form.age"
                  class="mt-3"
                  max="120"
                  :thumb-size="24"
                  thumb-label="always"
                  @change="getRecords"
                ></v-slider>
                <h3 class="display-serif-2 mb-5">Días</h3>
                <v-chip-group
                  v-model="form.query"
                  active-class="deep-purple--text text--accent-4 my-1 mx-3"
                  column
                  @change="getRecords"
                >
                  <v-chip
                    v-for="(day, i) in days"
                    :value="day.value"
                    small
                    :key="i"
                  >
                    <v-icon small left v-text="day.icon" />
                    {{ day.text }}
                  </v-chip>
                </v-chip-group>
                <h3 class="display-serif-2 mb-5">Categorías</h3>
                <v-chip-group
                  v-model="form.query"
                  active-class="deep-purple--text text--accent-4 my-1 mx-3"
                  column
                  @change="getRecords"
                >
                  <v-chip
                    v-for="(chip, i) in chips"
                    :value="chip.value"
                    small
                    :key="i"
                  >
                    <v-icon small left v-text="chip.icon" />
                    {{ chip.name }}
                  </v-chip>
                </v-chip-group>
              </v-col>
              <v-col cols="12" sm="12" md="9">
                <v-skeleton-loader
                  :loading="loading"
                  type="heading, list-item-avatar-three-line@6"
                >
                  <v-data-iterator
                    :items="items"
                    :items-per-page.sync="itemsPerPage"
                    :options.sync="pagination"
                    item-key="id"
                    :server-items-length="total"
                    :loading="loading"
                    :footer-props="{
                      'items-per-page-options': itemsPerPageArray,
                    }"
                  >
                    <template v-slot:default="props">
                      <v-list color="transparent" subheader three-line>
                        <v-subheader inset>{{
                          $tc("label.result", total, { qty: total })
                        }}</v-subheader>
                        <v-activity-list-item
                          v-for="item in props.items"
                          :key="item.id"
                          :item="item"
                          @click:activity="getEvent"
                        />
                      </v-list>
                    </template>
                    <template v-slot:no-data>
                      <v-empty-state
                        class="my-2"
                        :rounded="$vuetify.breakpoint.mdAndUp"
                        icon="mdi-alphabetical-off"
                        label="No se encontraron ofertas"
                        description="No hay oferta disponible, cambias los criterios de búsqueda seleccionados o intenta más tarde."
                      ></v-empty-state>
                    </template>
                    <template v-slot:no-results>
                      <v-empty-state
                        class="my-2"
                        icon="mdi-alphabetical-off"
                        :label="$tc('label.result', 0)"
                      ></v-empty-state>
                    </template>
                  </v-data-iterator>
                </v-skeleton-loader>
              </v-col>
            </v-row>
          </info-content>
        </v-col>
      </v-row>
    </v-card-text>
    <template #after-card>
      <v-bottom-sheet v-model="sheet" persistent>
        <v-sheet class="text-center">
          <v-card flat max-width="800" class="mx-auto">
            <v-card-title>
              {{
                $vuetify.breakpoint.smAndDown
                  ? $t("input.search")
                  : $t("input.more_options")
              }}
              <v-spacer></v-spacer>
              <v-btn icon @click="sheet = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-slide-y-transition appear>
                <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
                  <v-form @submit.prevent="handleSubmit(getRecords)">
                    <v-row dense class="mx-auto">
                      <v-col cols="12" md="12" sm="12">
                        <v-validation-provider v-slot="{ errors }">
                          <v-text-field
                            label="Buscar por palabra clave"
                            hint="Realiza la búsqueda por actividad de interés, parque u horarios, por ejemplo: Natación"
                            persistent-hint
                            clearable
                            v-model="form.query"
                            :error-messages="errors"
                          >
                          </v-text-field>
                        </v-validation-provider>
                      </v-col>
                      <v-col cols="12" md="12" sm="12">
                        <v-validation-provider
                          v-slot="{ errors }"
                          :rules="{ numeric: true }"
                        >
                          <v-text-field
                            label="Por edad"
                            hint="Realiza la búsqueda de actividades por edad de 0 a 120"
                            persistent-hint
                            clearable
                            v-model="form.age"
                            :error-messages="errors"
                          >
                          </v-text-field>
                        </v-validation-provider>
                      </v-col>
                      <v-col cols="12" md="6" sm="12">
                        <v-switch
                          v-model="form.is_paid"
                          label="Gratuitos"
                          hint="Realiza la búsqueda por actividades gratuitas"
                          :false-value="null"
                          :true-value="0"
                        ></v-switch>
                      </v-col>
                      <v-col cols="12" md="6" sm="12">
                        <v-switch
                          v-model="form.is_paid"
                          label="Pagos"
                          hint="Realiza la búsqueda por actividades pagas"
                          :false-value="null"
                          :true-value="1"
                        ></v-switch>
                      </v-col>
                      <v-col cols="12" md="12" sm="12" class="text-right">
                        <v-btn
                          :aria-label="$t('input.search')"
                          type="submit"
                          color="primary"
                        >
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
      <v-fab-transition>
        <v-btn
          class="hidden-md-and-up"
          @click="sheet = true"
          color="primary"
          :disabled="loading"
          :loading="loading"
          dark
          fixed
          bottom
          right
          fab
          :aria-label="$t('input.search')"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-dialog v-model="dialog" persistent>
        <v-validation-observer ref="basic" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(onSubmit)">
            <v-card flat>
              <v-card-title>
                <v-list width="100%">
                  <v-list-item>
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
                      <v-btn icon @click="onClose">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
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
                  subtitle="Debes tener en cuenta"
                >
                  <p>
                    Para agilizar el proceso de preinscripción recuerda que
                    debes tener toda la información de personal y documentación
                    tuya o de tus beneficiarios completa y actualizada. También
                    debes tener en cuenta los horarios y requisitos establecidos
                    para la inscripción a la actividad.
                  </p>
                  <v-btn
                    class="mb-2"
                    small
                    color="primary"
                    :to="{ name: 'Profile' }"
                    >Actualizar mi información</v-btn
                  >
                  <v-btn
                    class="mb-2"
                    small
                    color="primary"
                    :to="{ name: 'People' }"
                    >Actualizar beneficiario</v-btn
                  >
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="profile.validations.required"
                    vid="profile"
                    name="beneficiario"
                  >
                    <v-select
                      id="profile"
                      v-model="profile.profile_id"
                      name="profile"
                      :error-messages="errors"
                      :disabled="loading"
                      :loading="loading"
                      label="¿Quién va a participar?"
                      :items="profiles"
                      item-text="name"
                      item-value="id"
                    >
                      <template #item="{ item, on, attrs }">
                        <v-list-item
                          two-line
                          :disabled="
                            item.age < selectedItem.min_age ||
                            item.age > selectedItem.max_age
                          "
                          v-on="on"
                          v-bind="attrs"
                        >
                          <v-list-item-avatar>
                            <v-icon>mdi-account</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title v-text="item.name" />
                            <v-list-item-subtitle
                              v-if="
                                item.age < selectedItem.min_age ||
                                item.age > selectedItem.max_age
                              "
                            >
                              <v-icon left x-small color="red"
                                >mdi-alert</v-icon
                              >
                              No cumples con los requisitos de edad para esta
                              actividad.
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-validation-provider>
                  <v-list subheader three-line>
                    <v-list-item ripple>
                      <v-list-item-avatar>
                        <v-avatar color="grey">
                          <v-icon dark>mdi-soccer</v-icon>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-subtitle class="caption">
                          <v-icon small left>mdi-pin</v-icon>
                          {{ selectedItem.stage_name }}
                          {{ `- ${selectedItem.park_address || ""}` }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="caption">
                          <v-chip
                            v-if="!!selectedItem.park_code"
                            :to="{
                              name: 'Park',
                              params: { id: selectedItem.park_code },
                            }"
                            small
                          >
                            <v-icon x-small left>mdi-open-in-new</v-icon>
                            {{
                              `${selectedItem.park_code || ""} - ${
                                selectedItem.park_name || ""
                              }`
                            }}
                          </v-chip>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <v-chip-group column>
                            <v-chip
                              :color="selectedItem.is_paid ? 'success' : ''"
                              small
                            >
                              <v-icon small left>
                                {{
                                  selectedItem.is_paid
                                    ? "mdi-currency-usd"
                                    : "mdi-currency-usd-off"
                                }}
                              </v-icon>
                              {{ selectedItem.is_paid ? "Pago" : "Gratuito" }}
                            </v-chip>
                            <v-chip color="primary" small>
                              <v-icon small left> mdi-pound </v-icon>
                              Cupos: {{ selectedItem.quota }}
                            </v-chip>
                            <v-chip
                              small
                              v-if="
                                selectedItem.quota -
                                  selectedItem.users_schedules_count >
                                0
                              "
                              color="success"
                            >
                              <v-icon left small>mdi-clock</v-icon>
                              Quedan
                              {{
                                selectedItem.quota -
                                selectedItem.users_schedules_count
                              }}
                              cupos.
                            </v-chip>
                            <v-chip
                              small
                              v-if="
                                selectedItem.quota -
                                  selectedItem.users_schedules_count <=
                                0
                              "
                            >
                              <v-icon left small>mdi-playlist-remove</v-icon>
                              Todos los cupos han sido tomados
                            </v-chip>
                            <v-chip small>
                              <v-icon small left
                                >mdi-human-male-female-child</v-icon
                              >
                              Edades: {{ selectedItem.min_age }} -
                              {{ selectedItem.max_age }}
                            </v-chip>
                            <v-chip small>
                              <v-icon small left>mdi-calendar</v-icon>
                              Horarios: {{ selectedItem.weekday_name }} -
                              {{ selectedItem.daily_name }}
                            </v-chip>
                          </v-chip-group>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-validation-provider
                    v-slot="{ errors }"
                    :rules="profile.validations.required"
                    vid="terms"
                    name="términos y condiciones"
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
                        <span class="caption">
                          Acepto los
                          <v-dialog max-width="500">
                            <template v-slot:activator="{ on }">
                              <a href="javascript:;" v-on="on">
                                Términos y Condiciones
                              </a>
                            </template>
                            <terms-and-conditions />
                          </v-dialog>
                        </span>
                      </template>
                    </v-checkbox>
                  </v-validation-provider>
                  <v-alert v-if="error.message" type="error">
                    {{ error.message }}
                    <template #close>
                      <v-icon dark @click="error.message = null"
                        >mdi-close</v-icon
                      >
                    </template>
                  </v-alert>
                </info-content>
              </v-card-text>
              <v-card-actions class="text-right">
                <v-spacer />
                <v-btn
                  color="error"
                  :disabled="loading"
                  :loading="loading"
                  text
                  outlined
                  @click="onClose"
                  >Cancelar</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                  type="submit"
                  >Preinscribir</v-btn
                >
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
            Gracias por participar
          </v-card-title>
          <v-card-text class="text-center">
            <p>Hemos registrado tu preinscripción satisfactoriamente.</p>
            <p>
              Recuerda revisar tu correo electrónico o la sección de
              <v-btn text x-small outlined color="primary"
                ><v-icon x-small left>mdi-bell-plus</v-icon>
                notificaciones</v-btn
              >
              de la plataforma plataforma para conocer el estado de tu
              preinscripción.
            </p>
            <app-animation
              :animation-data="successAnim"
              auto-play
              loop
              width="200"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="info = false"> Aceptar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </details-page>
</template>

<script>
import * as success from "@/assets/anims/success.json";
import { CitizenPortal } from "@/models/services/CitizenPortal";
import { Beneficiary } from "@/models/services/portal/Beneficiary";
import { Program } from "@/models/services/portal/Program";
import { Stage } from "@/models/services/portal/Stage";
import { get } from "vuex-pathify";

export default {
  name: "SportActivities",
  data: () => ({
    sheet: false,
    form: new CitizenPortal({
      program_id: [],
      stage_id: [],
      is_paid: null,
      age: null,
      query: null,
    }),
    loading: false,
    total: 0,
    items: [],
    itemsPerPage: 10,
    itemsPerPageArray: [10, 15, 20, 25, 30],
    pagination: {},
    chips: [
      {
        name: "ACTIVIDADES SUBACUATICAS CEFE FONTANAR DEL RIO",
        value: "ACTIVIDADES",
        icon: "mdi-swim",
      },
      {
        name: "AJEDREZ",
        value: "AJEDREZ",
        icon: "mdi-chess-pawn",
      },
      {
        name: "ARQUERIA",
        value: "ARQUERIA",
        icon: "mdi-bullseye-arrow",
      },
      {
        name: "ATLETISMO",
        value: "ATLETISMO",
        icon: "mdi-run",
      },
      {
        name: "BALONCESTO",
        value: "BALONCESTO",
        icon: "mdi-basketball",
      },
      {
        name: "BALONMANO",
        value: "BALONMANO",
        icon: "mdi-soccer",
      },
      {
        name: "BEISBOL",
        value: "BEISBOL",
        icon: "mdi-baseball-bat",
      },
      {
        name: "BOLOS",
        value: "BOLOS",
        icon: "mdi-bowling",
      },
      {
        name: "BOXEO",
        value: "BOXEO",
        icon: "mdi-boxing-glove",
      },
      {
        name: "CAMINATA AULA AMBIENTAL SORATAMA (USAQUEN)",
        value: "CAMINATA",
        icon: "mdi-walk",
      },
      {
        name: "CICLISMO DE PISTA",
        value: "CICLISMO",
        icon: "mdi-bike",
      },
      {
        name: "CICLOMONTAÑISMO",
        value: "CICLOMONTAÑISMO",
        icon: "mdi-bike",
      },
      {
        name: "CURSO FUNDAMENTOS ADMINISTRACIÓN DEPORTIVA",
        value: "CURSO",
        icon: "mdi-book-open-variant",
      },
      {
        name: "ESCALADA",
        value: "ESCALADA",
        icon: "mdi-image-filter-hdr",
      },
      {
        name: "ESGRIMA",
        value: "ESGRIMA",
        icon: "mdi-fencing",
      },
      {
        name: "FÚTBOL",
        value: "FÚTBOL",
        icon: "mdi-soccer",
      },
      {
        name: "FUTBOL ALTOS DE LA ESTANCIA",
        value: "FUTBOL",
        icon: "mdi-soccer",
      },
      {
        name: "GIMNASIA",
        value: "GIMNASIA",
        icon: "mdi-gymnastics",
      },
      {
        name: "JUDO",
        value: "JUDO",
        icon: "mdi-gymnastics",
      },
      {
        name: "KARATE",
        value: "KARATE",
        icon: "mdi-gymnastics",
      },
      {
        name: "LEVANTAMIENTO DE PESAS",
        value: "LEVANTAMIENTO",
        icon: "mdi-dumbbell",
      },
      {
        name: "LUCHA",
        value: "LUCHA",
        icon: "mdi-boxing-glove",
      },
      {
        name: "MULTILATERAL (BALONCESTO - VOLEIBOL - FÚTBOL DE SALÓN)",
        value: "MULTILATERAL",
        icon: "mdi-hexagon-multiple",
      },
      {
        name: "NATACIÓN - DISCAPACIDAD CEFE SAN CRISTOBAL",
        value: "NATACIÓN",
        icon: "mdi-swim",
      },
      {
        name: "NATACION - DPV FONTANAR - CICLO I - 2022",
        value: "NATACION",
        icon: "mdi-swim",
      },
      {
        name: "PARANATACIÓN CEFE FONTANAR DEL RIO",
        value: "PARANATACIÓN",
        icon: "mdi-swim",
      },
      {
        name: "PATINAJE ARTÍSTICO",
        value: "PATINAJE",
        icon: "mdi-roller-skate",
      },
      {
        name: "RUGBY",
        value: "RUGBY",
        icon: "mdi-rugby",
      },
      {
        name: "SKATE BOARDING",
        value: "SKATE",
        icon: "mdi-skateboarding",
      },
      {
        name: "SKATEBOARDING CEFE FONTANAR DEL RIO",
        value: "SKATEBOARDING",
        icon: "mdi-skateboarding",
      },
      {
        name: "SQUASH",
        value: "SQUASH",
        icon: "mdi-racquetball",
      },
      {
        name: "TAEKWONDO",
        value: "TAEKWONDO",
        icon: "mdi-gymnastics",
      },
      {
        name: "TALLERES PSICOMOTRICIDAD",
        value: "TALLERES",
        icon: "mdi-book-open-variant",
      },
      {
        name: "TENIS DE CAMPO",
        value: "TENIS",
        icon: "mdi-tennis",
      },
      {
        name: "VOLEIBOL",
        value: "VOLEIBOL",
        icon: "mdi-volleyball",
      },
    ],
    days: [
      {
        value: "LUNES",
        text: "Lunes",
        icon: "mdi-calendar",
      },
      {
        value: "MARTES",
        text: "Martes",
        icon: "mdi-calendar",
      },
      {
        value: "MIÉRCOLES",
        text: "Miércoles",
        icon: "mdi-calendar",
      },
      {
        value: "JUEVES",
        text: "Jueves",
        icon: "mdi-calendar",
      },
      {
        value: "VIERNES",
        text: "Viernes",
        icon: "mdi-calendar",
      },
      {
        value: "SÁBADO",
        text: "Sábado",
        icon: "mdi-calendar",
      },
      {
        value: "DOMINGO",
        text: "Domingo",
        icon: "mdi-calendar",
      },
    ],
    dialog: false,
    info: false,
    selectedItem: {},
    successAnim: success.default,
    profile: new Beneficiary({
      profile_id: null,
      terms: null,
    }),
    profiles: [],
    error: {},
    program: new Program(),
    programs: [],
    stage: new Stage(),
    stages: [],
  }),
  created() {
    if (this.routeParams.query) {
      this.form.query = this.routeParams.query;
    }
    if (this.routeParams.program_id) {
      this.form.program_id = this.routeParams.program_id;
    }
    this.getRecords();
    this.getCategories();
    this.getPrograms();
    this.getStages();
    if (this.$auth.isLoggedIn()) {
      this.getProfiles();
    }
  },
  computed: {
    ...get("route", {
      routeQuery: "query",
      routeParams: "params",
    }),
    badge() {
      return (this.form.is_paid !== null ? 1 : 0) + (this.form.age ? 1 : 0);
    },
  },
  methods: {
    getRecords() {
      this.loading = true;
      this.sheet = false;
      this.form.age = this.form.age > 0 ? this.form.age : null;
      const { page } = this.pagination;
      const params = {
        ...this.form.data(),
        page: page,
        per_page: this.itemsPerPage,
      };
      this.form.resetOnlyWhenUpdate = false;
      this.form
        .index({ params })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.total;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getEvent(event) {
      this.selectedItem = {};
      const open = () => {
        this.selectedItem = event;
        setTimeout(() => (this.dialog = true), 10);
      };

      if (this.dialog) {
        this.selectedItem = {};
        this.dialog = false;
        setTimeout(open, 10);
      } else {
        open();
      }
    },
    onSubmit() {
      if (this.selectedItem.id && this.profile.profile_id) {
        this.loading = true;
        this.profile
          .subscribe(this.profile.profile_id, this.selectedItem.id)
          .then((response) => {
            this.$snackbar.success(response.data);
            this.getRecords();
          })
          .catch((errors) => {
            this.$snackbar.error(errors.message);
            this.error = errors;
          })
          .finally(() => {
            this.profile.profile_id = null;
            this.profile.terms = null;
            this.loading = false;
          });
      }
    },
    getProfiles() {
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
      this.dialog = false;
      this.selectedItem = {};
      this.profile.profile_id = null;
      this.profile.terms = null;
    },
    getCategories() {
      this.form
        .categories()
        .then((response) => {
          if (response.data && response.data.length > 0) {
            this.chips = response.data;
          }
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    getPrograms() {
      this.program
        .index()
        .then((response) => {
          this.programs = response.data;
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
    getStages() {
      this.stage
        .index()
        .then((response) => {
          this.stages = response.data.filter(
            (stage) => stage.schedules_count > 0
          );
        })
        .catch((errors) => {
          this.$snackbar.error(errors.message);
        });
    },
  },
  watch: {
    "pagination.page"() {
      this.getRecords();
    },
    itemsPerPage() {
      this.getRecords();
    },
  },
};
</script>
