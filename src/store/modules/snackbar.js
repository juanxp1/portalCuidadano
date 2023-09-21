// Utilities
import { make } from "vuex-pathify";
import { has } from "lodash";
import { v4 as uniqueId } from "uuid";

const colors = [
  "primary",
  "secondary",
  "tertiary",
  "accent",
  "success",
  "info",
  "warning",
  "error",
  "danger",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "blue-grey",
  "grey",
  "black",
  "twitter",
  "facebook",
  "google-plus",
  "linkedin",
  "pinterest",
  "youtube",
  "tumblr",
  "github-circle",
  "behance",
  "dribble",
  "reddit",
];

const state = {
  items: [],
};

const mutations = {
  ...make.mutations(state),
  ADD_SNACKBAR(state, payload) {
    const snack = payload;
    if (has(payload, "color")) {
      snack.color = colors.includes(payload.color) ? payload.color : "error";
    } else {
      snack.color = "error";
    }
    snack.icon =
      has(payload, "icon") && payload.icon.length > 0
        ? payload.icon
        : "mdi-bell-plus";
    state.items.push({
      id: uniqueId("item_snack_"),
      ...snack,
    });
  },
  REMOVE_SNACKBAR(state, payload) {
    const index = state.items.findIndex((item) => item.id === payload);
    if (index !== -1) {
      state.items.splice(index, 1);
    }
  },
};

const actions = {
  ...make.actions(state),
  addSnack({ commit }, payload) {
    if (Array.isArray(payload)) {
      payload.map((item) => {
        commit("ADD_SNACKBAR", item);
      });
    } else {
      commit("ADD_SNACKBAR", payload);
    }
  },
  removeSnack({ commit }, payload) {
    commit("REMOVE_SNACKBAR", payload);
  },
};

const getters = make.getters(state);

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
