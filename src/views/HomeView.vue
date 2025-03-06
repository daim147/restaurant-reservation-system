<template>
  <div class="home-container">
    <!-- Page header -->
    <div class="page-header">
      <h2 class="page-title">Reservations</h2>

      <div class="action-buttons">
        <button @click="openAddBranchModal" class="btn btn-primary">Add Branches</button>

        <button
          @click="disableAllReservations"
          class="btn btn-danger"
          :disabled="isLoading || !reservationBranchesCount"
        >
          Disable All Reservations
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <loading-spinner v-if="isLoading" message="Loading branches..." />

    <!-- Error message -->
    <div v-else-if="error" class="error-message">
      <span class="error-icon">!</span>
      <p>{{ error }}</p>
      <button @click="fetchBranches" class="btn btn-secondary btn-sm">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!reservationBranchesCount" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>No Reservation Branches</h3>
      <p>No branches have reservations enabled yet.</p>
      <button @click="openAddBranchModal" class="btn btn-primary mt-3">Add Branches</button>
    </div>

    <!-- Branches table -->
    <div v-else class="table-container">
      <table class="branches-table" :class="{ responsive: isTablet, 'ultra-compact': isMobile }">
        <thead>
          <tr>
            <th>Branch Name</th>
            <th>Reference</th>
            <th>Tables</th>
            <th>Reservation Duration</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="branch in reservationBranches"
            :key="branch.id"
            class="table-row"
            @click="openSettingsModal(branch.id)"
          >
            <td>
              <div class="branch-name">{{ branch.name }}</div>
            </td>
            <td>
              <div class="reference-badge">{{ branch.reference || 'N/A' }}</div>
            </td>
            <td>
              <div class="tables-count">
                <span class="count">{{ getReservationTablesCount(branch) }}</span>
                <span class="label">tables</span>
              </div>
            </td>
            <td>
              <div class="duration-badge">
                <span v-if="branch.reservation_duration"
                  >{{ branch.reservation_duration }} mins</span
                >
                <span v-else class="not-set">Not set</span>
              </div>
            </td>
            <td class="actions-cell">
              <button class="btn btn-outline" @click.stop="openSettingsModal(branch.id)">
                Settings
              </button>
              <button
                class="btn btn-outline-danger"
                @click.stop="disableBranchReservation(branch.id)"
              >
                Disable
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

export default {
  name: 'HomeView',

  components: {
    LoadingSpinner,
  },

  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },

  computed: {
    ...mapState({
      error: state => state.error,
    }),
    ...mapGetters(['reservationBranches']),
    isLoading() {
      return this.$store.state.loading;
    },
    reservationBranchesCount() {
      return this.reservationBranches ? this.reservationBranches.length : 0;
    },
    isTablet() {
      return this.windowWidth <= 768;
    },
    isMobile() {
      return this.windowWidth <= 576;
    },
  },

  mounted() {
    this.fetchBranches();
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },

    async fetchBranches() {
      await this.$store.dispatch('fetchBranches');
    },

    getReservationTablesCount(branch) {
      if (!branch || !branch.sections) return 0;

      return branch.sections.reduce((count, section) => {
        if (!section.tables) return count;

        return count + section.tables.filter(table => table.accepts_reservations).length;
      }, 0);
    },

    openAddBranchModal() {
      this.$root.$emit('open-add-branch-modal');
    },

    openSettingsModal(branchId) {
      this.$root.$emit('open-settings-modal', branchId);
    },

    async disableBranchReservation(branchId) {
      if (confirm('Are you sure you want to disable reservations for this branch?')) {
        await this.$store.dispatch('disableBranchReservation', branchId);
      }
    },

    async disableAllReservations() {
      if (!this.reservationBranchesCount) return;

      if (confirm('Are you sure you want to disable reservations for all branches?')) {
        await this.$store.dispatch('disableAllReservations');
      }
    },
  },
};
</script>

<style src="./HomeView.css" scoped></style>
