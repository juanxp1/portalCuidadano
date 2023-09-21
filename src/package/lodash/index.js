import _ from "lodash";
export default function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $lodash: {
      get() {
        return _;
      },
    },
  });
}
