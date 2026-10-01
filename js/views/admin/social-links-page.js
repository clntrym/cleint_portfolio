// View: Admin SocialLinksPage (/admin/social-links)
window.AdminSocialLinksPage = {
  name: 'AdminSocialLinksPage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    StatusBadge: window.StatusBadge,
    AppModal: window.AppModal,
    ConfirmModal: window.ConfirmModal,
    FormField: window.FormField
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const links = Vue.ref([]);

    const isModalOpen = Vue.ref(false);
    const isEditing = Vue.ref(false);
    const saving = Vue.ref(false);

    const form = Vue.reactive({
      id: null,
      platform: 'GitHub',
      url: '',
      icon: 'github',
      sort_order: 0,
      enabled: true
    });

    const isDeleteModalOpen = Vue.ref(false);
    const deleting = Vue.ref(false);
    const linkToDelete = Vue.ref(null);

    const loadLinks = async () => {
      loading.value = true;
      try {
        const res = await AppModel.SocialLinks.getAll(true);
        if (res && res.success) {
          links.value = res.data || [];
        }
      } catch (err) {
        AppAlerts.error('Failed to load social links', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const openCreateModal = () => {
      isEditing.value = false;
      Object.assign(form, {
        id: null,
        platform: 'GitHub',
        url: '',
        icon: 'github',
        sort_order: links.value.length + 1,
        enabled: true
      });
      isModalOpen.value = true;
    };

    const openEditModal = (item) => {
      isEditing.value = true;
      Object.assign(form, {
        id: item.id,
        platform: item.platform,
        url: item.url,
        icon: item.icon || 'globe',
        sort_order: item.sort_order || 0,
        enabled: Boolean(Number(item.enabled))
      });
      isModalOpen.value = true;
    };

    const saveLink = async () => {
      if (!form.platform.trim() || !form.url.trim()) {
        AppAlerts.toast('Platform and URL are required.', 'error');
        return;
      }

      saving.value = true;
      try {
        if (isEditing.value && form.id) {
          await AppModel.SocialLinks.update(form.id, { ...form });
          AppAlerts.toast('Social link updated.');
        } else {
          await AppModel.SocialLinks.create({ ...form });
          AppAlerts.toast('Social link created.');
        }
        isModalOpen.value = false;
        await loadLinks();
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        saving.value = false;
      }
    };

    const toggleStatus = async (item) => {
      try {
        await AppModel.SocialLinks.toggleStatus(item.id);
        item.enabled = 1 - item.enabled;
        AppAlerts.toast('Status updated.');
      } catch (err) {
        AppAlerts.error('Toggle Failed', err.message);
      }
    };

    const confirmDelete = (item) => {
      linkToDelete.value = item;
      isDeleteModalOpen.value = true;
    };

    const deleteLink = async () => {
      if (!linkToDelete.value) return;
      deleting.value = true;
      try {
        await AppModel.SocialLinks.delete(linkToDelete.value.id);
        AppAlerts.toast('Social link deleted.');
        isDeleteModalOpen.value = false;
        await loadLinks();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deleting.value = false;
      }
    };

    Vue.onMounted(loadLinks);

    return {
      isSidebarOpen,
      loading,
      links,
      isModalOpen,
      isEditing,
      saving,
      form,
      isDeleteModalOpen,
      deleting,
      linkToDelete,
      openCreateModal,
      openEditModal,
      saveLink,
      toggleStatus,
      confirmDelete,
      deleteLink,
      iconOptions: AppLabels.socialIcons
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Social & Online Profiles" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <div class="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm">
            <div>
              <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Social Accounts</h2>
              <p class="text-xs text-zinc-500">Links displayed on Hero and Footer of the public portfolio.</p>
            </div>

            <button
              type="button"
              @click="openCreateModal"
              class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <app-icon name="plus" :size="15"></app-icon>
              <span>+ Add Social Link</span>
            </button>
          </div>

          <!-- Table -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="py-20 text-center">
              <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-xs font-mono text-zinc-500">Loading social links...</p>
            </div>

            <div v-else-if="links.length === 0" class="py-16 text-center text-zinc-400 text-xs">
              No social links configured yet.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Destination URL</th>
                    <th>Status</th>
                    <th>Order</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in links" :key="item.id">
                    <td>
                      <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                          <app-icon :name="item.icon || 'globe'" :size="16"></app-icon>
                        </span>
                        <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ item.platform }}</span>
                      </div>
                    </td>

                    <td class="text-xs font-mono text-zinc-500 max-w-xs truncate">
                      <a :href="item.url" target="_blank" class="hover:underline">{{ item.url }}</a>
                    </td>

                    <td>
                      <button type="button" @click="toggleStatus(item)">
                        <status-badge :status="item.enabled" variant="enabled"></status-badge>
                      </button>
                    </td>

                    <td class="font-mono text-xs text-zinc-500">
                      {{ item.sort_order }}
                    </td>

                    <td class="text-right">
                      <div class="inline-flex items-center gap-1">
                        <button
                          type="button"
                          @click="openEditModal(item)"
                          class="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <app-icon name="pencil" :size="15"></app-icon>
                        </button>
                        <button
                          type="button"
                          @click="confirmDelete(item)"
                          class="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <app-icon name="trash-2" :size="15"></app-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      <!-- Add/Edit Modal -->
      <app-modal
        :is-open="isModalOpen"
        :title="isEditing ? 'Edit Social Link' : 'Add Social Link'"
        subtitle="Platform name, destination URL and Lucide icon"
        max-width="max-w-md"
        @close="isModalOpen = false"
      >
        <form @submit.prevent="saveLink" class="space-y-4">
          <form-field label="Platform Label" v-model="form.platform" placeholder="GitHub, LinkedIn, Discord..." required></form-field>
          <form-field label="Target URL" v-model="form.url" placeholder="https://github.com/username" required></form-field>

          <form-field
            label="Lucide Icon"
            type="select"
            v-model="form.icon"
            :options="iconOptions"
          ></form-field>

          <div class="grid grid-cols-2 gap-4">
            <form-field label="Sort Order" type="number" v-model="form.sort_order" placeholder="0"></form-field>
            <form-field label="Enable on website" type="checkbox" v-model="form.enabled"></form-field>
          </div>
        </form>

        <template v-slot:footer>
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveLink"
            :disabled="saving"
            class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <span v-if="saving" class="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
            <span>{{ saving ? 'Saving...' : 'Save Link' }}</span>
          </button>
        </template>
      </app-modal>

      <!-- Delete Modal -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Social Link"
        :message="'Are you sure you want to remove ' + (linkToDelete?.platform || 'this link') + '?'"
        confirm-text="Delete"
        :loading="deleting"
        @confirm="deleteLink"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};

