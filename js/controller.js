// Application Controller & Root Initializer
(function() {
  const { createApp } = Vue;

  const App = {
    setup() {
      const store = window.AppStore;

      Vue.onMounted(async () => {
        await store.checkAuth();
        if (store.auth.isAuthenticated) {
          await store.fetchUnreadCount();
        }
        AppNavigation.renderIcons();
      });

      return { store };
    },
    template: `
      <div id="portfolio-app-root" class="w-full min-h-screen">
        <router-view></router-view>
      </div>
    `
  };

  const app = createApp(App);

  // Register Global Components
  if (window.AppIcon) app.component('AppIcon', window.AppIcon);
  if (window.StatusBadge) app.component('StatusBadge', window.StatusBadge);
  if (window.FormField) app.component('FormField', window.FormField);
  if (window.AppModal) app.component('AppModal', window.AppModal);
  if (window.ConfirmModal) app.component('ConfirmModal', window.ConfirmModal);

  // Use Router
  app.use(window.AppRouter);

  // Mount
  app.mount('#app');

  // Trigger Lucide icons
  window.addEventListener('DOMContentLoaded', () => {
    AppNavigation.renderIcons();
  });
})();
