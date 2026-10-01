// View: Admin SettingsPage (/admin/settings)
window.AdminSettingsPage = {
  name: 'AdminSettingsPage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    FormField: window.FormField
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const savingSettings = Vue.ref(false);
    const savingPassword = Vue.ref(false);

    const settings = Vue.reactive({
      website_name: '',
      website_title: '',
      meta_description: '',
      contact_email: '',
      theme_preference: 'light',
      portfolio_visibility: '1',
      maintenance_mode: '0'
    });

    const passwordForm = Vue.reactive({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });

    const loadSettings = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Settings.get();
        if (res && res.success && res.data) {
          Object.assign(settings, res.data);
        }
      } catch (err) {
        AppAlerts.error('Failed to load settings', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const saveSettings = async () => {
      savingSettings.value = true;
      try {
        await AppModel.Settings.update({ ...settings });
        AppAlerts.toast('Site settings saved.');
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        savingSettings.value = false;
      }
    };

    const changePassword = async () => {
      if (!passwordForm.current_password || !passwordForm.new_password) {
        AppAlerts.toast('Please enter current and new passwords.', 'error');
        return;
      }
      if (passwordForm.new_password !== passwordForm.confirm_password) {
        AppAlerts.toast('New passwords do not match.', 'error');
        return;
      }
      if (passwordForm.new_password.length < 6) {
        AppAlerts.toast('Password must be at least 6 characters.', 'error');
        return;
      }

      savingPassword.value = true;
      try {
        const res = await AppApi.post('api/auth.php?action=change_password', {
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        });
        if (res.success) {
          AppAlerts.toast('Admin password updated successfully.');
          passwordForm.current_password = '';
          passwordForm.new_password = '';
          passwordForm.confirm_password = '';
        }
      } catch (err) {
        AppAlerts.error('Password Update Failed', err.message);
      } finally {
        savingPassword.value = false;
      }
    };

    Vue.onMounted(loadSettings);

    return {
      isSidebarOpen,
      loading,
      savingSettings,
      savingPassword,
      settings,
      passwordForm,
      saveSettings,
      changePassword
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="System Configuration" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-8">
          
          <div v-if="loading" class="py-20 text-center">
            <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-xs font-mono text-zinc-500">Loading settings...</p>
          </div>

          <div v-else class="space-y-8 animate-fade-in">
            
            <!-- Global Website Settings -->
            <form @submit.prevent="saveSettings" class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Global Website Configuration</h2>
                <p class="text-xs text-zinc-500 mt-0.5">Control website identity, default theme, and visibility modes.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form-field label="Website Brand Name" v-model="settings.website_name" placeholder="Alex Morgan"></form-field>
                <form-field label="Notification / Contact Email" v-model="settings.contact_email" placeholder="alex.morgan@example.com"></form-field>
              </div>

              <form-field label="Default Browser Page Title" v-model="settings.website_title" placeholder="Alex Morgan — Full-Stack Developer"></form-field>
              
              <form-field
                label="Global Meta Description (SEO)"
                type="textarea"
                :rows="2"
                v-model="settings.meta_description"
                placeholder="Brief summary for search engine results..."
              ></form-field>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <form-field
                  label="Default Theme Style"
                  type="select"
                  v-model="settings.theme_preference"
                  :options="[
                    { label: 'Minimalist Light (Default)', value: 'light' },
                    { label: 'Minimalist Dark', value: 'dark' }
                  ]"
                ></form-field>
              </div>

              <div class="flex items-center justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="submit"
                  :disabled="savingSettings"
                  class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <span v-if="savingSettings" class="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                  <app-icon v-else name="save" :size="14"></app-icon>
                  <span>{{ savingSettings ? 'Saving...' : 'Save Settings' }}</span>
                </button>
              </div>
            </form>

            <!-- Admin Security & Password Change -->
            <form @submit.prevent="changePassword" class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Admin Account Security</h2>
                <p class="text-xs text-zinc-500 mt-0.5">Change your admin console password securely.</p>
              </div>

              <div class="space-y-4 max-w-md">
                <form-field
                  label="Current Password"
                  type="password"
                  v-model="passwordForm.current_password"
                  placeholder="••••••••"
                  required
                ></form-field>

                <form-field
                  label="New Password (min 6 chars)"
                  type="password"
                  v-model="passwordForm.new_password"
                  placeholder="••••••••"
                  required
                ></form-field>

                <form-field
                  label="Confirm New Password"
                  type="password"
                  v-model="passwordForm.confirm_password"
                  placeholder="••••••••"
                  required
                ></form-field>
              </div>

              <div class="flex items-center justify-start pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="submit"
                  :disabled="savingPassword"
                  class="btn border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <span v-if="savingPassword" class="w-3.5 h-3.5 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin"></span>
                  <app-icon v-else name="key" :size="14"></app-icon>
                  <span>Update Password</span>
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>
    </div>
  `
};
