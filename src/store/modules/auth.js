// Pathify
import { make } from "vuex-pathify";

const state = {
  user: null,
  token: null,
  profiles: [],
};

const ds = {
  user: null,
  token: null,
  profiles: [],
};

const actions = {
  logout: ({ commit }) => {
    return new Promise((resolve) => {
      resolve(commit("LOGOUT"));
    });
  },
  ...make.actions(state),
};

const getters = make.getters(state);

const mutations = {
  LOGOUT(state) {
    Object.assign(state, ds);
  },
  ...make.mutations(state),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
