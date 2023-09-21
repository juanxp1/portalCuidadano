import Vue from "vue";
const EventBus = new Vue();

export default function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $bus: {
      get() {
        return EventBus;
      },
    },
  });
}
