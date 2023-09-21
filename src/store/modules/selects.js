// Utilities
import { make } from "vuex-pathify";

const state = {
  requested_at: null,
  localities: [],
  scales: [],
  query: null,
  form: {
    query: null,
    location: null,
    park_type: null,
  },
};

const mutations = {
  ...make.mutations(state),
  RESET_FORM(state) {
    state.form = {
      query: null,
      location: null,
      park_type: null,
    };
  },
  RESET_ALL(state) {
    state.localities = [];
    state.scales = [];
    state.query = null;
    state.form = {
      query: null,
      location: null,
      park_type: null,
    };
  },
};

const getters = make.getters(state);

const actions = {
  ...make.actions(state),
  resetForm: ({ commit }) => {
    return new Promise((resolve) => {
      commit("RESET_FORM");
      resolve();
    });
  },
  resetAll: ({ commit }) => {
    return new Promise((resolve) => {
      commit("RESET_ALL");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
