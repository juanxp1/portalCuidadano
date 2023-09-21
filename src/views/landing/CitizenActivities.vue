<template>
  <details-page :title="$t('menu.citizenactivities')">
    <v-card-text>
      <info-content
        text-left
        info-horizontal
        icon-color="success"
        icon="mdi-information-outline"
        :subtitle="$t('menu.interestactivities')"
      >
        <v-row dense class="mt-12">
          <v-col
            v-for="(card, i) in $t('landing.index.activities.cards')"
            :key="i"
            cols="12"
            sm="12"
            md="6"
          >
            <material-blog-post
              :image="card.image"
              vertical
              symmetrical
              icon="mdi-post"
              icon-color="info"
              :category="card.category"
              :title="card.title"
              color="transparent"
            >
              <ul
                class="caption"
                v-for="(txt, i) in card.description"
                :key="`p-${i}`"
              >
                <li>{{ txt }}</li>
              </ul>
              <template #author>
                <v-btn
                  :disabled="card.disabled"
                  color="primary"
                  class="text-left"
                  small
                  :to="card.to"
                >
                  {{ $t("label.see_more") }}
                </v-btn>
              </template>
            </material-blog-post>
          </v-col>
        </v-row>
      </info-content>
    </v-card-text>
  </details-page>
</template>

<script>
export default {
  name: "ActivitiesCategory",
};
</script>
