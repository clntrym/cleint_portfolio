// Global Reactive Store using Vue 3 reactive
const { reactive } = Vue;

const savedTheme = localStorage.getItem('portfolio_theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

window.AppStore = reactive({
  auth: {
    isAuthenticated: false,
    admin: null,
    loading: true
  },
  theme: savedTheme,
  profile: null,
  settings: {},
  unreadMessagesCount: 0,

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio_theme', this.theme);
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setTheme(themeName) {
    this.theme = themeName === 'dark' ? 'dark' : 'light';
    localStorage.setItem('portfolio_theme', this.theme);
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setAuth(adminData) {
    this.auth.isAuthenticated = !!adminData;
    this.auth.admin = adminData || null;
    this.auth.loading = false;
  },

  async checkAuth() {
    this.auth.loading = true;
    try {
      const res = await AppApi.get('api/auth.php', { action: 'check' });
      if (res && res.authenticated) {
        this.setAuth(res.admin);
      } else {
        this.setAuth(null);
      }
    } catch (err) {
      this.setAuth(null);
    } finally {
      this.auth.loading = false;
    }
    return this.auth.isAuthenticated;
  },

  async login(username, password) {
    const res = await AppApi.post('api/auth.php?action=login', { username, password });
    if (res && res.success) {
      this.setAuth(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  },

  async logout() {
    try {
      await AppApi.post('api/auth.php?action=logout');
    } catch (e) {
      console.warn('Logout error', e);
    }
    this.setAuth(null);
    if (window.AppRouter) {
      window.AppRouter.push('/admin/login');
    }
  },

  async fetchUnreadCount() {
    if (!this.auth.isAuthenticated) return;
    try {
      const res = await AppApi.get('api/messages.php');
      if (res && res.success) {
        this.unreadMessagesCount = res.unread_count || 0;
      }
    } catch (e) {}
  }
});
