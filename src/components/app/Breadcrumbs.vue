<template>
  <v-breadcrumbs :items="items">
    <template #item="{ item }">
      <v-breadcrumbs-item
        :exact="item.exact"
        :to="item.to"
        class="text-capitalize"
      >
        <v-icon v-if="item.to === '/'">mdi-home</v-icon>
        <template v-else>{{ item.text }}</template>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
import { uniqBy } from "lodash";
export default {
  name: "AppBreadcrumbs",
  metaInfo() {
    const meta = {
      script: [
        {
          type: "application/ld+json",
          json: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: this.items.map((item, i) => {
              return {
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@id": `${process.env.VUE_APP_CANONICAL}${
                    item.to === "/" ? "" : item.to.path
                  }`,
                  name: item.text,
                },
              };
            }),
          },
        },
      ],
    };
    return meta;
  },
  computed: {
    items() {
      const router = this.$route.matched.map((route) => {
        const crumbs = this.$router.resolve({
          name: route.name ? route.name : route.meta.alias,
          params: this.$route.params,
        });
        return {
          full: route,
          text: route.meta ? route.meta.title : route.name,
          exact: true,
          to: ["", "/app", "/usuarios"].includes(route.path)
            ? "/"
            : crumbs.route,
        };
      });
      router.unshift({
        text: this.$t("router.home"),
        exact: true,
        to: "/",
      });
      return uniqBy(router, "text");
    },
  },
};
</script>
