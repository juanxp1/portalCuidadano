// Pathify
import { make } from "vuex-pathify";

// Utilities
import { ROOT_DISPATCH } from "@/store";

// Data
const state = {
  fontSize: 15,
  drawer: null,
  mobileMenu: null,
  nav: [],
  scrolling: false,
  search: false,
  settings: false,
  version: null,
};

const mutations = make.mutations(state);

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    const modules = ["pwa/init"];

    for (const module of modules) dispatch(module, null, ROOT_DISPATCH);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
