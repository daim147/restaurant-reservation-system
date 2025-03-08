<template>
  <modal-overlay
    :show="show"
    title="Add Branches"
    @close="close"
    @confirm="saveBranches"
    :confirmText="isSaving ? 'Saving...' : 'Save'"
    :confirmDisabled="isSaving || !selectedBranches.length"
  >
    <loading-spinner v-if="loading" message="Loading branches..." />

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else-if="!availableBranches.length" class="empty-message">
      No branches available to add
    </div>

    <div v-else class="branch-selector">
      <!-- Selected branches chips -->
      <div class="selected-branches">
        <div v-if="!selectedBranches.length" class="placeholder">Select branches to add</div>
        <div v-else class="chips-container">
          <div v-for="branchId in selectedBranches" :key="branchId" class="chip">
            {{ getBranchName(branchId) }}
            <span class="remove-chip" @click.stop="removeBranch(branchId)">&times;</span>
          </div>
        </div>
      </div>

      <!-- Dropdown selector -->
      <div class="dropdown-container">
        <div class="dropdown-trigger" @click="toggleDropdown">
          <span>{{ isDropdownOpen ? 'Close' : 'Select branches' }}</span>
          <span class="dropdown-icon">{{ isDropdownOpen ? '▲' : '▼' }}</span>
        </div>

        <div v-if="isDropdownOpen" class="dropdown-menu">
          <div class="dropdown-options">
            <div
              v-for="branch in availableBranches"
              :key="branch.id"
              class="dropdown-option"
              :class="{ selected: isSelected(branch.id) }"
              @click.stop="toggleBranchSelection(branch.id)"
            >
              <span class="option-checkbox" :class="{ checked: isSelected(branch.id) }"></span>
              <span class="branch-name-text">
                {{ formatBranchName(branch) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal-overlay>
</template>

<script>
import ModalOverlay from './common/ModalOverlay.vue';
import LoadingSpinner from './common/LoadingSpinner.vue';
import api from '../api';

export default {
  name: 'AddBranchModal',
  components: {
    ModalOverlay,
    LoadingSpinner,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      availableBranches: [],
      selectedBranches: [],
      loading: false,
      error: null,
      isSaving: false,
      isDropdownOpen: false,
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.loadAvailableBranches();
        this.isDropdownOpen = false;
      }
    },
  },
  methods: {
    close() {
      this.$emit('close');
      this.selectedBranches = [];
      this.isDropdownOpen = false;
    },

    formatBranchName(branch) {
      return `${branch.name}${branch.reference ? ` (${branch.reference})` : ''}`;
    },

    getBranchName(branchId) {
      const branch = this.availableBranches.find(b => b.id === branchId);
      return branch ? this.formatBranchName(branch) : branchId;
    },

    async loadAvailableBranches() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.getBranches();
        const branches = response.data?.data || [];

        // Filter branches that don't accept reservations
        this.availableBranches = branches.filter(branch => !branch.accepts_reservations);

        // Auto-open dropdown if there are available branches
        if (this.availableBranches.length) {
          this.isDropdownOpen = true;
        }
      } catch (error) {
        this.error = `Failed to load branches: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },

    async saveBranches() {
      if (!this.selectedBranches.length) return;

      this.isSaving = true;
      this.error = null;

      try {
        // Enable reservations for selected branches
        await Promise.all(
          this.selectedBranches.map(branchId =>
            api.updateBranchSettings(branchId, { accepts_reservations: true })
          )
        );

        this.$emit('branches-updated');
        this.close();
      } catch (error) {
        this.error = `Failed to save branch changes. ${error.message}`;
      } finally {
        this.isSaving = false;
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    isSelected(branchId) {
      return this.selectedBranches.includes(branchId);
    },

    toggleBranchSelection(branchId) {
      const index = this.selectedBranches.indexOf(branchId);
      if (index !== -1) {
        this.selectedBranches.splice(index, 1); // Remove
      } else {
        this.selectedBranches.push(branchId); // Add
      }
    },

    removeBranch(branchId) {
      const index = this.selectedBranches.indexOf(branchId);
      if (index !== -1) {
        this.selectedBranches.splice(index, 1);
      }
    },
  },
};
</script>

<style src="./AddBranchModal.css" scoped></style>
