import moment from "moment";

export function useMoment(app) {
  Object.defineProperties(app.prototype, {
    $moment: {
      get() {
        return moment;
      },
    },
  });
}
