// Utilities
import { differenceInDays } from "date-fns";
import { make } from "vuex-pathify";
import merge from "lodash/merge";

// Globals
import { IN_BROWSER } from "@/util/globals";

const state = () => {
  let data;
  if (IN_BROWSER) {
    data = JSON.parse(localStorage.getItem("idrd@user")) || {};

    // Reset local store if using old variables
    if (Object(data.last) !== data.last) {
      delete data.last;
    }
  }

  return merge(
    {
      api: false,
      pwaRefresh: true,
      drawer: {
        mini: false,
      },
      last: {
        install: null,
      },
      notifications: [],
      rtl: false,
      theme: {
        dark: false,
        system: false,
        mixed: false,
      },
      lang: "es",
      activeColor: "primary",
      drawerMini: false,
      drawerColor: "rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)",
      drawerImage: require("@/assets/img/dashboard/sidebar/sidebar-1.jpg"),
      showHelpProfile: true,
    },
    data
  );
};

const mutations = make.mutations(state);

const actions = {
  fetch({ commit }) {
    if (!IN_BROWSER) return;

    const data = state();

    for (const key in data) {
      commit(key, data[key]);
    }
  },
  update({ state }) {
    if (!IN_BROWSER) return;

    localStorage.setItem("idrd@user", JSON.stringify(state));
  },
};

const getters = {
  hasRecentlyViewed: (state) => {
    const notification = state.last.notification;

    return notification
      ? differenceInDays(Date.now(), Number(notification)) < 1
      : false;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
