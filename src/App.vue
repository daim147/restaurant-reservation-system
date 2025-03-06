<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto">
      <app-header />

      <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg">
        <HomeView />
      </div>

      <!-- Modals -->
      <AddBranchModal
        :show="showAddBranchModal"
        @close="showAddBranchModal = false"
        @branches-updated="refreshBranches"
      />

      <ReservationSettingsModal
        :show="showSettingsModal"
        :branch-id="selectedBranchId"
        @close="closeSettingsModal"
        @settings-updated="refreshBranches"
      />
    </div>
  </div>
</template>

<script>
import HomeView from './views/HomeView.vue';
import AddBranchModal from './components/AddBranchModal.vue';
import ReservationSettingsModal from './components/ReservationSettingsModal.vue';
import AppHeader from './components/common/AppHeader';

export default {
  name: 'App',
  components: {
    AppHeader,
    HomeView,
    AddBranchModal,
    ReservationSettingsModal,
  },
  data() {
    return {
      showAddBranchModal: false,
      showSettingsModal: false,
      selectedBranchId: null,
    };
  },
  created() {
    // Event bus listeners
    this.$root.$on('open-add-branch-modal', this.openAddBranchModal);
    this.$root.$on('open-settings-modal', this.openSettingsModal);
  },
  beforeDestroy() {
    // Clean up event bus listeners
    this.$root.$off('open-add-branch-modal', this.openAddBranchModal);
    this.$root.$off('open-settings-modal', this.openSettingsModal);
  },
  methods: {
    openAddBranchModal() {
      this.showAddBranchModal = true;
    },

    openSettingsModal(branchId) {
      this.selectedBranchId = branchId;
      this.showSettingsModal = true;
    },

    refreshBranches() {
      this.$store.dispatch('fetchBranches');
    },

    closeSettingsModal() {
      this.showSettingsModal = false;
      this.selectedBranchId = null;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

button:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>
