<template>
  <div class="day-card">
    <div class="day-header">
      <span class="day-name">{{ capitalizeFirstLetter(day) }}</span>
      <button
        v-if="day === 'saturday'"
        type="button"
        class="apply-all-btn"
        @click="$emit('apply-all')"
      >
        Apply to all days
      </button>
    </div>

    <div class="time-slots">
      <!-- Display existing time slots -->
      <div v-for="(slot, index) in timeSlots" :key="`${day}-${index}`" class="time-slot-item">
        <div class="slot-times">{{ slot[0] }} - {{ slot[1] }}</div>
        <div class="slot-actions">
          <button
            type="button"
            class="action-btn edit-btn"
            @click="$emit('edit-slot', index)"
            title="Edit time slot"
          >
            ✏️
          </button>
          <button
            type="button"
            class="action-btn delete-btn"
            @click="$emit('delete-slot', index)"
            title="Remove time slot"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Time slot editor when adding/editing -->
      <time-slot-editor
        v-if="isEditing"
        :initial-start="editSlot.start"
        :initial-end="editSlot.end"
        @save="saveTimeSlot"
        @cancel="$emit('cancel-edit')"
      />

      <!-- Add new time slot button -->
      <button
        v-if="!isEditing && timeSlots.length < 3"
        type="button"
        class="add-slot-btn"
        @click="$emit('add-slot')"
      >
        <span class="add-icon">+</span> Add Time Slot
      </button>
    </div>
  </div>
</template>

<script>
import TimeSlotEditor from './TimeSlotEditor.vue';

export default {
  name: 'DayCard',
  components: {
    TimeSlotEditor,
  },
  props: {
    day: {
      type: String,
      required: true,
    },
    timeSlots: {
      type: Array,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    editSlot: {
      type: Object,
      default: () => ({ start: '', end: '' }),
    },
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    saveTimeSlot(data) {
      this.$emit('save-slot', data);
    },
  },
};
</script>

<style src="./DayCard.css" scoped></style>
