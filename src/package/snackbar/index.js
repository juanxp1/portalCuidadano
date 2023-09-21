import { dispatch } from "vuex-pathify";

const addSnack = (icon, color, message) => {
  return new Promise((resolve) => {
    dispatch("snackbar/addSnack", {
      icon,
      color,
      message,
    }).finally(() => resolve(true));
  });
};

export default function (Vue) {
  (Vue.snackbar = {
    info(message) {
      return addSnack("mdi-information-outline", "info", message);
    },
    success(message) {
      return addSnack("mdi-bell-plus", "success", message);
    },
    warning(message) {
      return addSnack("mdi-alert-outline", "warning", message);
    },
    error(message) {
      return addSnack("mdi-alert-circle-outline", "error", message);
    },
    add(data) {
      return new Promise((resolve) => {
        dispatch("snackbar/addSnack", data).finally(() => resolve(true));
      });
    },
    remove(id) {
      return new Promise((resolve) => {
        dispatch("snackbar/removeSnack", id).finally(() => resolve(true));
      });
    },
  }),
    Object.defineProperties(Vue.prototype, {
      $snackbar: {
        get() {
          return Vue.snackbar;
        },
      },
    });
}
