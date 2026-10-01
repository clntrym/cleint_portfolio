// View: Admin ProfilePage (/admin/profile)
window.AdminProfilePage = {
  name: 'AdminProfilePage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    FormField: window.FormField
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const saving = Vue.ref(false);
    const uploadingImage = Vue.ref(false);

    const profile = Vue.reactive({
      name: '',
      title: '',
      short_bio: '',
      biography: '',
      career_goals: '',
      email: '',
      phone: '',
      location: '',
      profile_image: '',
      availability: 'Available for freelance & full-time',
      website_title: '',
      website_description: ''
    });

    const loadProfile = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Profile.get();
        if (res && res.success && res.data) {
          Object.assign(profile, res.data);
        }
      } catch (err) {
        AppAlerts.error('Failed to load profile', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadingImage.value = true;
      try {
        const res = await AppApi.upload(file, 'profile');
        if (res.success && res.url) {
          profile.profile_image = res.url;
          AppAlerts.toast('Profile image uploaded.', 'success');
        }
      } catch (err) {
        AppAlerts.error('Upload Failed', err.message);
      } finally {
        uploadingImage.value = false;
        e.target.value = '';
      }
    };

    const removeImage = () => {
      profile.profile_image = '';
    };

    const saveChanges = async () => {
      if (!profile.name.trim()) {
        AppAlerts.toast('Full Name is required', 'error');
        return;
      }

      saving.value = true;
      try {
        const res = await AppModel.Profile.update({ ...profile });
        if (res.success) {
          AppAlerts.toast('Profile changes saved successfully.', 'success');
        }
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        saving.value = false;
      }
    };

    Vue.onMounted(loadProfile);

    return {
      isSidebarOpen,
      loading,
      saving,
      uploadingImage,
      profile,
      handleImageUpload,
      removeImage,
      saveChanges
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Profile & Bio Management" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          
          <div v-if="loading" class="py-20 text-center">
            <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p class="text-xs font-mono text-zinc-500">Loading profile data...</p>
          </div>

          <form v-else @submit.prevent="saveChanges" class="space-y-8 animate-fade-in">
            
            <!-- Avatar & Image Upload Card -->
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono mb-4">Profile Avatar</h3>
              
              <div class="flex flex-col sm:flex-row items-center gap-6">
                <div class="w-28 h-28 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <img v-if="profile.profile_image" :src="profile.profile_image" alt="Profile" class="w-full h-full object-cover" />
                  <app-icon v-else name="user" :size="36" class-name="text-zinc-400"></app-icon>
                </div>

                <div class="space-y-3 text-center sm:text-left">
                  <p class="text-xs text-zinc-500">JPG, PNG, WEBP up to 8MB. Displayed in Hero and About sections.</p>
                  <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <label class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-2">
                      <span v-if="uploadingImage" class="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                      <app-icon v-else name="upload" :size="14"></app-icon>
                      <span>{{ uploadingImage ? 'Uploading...' : 'Upload New Photo' }}</span>
                      <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" :disabled="uploadingImage" />
                    </label>

                    <button
                      v-if="profile.profile_image"
                      type="button"
                      @click="removeImage"
                      class="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Basic Identification Card -->
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono mb-2">Core Identity</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form-field label="Full Name" v-model="profile.name" placeholder="Alex Morgan" required></form-field>
                <form-field label="Professional Title" v-model="profile.title" placeholder="Full-Stack Software Engineer" required></form-field>
              </div>

              <form-field
                label="Short Introduction (Hero Tagline)"
                type="textarea"
                :rows="2"
                v-model="profile.short_bio"
                placeholder="I craft minimalist, high-performance web applications..."
              ></form-field>

              <form-field
                label="Full Biography (About Section)"
                type="textarea"
                :rows="5"
                v-model="profile.biography"
                placeholder="Write your comprehensive background, philosophy, and approach..."
              ></form-field>

              <form-field
                label="Career Goals & Vision"
                type="textarea"
                :rows="3"
                v-model="profile.career_goals"
                placeholder="Your aspirations, tech stacks you are exploring..."
              ></form-field>
            </div>

            <!-- Contact & Availability Card -->
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono mb-2">Contact & Availability</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form-field label="Public Email" type="email" v-model="profile.email" placeholder="alex@example.com"></form-field>
                <form-field label="Phone Number" v-model="profile.phone" placeholder="+1 (555) 019-2834"></form-field>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form-field label="Location" v-model="profile.location" placeholder="San Francisco, CA"></form-field>
                <form-field label="Availability Status" v-model="profile.availability" placeholder="Available for select projects"></form-field>
              </div>
            </div>

            <!-- SEO & Meta Card -->
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-zinc-500 font-mono mb-2">Meta & SEO Info</h3>

              <form-field label="Website Title (Browser Tab)" v-model="profile.website_title" placeholder="Alex Morgan | Software Engineer"></form-field>
              <form-field label="Meta Description" type="textarea" :rows="2" v-model="profile.website_description" placeholder="Minimalist developer portfolio..."></form-field>
            </div>

            <!-- Floating / Bottom Save Bar -->
            <div class="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="submit"
                :disabled="saving"
                class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span v-if="saving" class="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                <app-icon v-else name="save" :size="16"></app-icon>
                <span>{{ saving ? 'Saving Changes...' : 'Save Changes' }}</span>
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  `
};
