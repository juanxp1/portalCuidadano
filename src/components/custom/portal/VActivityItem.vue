<template>
  <v-skeleton-loader :loading="loading" type="card-avatar, article, actions">
    <info-content
      text-left
      info-horizontal
      icon-color="primary"
      :icon="item.icon"
      :subtitle="item.activity_name"
      :subheader="`${item.id} - ${item.program_name}`"
    >
      <v-row role="list" dense>
        <v-col cols="12" sm="12" md="6" class="mx-auto">
          <v-avatar v-if="!!item.icon" color="grey lighten-2" size="400">
            <v-icon size="300" dark v-text="item.icon || 'mdi-text'" />
          </v-avatar>
          <app-animation
            v-else
            height="400"
            :animation-data="bike"
            loop
            auto-play
          />
        </v-col>
        <v-col cols="12" sm="12" md="6" class="mx-auto">
          <v-card flat color="transparent">
            <v-card-text>
              <v-skeleton-loader
                :loading="loading"
                type="list-item-avatar-three-line"
              >
                <v-list color="transparent" three-line>
                  <v-list-item>
                    <v-list-item-content class="align-center justify-center">
                      <v-progress-circular
                        :size="100"
                        :height="15"
                        striped
                        :width="15"
                        :value="percent.total"
                        :color="percent.color"
                      >
                        {{ less }}
                      </v-progress-circular>
                      <v-list-item-subtitle class="text-center">
                        {{
                          $tc("portal.forms.preRegister.quotaLeft", less, {
                            qty: less,
                          })
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-activity-list-item no-action :item="item" />
                </v-list>
                <v-list
                  v-if="(item.regulations || []).length > 0"
                  dense
                  color="transparent"
                >
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-avatar>
                        <v-icon color="warning">mdi-alert</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Reglamento e información.'" />
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-for="(regulation, i) in item.regulations || []"
                    :href="regulation.file"
                    target="_blank"
                    :key="i"
                  >
                    <v-list-item-avatar>
                      <v-avatar>
                        <v-icon>mdi-file</v-icon>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="regulation.name" />
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>mdi-share</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-skeleton-loader>
            </v-card-text>
            <v-card-actions class="flex-wrap align-center justify-center">
              <app-btn
                v-if="!!item.park_code"
                path="buttons.ViewPark"
                text
                :loading="loading"
                color="primary"
                class="my-3"
                icon-text="mdi-pine-tree"
                :to="{
                  name: 'Park',
                  params: { id: item.park_code },
                }"
              />
              <v-pre-register
                v-if="$auth.isLoggedIn()"
                :selected-item="item"
                @success="onSuccess"
              >
                <template #activator="{ props, loading: load }">
                  <app-btn
                    :disabled="less <= 0 || load"
                    :loading="load || loading"
                    path="buttons.PreRegister"
                    color="primary"
                    class="my-3"
                    v-on="props.on"
                    v-bind="props.attrs"
                  />
                </template>
              </v-pre-register>
              <app-btn
                v-else
                :disabled="less <= 0 || loading"
                :loading="loading"
                path="buttons.Login"
                color="primary"
                class="my-3"
                :to="login"
              />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <help-accordion>
            <template #tutorial-panel>
              <access-help />
            </template>
          </help-accordion>
        </v-col>
      </v-row>
    </info-content>
  </v-skeleton-loader>
</template>

<script>
import { get } from "lodash";
import AccessHelp from "@/pages/help/AccessHelp.md";
import slugify from "@/util/slugify";
import * as bike from "@/assets/anims/bike.json";

export default {
  name: "VActivityItem",
  components: {
    AccessHelp: AccessHelp.vue.component,
  },
  props: {
    loading: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    bike: bike.default,
  }),
  methods: {
    onSuccess() {
      this.$emit("success", true);
    },
  },
  computed: {
    slug() {
      return slugify((this.item.activity_name || "").toLocaleLowerCase());
    },
    total() {
      return get(this.item, "quota", 0);
    },
    taken() {
      return get(this.item, "users_schedules_count", 0);
    },
    less() {
      return this.total - this.taken;
    },
    color() {
      const percent = (this.taken * 100) / this.total;
      if (percent >= 95) {
        return "error";
      } else if (percent >= 80 && percent < 95) {
        return "warning";
      } else {
        return "success";
      }
    },
    percent() {
      if (this.total > 0) {
        const percent = (this.taken * 100) / this.total;
        return {
          total: 100 - percent,
          color: this.color,
        };
      } else {
        return {
          total: 100,
          color: "success",
        };
      }
    },
    login() {
      return {
        name: "Login",
        query: {
          redirect: this.$router.resolve({
            name: "ActivityDetails",
            params: {
              id: this.item.id,
              slug: this.slug,
            },
          }).route.path,
        },
      };
    },
  },
};
</script>
