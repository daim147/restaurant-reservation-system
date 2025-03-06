<template>
  <div class="slot-editor">
    <div class="time-inputs">
      <div class="time-input-group">
        <label class="time-label">Start Time</label>
        <input type="time" v-model="startTime" class="time-input" required />
      </div>
      <div class="time-divider">to</div>
      <div class="time-input-group">
        <label class="time-label">End Time</label>
        <input type="time" v-model="endTime" class="time-input" required />
      </div>
    </div>
    <div class="editor-actions">
      <button type="button" class="btn secondary" @click="$emit('cancel')">Cancel</button>
      <button type="button" class="btn primary" @click="saveSlot">Save</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeSlotEditor',
  props: {
    initialStart: {
      type: String,
      default: '11:00',
    },
    initialEnd: {
      type: String,
      default: '17:00',
    },
  },
  data() {
    return {
      startTime: this.initialStart,
      endTime: this.initialEnd,
    };
  },
  methods: {
    saveSlot() {
      if (!this.startTime || !this.endTime || this.startTime >= this.endTime) {
        alert('Please enter valid start and end times');
        return;
      }
      this.$emit('save', {
        start: this.startTime,
        end: this.endTime,
      });
    },
  },
};
</script>

<style src="./TimeSlotEditor.css" scoped></style>
