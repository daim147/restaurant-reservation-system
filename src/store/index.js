import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    branches: [],
    loading: false,
    error: null,
  },

  getters: {
    // Get branches that accept reservations
    reservationBranches: state => {
      return state.branches.filter(branch => branch.accepts_reservations);
    },
  },

  mutations: {
    SET_BRANCHES(state, branches) {
      state.branches = branches;
    },

    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },

    UPDATE_BRANCH(state, updatedBranch) {
      state.branches = state.branches.map(branch =>
        branch.id === updatedBranch.id ? { ...branch, ...updatedBranch } : branch
      );
    },
  },

  actions: {
    // Fetch all branches with sections and tables
    async fetchBranches({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.getBranches();
        commit('SET_BRANCHES', response.data.data);
        commit('SET_ERROR', null);
      } catch (error) {
        console.error('Error fetching branches:', error);
        commit('SET_ERROR', 'Failed to fetch branches. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Disable reservations for a branch
    async disableBranchReservation({ commit }, branchId) {
      try {
        commit('SET_LOADING', true);
        await api.disableBranchReservation(branchId);
        commit('UPDATE_BRANCH', { id: branchId, accepts_reservations: false });
        commit('SET_ERROR', null);
      } catch (error) {
        console.error('Error disabling branch reservation:', error);
        commit('SET_ERROR', 'Failed to disable reservations. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Disable all branch reservations
    async disableAllReservations({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const reservationBranches = state.branches.filter(branch => branch.accepts_reservations);

        for (const branch of reservationBranches) {
          await api.disableBranchReservation(branch.id);
          commit('UPDATE_BRANCH', { id: branch.id, accepts_reservations: false });
        }

        commit('SET_ERROR', null);
      } catch (error) {
        console.error('Error disabling all reservations:', error);
        commit('SET_ERROR', 'Failed to disable all reservations. Please try again.');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
});
