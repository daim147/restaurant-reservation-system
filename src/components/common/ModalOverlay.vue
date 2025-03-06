<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header sticky-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button @click="$emit('close')" class="close-button" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <slot></slot>
        </div>

        <div class="modal-footer sticky-footer">
          <slot name="footer">
            <button type="button" @click="$emit('close')" class="btn secondary">Cancel</button>
            <button
              type="button"
              @click="$emit('confirm')"
              class="btn primary"
              :disabled="confirmDisabled"
            >
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalOverlay',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    confirmDisabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show(newVal) {
      // Toggle body scroll lock when modal opens/closes
      document.body.style.overflow = newVal ? 'hidden' : '';
    },
  },
  beforeDestroy() {
    // Ensure scroll is restored when component is destroyed
    document.body.style.overflow = '';
  },
};
</script>

<style src="./ModalOverlay.css" scoped></style>
