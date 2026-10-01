// Component: AppSidebar
// Admin CMS Sidebar Navigation
window.AppSidebar = {
  name: 'AppSidebar',
  props: {
    isMobileOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup() {
    const store = window.AppStore;
    const navItems = AppLabels.adminNav;
    const route = VueRouter.useRoute();

    const isActive = (path) => {
      if (path === '/admin') {
        return route.path === '/admin';
      }
      return route.path.startsWith(path);
    };

    return {
      store,
      navItems,
      isActive
    };
  },
  template: `
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar Container -->
    <aside
      class="fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-200"
      :class="isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div>
        <!-- Brand Header -->
        <div class="h-16 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <router-link to="/admin" class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono font-bold text-xs">
              CMS
            </span>
            <div>
              <span class="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 block">Admin Console</span>
              <span class="text-[10px] text-zinc-500 font-mono block">v2.0 • Monochrome</span>
            </div>
          </router-link>

          <button
            type="button"
            @click="$emit('close')"
            class="lg:hidden p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <app-icon name="x" :size="20"></app-icon>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
            :class="isActive(item.path)
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'"
          >
            <div class="flex items-center gap-3">
              <app-icon :name="item.icon" :size="17"></app-icon>
              <span>{{ item.name }}</span>
            </div>

            <!-- Unread badge on Messages -->
            <span
              v-if="item.badge && Boolean(store.unreadMessagesCount)"
              class="px-1.5 py-0.5 text-[11px] font-bold rounded-full"
              :class="isActive(item.path)
                ? 'bg-white text-black dark:bg-black dark:text-white'
                : 'bg-black text-white dark:bg-white dark:text-black'"
            >
              {{ store.unreadMessagesCount }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Footer Info & Logout -->
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center justify-between mb-3 px-2">
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
              {{ store.auth.admin?.username || 'Administrator' }}
            </span>
          </div>
          <button
            type="button"
            @click="store.toggleTheme()"
            class="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded"
            title="Toggle theme"
          >
            <app-icon :name="store.theme === 'dark' ? 'sun' : 'moon'" :size="15"></app-icon>
          </button>
        </div>

        <button
          type="button"
          @click="store.logout()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <app-icon name="log-out" :size="14"></app-icon>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  `
};
