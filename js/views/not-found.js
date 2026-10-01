// View: NotFoundPage
window.NotFoundPage = {
  name: 'NotFoundPage',
  components: {
    AppIcon: window.AppIcon
  },
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-center transition-colors">
      <div class="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-6">
        <app-icon name="compass" :size="32" class-name="text-zinc-400"></app-icon>
      </div>

      <h1 class="text-6xl font-extrabold tracking-tight font-mono mb-2">404</h1>
      <h2 class="text-xl font-bold mb-3">Page Not Found</h2>
      <p class="text-sm text-zinc-500 max-w-sm mb-8">
        The requested path does not exist or has been relocated within the portfolio system.
      </p>

      <div class="flex items-center gap-4">
        <router-link
          to="/"
          class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          Back to Homepage
        </router-link>

        <router-link
          to="/admin"
          class="btn border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          Admin Console
        </router-link>
      </div>
    </div>
  `
};
