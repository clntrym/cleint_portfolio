// Component: AppNavbar
// Sticky public navigation bar with mobile drawer and theme toggle
window.AppNavbar = {
  name: 'AppNavbar',
  props: {
    siteTitle: {
      type: String,
      default: 'Alex Morgan'
    }
  },
  setup() {
    const isMobileMenuOpen = Vue.ref(false);
    const store = window.AppStore;
    const navItems = AppLabels.publicNav;

    // Secret triple tap logic on Brand / Name ("Alex Morgan")
    let brandTapCount = 0;
    let brandTapTimer = null;
    let singleTapScrollTimer = null;

    const handleBrandClick = () => {
      brandTapCount++;
      clearTimeout(brandTapTimer);
      clearTimeout(singleTapScrollTimer);

      if (brandTapCount >= 3) {
        brandTapCount = 0;
        if (window.AppAlerts) {
          window.AppAlerts.toast('Admin portal unlocked', 'success');
        }
        if (window.AppRouter) {
          window.AppRouter.push('/admin/login');
        } else {
          window.location.hash = '#/admin/login';
        }
        return;
      }

      // Reset tap counter if next tap doesn't arrive within 1 second
      brandTapTimer = setTimeout(() => {
        brandTapCount = 0;
      }, 1000);

      // Debounce single tap navigation to #hero so rapid taps are not disrupted
      singleTapScrollTimer = setTimeout(() => {
        if (brandTapCount === 1) {
          navigateTo('#hero');
        }
      }, 300);
    };

    const navigateTo = (href) => {
      isMobileMenuOpen.value = false;
      if (window.location.hash.startsWith('#/projects/')) {
        // If on project detail page, route back to home with hash
        if (window.AppRouter) {
          window.AppRouter.push('/').then(() => {
            setTimeout(() => AppNavigation.scrollTo(href), 100);
          });
          return;
        }
      }
      AppNavigation.scrollTo(href);
    };

    return {
      isMobileMenuOpen,
      store,
      navItems,
      navigateTo,
      handleBrandClick
    };
  },
  template: `
    <header class="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        <!-- Logo / Brand with Secret Triple Tap ("Alex Morgan") -->
        <a
          href="#hero"
          @click.prevent="handleBrandClick"
          class="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-950 dark:text-white flex items-center gap-2 select-none cursor-pointer touch-manipulation"
          style="touch-action: manipulation;"
          title="Home"
        >
          <span class="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono font-bold text-sm">
            AM
          </span>
          <span>{{ siteTitle || 'Alex Morgan' }}</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            @click.prevent="navigateTo(item.href)"
            class="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Right Tools: Theme Toggle (Admin button hidden) -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Theme Toggle -->
          <button
            type="button"
            @click="store.toggleTheme()"
            class="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            :title="store.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <app-icon :name="store.theme === 'dark' ? 'sun' : 'moon'" :size="18"></app-icon>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center gap-2">
          <button
            type="button"
            @click="store.toggleTheme()"
            class="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
          >
            <app-icon :name="store.theme === 'dark' ? 'sun' : 'moon'" :size="18"></app-icon>
          </button>
          
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            <app-icon :name="isMobileMenuOpen ? 'x' : 'menu'" :size="22"></app-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-3 animate-fade-in"
      >
        <div class="flex flex-col space-y-2">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            @click.prevent="navigateTo(item.href)"
            class="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg flex items-center gap-3"
          >
            <app-icon :name="item.icon" :size="16"></app-icon>
            <span>{{ item.label }}</span>
          </a>
        </div>
      </div>
    </header>
  `
};
