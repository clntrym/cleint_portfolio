// Router Configuration using VueRouter 4
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
  // Public Routes
  { path: '/', name: 'Home', component: window.HomePage },
  { path: '/projects/:slug', name: 'ProjectDetail', component: window.ProjectDetailPage },

  // Admin Auth
  { path: '/admin/login', name: 'AdminLogin', component: window.AdminLoginPage },

  // Protected Admin Routes
  { path: '/admin', name: 'AdminDashboard', component: window.AdminDashboardPage, meta: { requiresAuth: true } },
  { path: '/admin/profile', name: 'AdminProfile', component: window.AdminProfilePage, meta: { requiresAuth: true } },
  { path: '/admin/projects', name: 'AdminProjects', component: window.AdminProjectsPage, meta: { requiresAuth: true } },
  { path: '/admin/skills', name: 'AdminSkills', component: window.AdminSkillsPage, meta: { requiresAuth: true } },
  { path: '/admin/experience', name: 'AdminExperience', component: window.AdminExperiencePage, meta: { requiresAuth: true } },
  { path: '/admin/education', name: 'AdminEducation', component: window.AdminEducationPage, meta: { requiresAuth: true } },
  { path: '/admin/resume', name: 'AdminResume', component: window.AdminResumePage, meta: { requiresAuth: true } },
  { path: '/admin/messages', name: 'AdminMessages', component: window.AdminMessagesPage, meta: { requiresAuth: true } },
  { path: '/admin/social-links', name: 'AdminSocialLinks', component: window.AdminSocialLinksPage, meta: { requiresAuth: true } },
  { path: '/admin/settings', name: 'AdminSettings', component: window.AdminSettingsPage, meta: { requiresAuth: true } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: window.NotFoundPage }
];

window.AppRouter = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Navigation Guards
window.AppRouter.beforeEach(async (to, from, next) => {
  const store = window.AppStore;

  // Check auth status if needed
  if (to.meta.requiresAuth || to.path === '/admin/login') {
    const isAuthed = await store.checkAuth();

    if (to.meta.requiresAuth && !isAuthed) {
      return next({ path: '/admin/login', query: { redirect: to.fullPath } });
    }

    if (to.path === '/admin/login' && isAuthed) {
      return next({ path: '/admin' });
    }
  }

  next();
});

window.AppRouter.afterEach(() => {
  AppNavigation.renderIcons();
});
