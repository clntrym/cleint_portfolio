// Component: ConfirmModal
// Minimalist confirmation dialog
window.ConfirmModal = {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel'],
  template: `
    <app-modal :is-open="isOpen" :title="title" max-width="max-w-md" @close="$emit('cancel')">
      <div class="py-2">
        <p class="text-sm text-zinc-600 dark:text-zinc-400">{{ message }}</p>
      </div>
      <template #footer>
        <button
          type="button"
          @click="$emit('cancel')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="$emit('confirm')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
          {{ confirmText }}
        </button>
      </template>
    </app-modal>
  `
};
