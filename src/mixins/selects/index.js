import { sync } from "vuex-pathify";
import { Scale } from "@/models/services/Scale";
import { Location } from "@/models/services/Location";

export default {
  name: "SelectsMixin",
  data: () => ({
    locality: new Location(),
    scale: new Scale(),
  }),
  computed: {
    requested_at: sync("selects/requested_at"),
    localities: sync("selects/localities"),
    scales: sync("selects/scales"),
    isRecent() {
      const start = this.$moment().startOf("day");
      const end = this.$moment().endOf("day");
      const requested =
        this.requested_at !== null
          ? this.$moment(this.requested_at).isValid()
            ? this.$moment(this.requested_at)
            : null
          : null;
      return requested && requested.isBetween(start, end);
    },
  },
  methods: {
    getLocalities() {
      if (this.isRecent && this.localities && this.localities.length > 0) {
        return;
      }
      this.locality
        .index()
        .then((response) => {
          this.localities = response.data;
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.add({
            color: "error",
            icon: "mdi-bell-plus",
            message: errors.message,
          });
        });
    },
    getScales: function () {
      if (this.isRecent && this.scales && this.scales.length > 0) {
        return;
      }
      this.scale
        .index()
        .then((response) => {
          this.scales = response.data;
          this.requested_at = response.requested_at;
        })
        .catch((errors) => {
          this.$snackbar.add({
            color: "error",
            icon: "mdi-bell-plus",
            message: errors.message,
          });
        });
    },
  },
};
