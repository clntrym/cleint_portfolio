// Navigation and DOM helper utilities
const AppNavigation = {
  scrollTo(targetId) {
    if (!targetId) return;
    const cleanId = targetId.replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  renderIcons() {
    Vue.nextTick(() => {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
  }
};
