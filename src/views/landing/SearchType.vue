<script>
import Search from "./Search";
export default {
  name: "SearchType",
  extends: Search,
  watch: {
    "form.park_type": function (val) {
      if (val) {
        const text = this.scales.find((scale) => scale.id === val);
        this.$router
          .push({
            params: {
              type_id: val,
              name: (text.name || "").trim().replace(" ", "-").toLowerCase(),
            },
          })
          .finally(() => {
            this.getRecords();
          });
      }
    },
  },
};
</script>
