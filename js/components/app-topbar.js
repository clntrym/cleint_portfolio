// Component: AppTopbar
// Admin Header Bar
window.AppTopbar = {
  name: 'AppTopbar',
  props: {
    title: {
      type: String,
      default: 'Dashboard'
    }
  },
  emits: ['toggle-sidebar'],
  setup() {
    const store = window.AppStore;
    return { store };
  },
  template: `
    <header class="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 text-zinc-500 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Toggle menu"
        >
          <app-icon name="menu" :size="20"></app-icon>
        </button>
        <h1 class="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {{ title }}
        </h1>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- View Public Portfolio -->
        <router-link
          to="/"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <app-icon name="external-link" :size="13"></app-icon>
          <span class="hidden sm:inline">Live Portfolio</span>
        </router-link>

        <!-- Theme Toggle -->
        <button
          type="button"
          @click="store.toggleTheme()"
          class="p-2 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title="Toggle theme"
        >
          <app-icon :name="store.theme === 'dark' ? 'sun' : 'moon'" :size="17"></app-icon>
        </button>

        <!-- Profile Avatar Link -->
        <router-link
          to="/admin/profile"
          class="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
          title="Admin Profile"
        >
          {{ (store.auth.admin?.username || 'A')[0].toUpperCase() }}
        </router-link>
      </div>
    </header>
  `
};
