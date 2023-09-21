<template>
  <app-menu
    menu-icon="mdi-account"
    menu-icon-color="default"
    tooltip-text="buttons.User"
    :items="items"
  />
</template>

<script>
export default {
  name: "AppUser",
  methods: {
    onLogout() {
      this.$auth.logout().finally(() => {
        if (this.$route.name !== "Home") {
          this.$router.push({
            name: "Home",
          });
        }
      });
    },
  },
  computed: {
    items() {
      return [
        {
          icon: "mdi-account",
          text: this.$t("sidebar.Profile"),
          to: {
            name: "Profile",
          },
        },
        {
          icon: "mdi-logout",
          title: this.$t("sidebar.Logout"),
          action: this.onLogout,
        },
      ];
    },
  },
};
</script>
