<template>
  <details-page custom-card :title="$t('menu.social')">
    <material-card
      icon-avatar="mdi-pine-tree"
      class="main main-raised elevation-24 mb-12"
    >
      <app-breadcrumbs />
      <v-card-text>
        <social-data></social-data>
      </v-card-text>
    </material-card>
  </details-page>
</template>

<script>
export default {
  name: "SocialManagement",
  metaInfo() {
    return {
      title: `${this.$t("menu.social")} | ${this.$t("title")}`,
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Sistema de Información Distrital de Parques",
                item: `${process.env.VUE_APP_CANONICAL}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Buscador de Parques",
                item: `${process.env.VUE_APP_CANONICAL}parques`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Gestión Social",
                item: `${process.env.VUE_APP_CANONICAL}parques/${this.$route.params.id}/gestion-social`,
              },
            ],
          }),
        },
      ],
    };
  },
};
</script>

<style scoped></style>
