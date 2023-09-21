import { make } from "vuex-pathify";

const state = {
  pagination: {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false,
  },
  itemsPerPage: 10,
  itemsPerPageArray: [10, 15, 20, 25, 30],
  total: 0,
  items: [],
  requested_at: null,
};
const mutations = {
  ...make.mutations(state),
  RESET_ITEMS(state) {
    state.pagination = {
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    };
    state.total = 0;
    state.items = [];
  },
};

const getters = make.getters(state);

const actions = {
  ...make.actions(state),
  resetItems: ({ commit }) => {
    return new Promise((resolve) => {
      commit("RESET_ITEMS");
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
