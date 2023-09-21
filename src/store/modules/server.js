// Pathify
import { make } from "vuex-pathify";

const attrs = {
  params: {
    query: null,
    page: 1,
    column: [],
    order: [],
  },
  requestedAt: null,
  headers: [],
  expanded: [],
  items: [],
  itemsPerPage: 10,
  pagination: {},
  total: 0,
  pageCount: 0,
};

const state = {
  subscriptions: attrs,
  bookings: attrs,
  payments: attrs,
  profiles: attrs,
};

export default {
  namespaced: true,
  actions: {
    ...make.actions(state),
    reset: ({ commit }, payload) => {
      return new Promise((resolve) => {
        commit("RESET_STATE", payload);
        resolve();
      });
    },
  },
  getters: make.getters(state),
  mutations: {
    ...make.mutations(state),
    RESET_STATE(state, payload) {
      Object.assign(state[payload], attrs);;
    },
  },
  state,
};
