<template>
  <modal-overlay
    :show="show"
    :title="branch ? `Edit ${branch.name} branch reservation settings` : 'Loading...'"
    @close="close"
  >
    <loading-spinner v-if="loading" message="Loading reservation settings..." />

    <div v-else-if="error" class="error-message">
      <div class="error-content">
        <i class="error-icon">!</i>
        <span>{{ error }}</span>
      </div>
      <button @click="clearError" class="btn-clear-error" title="Clear error">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div v-else>
      <!-- Branch Opening Hours Info -->
      <div v-if="branch" class="branch-hours-info">
        <div class="hours-label">Branch Operating Hours:</div>
        <div class="hours-value">
          <span>{{ formatTime(branch.opening_from) }} - {{ formatTime(branch.opening_to) }}</span>
          <span v-if="is24Hours" class="hours-tag">24 Hours</span>
        </div>
        <div class="hours-note">
          Note: It's best to set reservation times within the branch operating hours.
        </div>
      </div>

      <form @submit.prevent="saveSettings">
        <!-- Reservation Duration -->
        <div class="form-group">
          <label for="duration" class="form-label">Reservation Duration*</label>
          <div class="input-wrapper">
            <input
              id="duration"
              v-model.number="form.reservation_duration"
              type="number"
              min="15"
              required
              class="form-input"
            />
            <span class="input-addon">minutes</span>
          </div>
        </div>

        <!-- Tables -->
        <div class="form-group">
          <label class="form-label">Tables</label>
          <tables-view :tables="allTables" />
        </div>

        <!-- Time Slots -->
        <div class="time-slots-section">
          <h4 class="section-title">Reservation Time Slots</h4>

          <!-- Days of the week -->
          <div class="days-container">
            <day-card
              v-for="day in daysOfWeek"
              :key="day"
              :day="day"
              :time-slots="form.reservation_times[day]"
              :is-editing="isEditingDay(day)"
              :edit-slot="editingSlot || {}"
              @add-slot="addTimeSlot(day)"
              @edit-slot="editTimeSlot(day, $event)"
              @delete-slot="removeTimeSlot(day, $event)"
              @cancel-edit="cancelEditingSlot"
              @save-slot="saveTimeSlot($event)"
              @apply-all="applyToAllDays"
            />
          </div>
        </div>
      </form>
    </div>

    <!-- Modal Footer -->
    <template v-slot:footer>
      <button type="button" @click="close" class="btn secondary">Cancel</button>
      <button
        v-if="!error"
        type="button"
        @click="saveSettings"
        :disabled="isSaving"
        class="btn primary"
      >
        <span v-if="isSaving" class="btn-spinner"></span>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </template>
  </modal-overlay>
</template>

<script>
import api from '../api';
import ModalOverlay from './common/ModalOverlay.vue';
import LoadingSpinner from './common/LoadingSpinner.vue';
import TablesView from './reservation/TablesView.vue';
import DayCard from './reservation/DayCard.vue';

const daysInWeek = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default {
  name: 'ReservationSettingsModal',
  components: {
    ModalOverlay,
    LoadingSpinner,
    TablesView,
    DayCard,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    branchId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      branch: null,
      allTables: [],
      loading: true,
      error: null,
      isSaving: false,
      editingSlot: null,
      daysOfWeek: [...daysInWeek],
      form: this.getDefaultForm(),
    };
  },
  computed: {
    is24Hours() {
      return (
        this.branch && this.branch.opening_from === '00:00' && this.branch.opening_to === '00:00'
      );
    },
  },
  watch: {
    show(newVal) {
      if (newVal && this.branchId) {
        this.loadBranchData();
      }
    },
  },
  methods: {
    getDefaultForm() {
      const defaultTimes = {};
      daysInWeek.forEach(day => {
        defaultTimes[day] = [];
      });

      return {
        reservation_duration: 60,
        selected_tables: [],
        reservation_times: defaultTimes,
      };
    },
    clearError() {
      this.error = null;
    },
    isEditingDay(day) {
      return this.editingSlot && this.editingSlot.day === day;
    },

    async loadBranchData() {
      this.loading = true;
      this.error = null;
      this.form = this.getDefaultForm();

      try {
        const response = await api.getBranch(this.branchId);
        this.branch = response.data.data;

        // Initialize form with branch data
        this.initializeFormFromBranch();
      } catch (error) {
        console.error('Failed to load branch data:', error);
        this.error = 'Failed to load branch data. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    initializeFormFromBranch() {
      if (!this.branch) return;

      // Set reservation duration
      this.form.reservation_duration = this.branch.reservation_duration || 60;

      // Process reservation times
      if (this.branch.reservation_times) {
        this.daysOfWeek.forEach(day => {
          this.form.reservation_times[day] = Array.isArray(this.branch.reservation_times[day])
            ? [...this.branch.reservation_times[day]]
            : [];
        });
      }

      // Process tables
      this.allTables = [];
      this.form.selected_tables = [];

      if (this.branch.sections) {
        this.branch.sections.forEach(section => {
          if (section.tables) {
            section.tables.forEach(table => {
              this.allTables.push({
                id: table.id,
                name: table.name,
                section_name: section.name,
                accepts_reservations: table.accepts_reservations,
              });

              if (table.accepts_reservations) {
                this.form.selected_tables.push(table.id);
              }
            });
          }
        });
      }
    },

    formatTime(time) {
      if (!time) return '';

      // Convert 24-hour format to 12-hour format
      const [hours, minutes] = time.split(':');
      const hoursNum = parseInt(hours, 10);
      const period = hoursNum >= 12 ? 'PM' : 'AM';
      const displayHours = hoursNum % 12 || 12; // Convert 0 to 12 for 12 AM

      return `${displayHours}:${minutes} ${period}`;
    },

    close() {
      this.cancelEditingSlot();
      this.$emit('close');
    },

    addTimeSlot(day) {
      const startTime = '11:00';

      // Parse the start time
      const [startHours, startMinutes] = startTime.split(':').map(Number);

      // Calculate end time by adding reservation duration
      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0);

      const endDate = new Date(startDate.getTime() + this.form.reservation_duration * 60000);

      // Format end time as HH:MM
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      const endTime = `${endHours}:${endMinutes}`;

      this.editingSlot = {
        day,
        index: null,
        start: startTime,
        end: endTime,
      };
    },

    editTimeSlot(day, index) {
      const slot = this.form.reservation_times[day][index];
      this.editingSlot = {
        day,
        index,
        start: slot[0],
        end: slot[1],
      };
    },

    removeTimeSlot(day, index) {
      this.form.reservation_times[day].splice(index, 1);
    },

    cancelEditingSlot() {
      this.editingSlot = null;
    },

    saveTimeSlot(data) {
      if (!this.editingSlot) return;

      const { day, index } = this.editingSlot;
      const { start, end } = data;
      const newSlot = [start, end];

      if (index !== null) {
        // Update existing slot
        this.form.reservation_times[day].splice(index, 1, newSlot);
      } else {
        // Add new slot
        this.form.reservation_times[day].push(newSlot);
        // Sort slots by start time
        this.form.reservation_times[day].sort((a, b) => a[0].localeCompare(b[0]));
      }

      this.cancelEditingSlot();
    },

    applyToAllDays() {
      const saturdaySlots = [...this.form.reservation_times.saturday];

      this.daysOfWeek.forEach(day => {
        if (day !== 'saturday') {
          this.form.reservation_times[day] = [...saturdaySlots];
        }
      });
    },

    confirmUnsavedChanges() {
      if (!this.editingSlot) return Promise.resolve(true);

      return new Promise(resolve => {
        if (confirm('You have unsaved time slot changes. Save them before continuing?')) {
          this.saveTimeSlot({
            start: this.editingSlot.start,
            end: this.editingSlot.end,
          });
          resolve(true);
        } else {
          this.cancelEditingSlot();
          resolve(true);
        }
      });
    },

    async saveSettings() {
      await this.confirmUnsavedChanges();

      this.isSaving = true;
      this.error = null;

      try {
        // Update branch reservation settings
        await api.updateBranchSettings(this.branchId, {
          reservation_duration: this.form.reservation_duration,
          reservation_times: this.form.reservation_times,
        });

        this.$emit('settings-updated');
        this.close();
      } catch (error) {
        console.error('Failed to save reservation settings:', error);

        // Handle detailed error messages from the API
        let errorMessage = 'Failed to save settings.';

        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            // Get the first error key and its first value
            const errorKeys = Object.keys(error.response.data.errors);
            if (errorKeys.length > 0) {
              const firstKey = errorKeys[0];
              const firstValue = error.response.data.errors[firstKey][0];
              errorMessage = `Error with ${firstKey}: ${firstValue}`;
            }
          } else if (error.response.data.message) {
            // Fallback to the generic message if available
            errorMessage = error.response.data.message;
          }
        }

        this.error = errorMessage;
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>

<style src="./ReservationSettingsModal.css" scoped></style>
