// Component: AppFooter
// Minimalist Monochrome Public Footer
window.AppFooter = {
  name: 'AppFooter',
  props: {
    profile: {
      type: Object,
      default: () => ({})
    },
    socialLinks: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return { scrollToTop };
  },
  template: `
    <footer class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <!-- Brand & Copyright -->
          <div class="text-center md:text-left">
            <h4 class="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              {{ profile.name || 'Alex Morgan' }}
            </h4>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              &copy; {{ new Date().getFullYear() }} — Minimalist Monochrome Architecture. All rights reserved.
            </p>
          </div>

          <!-- Social Links -->
          <div v-if="socialLinks.length" class="flex items-center gap-3">
            <a
              v-for="link in socialLinks"
              :key="link.id"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
              :title="link.platform"
            >
              <app-icon :name="link.icon || 'globe'" :size="16"></app-icon>
            </a>
          </div>

          <!-- Back to Top -->
          <div>
            <button
              type="button"
              @click="scrollToTop"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <app-icon name="arrow-up" :size="14"></app-icon>
              <span>Back to top</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  `
};
