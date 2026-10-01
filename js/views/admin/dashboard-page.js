// View: Admin Dashboard Overview (/admin)
window.AdminDashboardPage = {
  name: 'AdminDashboardPage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    StatusBadge: window.StatusBadge
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const stats = Vue.ref({});
    const recentProjects = Vue.ref([]);
    const recentMessages = Vue.ref([]);
    const store = window.AppStore;

    const loadDashboard = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Stats.get();
        if (res && res.success) {
          stats.value = res.data.stats || {};
          recentProjects.value = res.data.recent_projects || [];
          recentMessages.value = res.data.recent_messages || [];
          store.unreadMessagesCount = stats.value.unread_messages || 0;
        }
      } catch (err) {
        AppAlerts.error('Failed to load stats', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    Vue.onMounted(loadDashboard);

    return {
      isSidebarOpen,
      loading,
      stats,
      recentProjects,
      recentMessages,
      store
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="System Overview" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          <!-- Loading state -->
          <div v-if="loading" class="py-20 text-center">
            <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-xs font-mono text-zinc-500">Retrieving system metrics...</p>
          </div>

          <div v-else class="space-y-8 animate-fade-in">
            
            <!-- Welcome Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <div>
                <h2 class="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Welcome, {{ store.auth.admin?.username || 'Administrator' }}
                </h2>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Manage projects, update biographical info, and check contact inquiries.
                </p>
              </div>

              <div class="flex items-center gap-3">
                <router-link
                  to="/admin/projects"
                  class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <app-icon name="plus" :size="14"></app-icon>
                  <span>New Project</span>
                </router-link>

                <router-link
                  to="/admin/profile"
                  class="btn border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <app-icon name="user" :size="14"></app-icon>
                  <span>Edit Profile</span>
                </router-link>
              </div>
            </div>

            <!-- Stats Metric Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Total Projects</span>
                  <app-icon name="folder-git-2" :size="18" class-name="text-zinc-400"></app-icon>
                </div>
                <div class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {{ stats.total_projects || 0 }}
                </div>
                <div class="text-[11px] text-zinc-500 mt-2">
                  {{ stats.published_projects || 0 }} published live
                </div>
              </div>

              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Skills Active</span>
                  <app-icon name="cpu" :size="18" class-name="text-zinc-400"></app-icon>
                </div>
                <div class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {{ stats.total_skills || 0 }}
                </div>
                <div class="text-[11px] text-zinc-500 mt-2">
                  Technical proficiencies
                </div>
              </div>

              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Experience</span>
                  <app-icon name="briefcase" :size="18" class-name="text-zinc-400"></app-icon>
                </div>
                <div class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {{ stats.total_experience || 0 }}
                </div>
                <div class="text-[11px] text-zinc-500 mt-2">
                  Career timeline records
                </div>
              </div>

              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Inbox Messages</span>
                  <app-icon name="mail" :size="18" class-name="text-zinc-400"></app-icon>
                </div>
                <div class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-mono">
                  {{ stats.total_messages || 0 }}
                </div>
                <div class="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 mt-2">
                  <span class="text-red-500 dark:text-red-400">{{ stats.unread_messages || 0 }}</span> unread
                </div>
              </div>

            </div>

            <!-- Two Column Overview Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Recent Projects Card -->
              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 class="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <app-icon name="folder-git-2" :size="16"></app-icon>
                    <span>Recent Projects</span>
                  </h3>
                  <router-link to="/admin/projects" class="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white">
                    View All →
                  </router-link>
                </div>

                <div v-if="recentProjects.length" class="space-y-3">
                  <div
                    v-for="p in recentProjects"
                    :key="p.id"
                    class="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <h4 class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ p.title }}</h4>
                      <p class="text-xs text-zinc-500 font-mono">{{ p.category }} • {{ new Date(p.created_at).toLocaleDateString() }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <status-badge :status="p.published" variant="published"></status-badge>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-zinc-400 text-xs">
                  No projects added yet.
                </div>
              </div>

              <!-- Recent Messages Card -->
              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 class="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <app-icon name="inbox" :size="16"></app-icon>
                    <span>Recent Messages</span>
                  </h3>
                  <router-link to="/admin/messages" class="text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white">
                    View Inbox →
                  </router-link>
                </div>

                <div v-if="recentMessages.length" class="space-y-3">
                  <div
                    v-for="m in recentMessages"
                    :key="m.id"
                    class="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-xs text-zinc-900 dark:text-zinc-100">{{ m.name }}</span>
                      <status-badge :status="m.is_read" variant="unread"></status-badge>
                    </div>
                    <p class="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{{ m.subject }}</p>
                    <p class="text-[11px] text-zinc-400 font-mono mt-1">{{ m.email }} • {{ new Date(m.created_at).toLocaleDateString() }}</p>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-zinc-400 text-xs">
                  Inbox is empty.
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  `
};
