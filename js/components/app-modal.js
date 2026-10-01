// Component: AppModal
// Accessible dialog modal styled in pure monochrome
window.AppModal = {
  name: 'AppModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: 'max-w-2xl'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleBackdrop = (e) => {
      if (e.target === e.currentTarget) {
        emit('close');
      }
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape' && props.isOpen) {
        emit('close');
      }
    };

    Vue.onMounted(() => window.addEventListener('keydown', handleKeydown));
    Vue.onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

    return { handleBackdrop };
  },
  template: `
    <teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        @click="handleBackdrop"
      >
        <div
          class="relative w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          :class="maxWidth"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{{ title }}</h3>
              <p v-if="subtitle" class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{{ subtitle }}</p>
            </div>
            <button
              type="button"
              @click="$emit('close')"
              class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <app-icon name="x" :size="20"></app-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 overflow-y-auto flex-1">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </teleport>
  `
};
