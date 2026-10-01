// View: Admin ExperiencePage (/admin/experience)
window.AdminExperiencePage = {
  name: 'AdminExperiencePage',
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
    const experiences = Vue.ref([]);

    const isModalOpen = Vue.ref(false);
    const isEditing = Vue.ref(false);
    const saving = Vue.ref(false);

    const form = Vue.reactive({
      id: null,
      job_title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: 'Present',
      currently_working: false,
      description: '',
      responsibilities: '',
      technologies: '',
      sort_order: 0,
      enabled: true
    });

    const isDeleteModalOpen = Vue.ref(false);
    const deleting = Vue.ref(false);
    const itemToDelete = Vue.ref(null);

    const loadExperience = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Experience.getAll(true);
        if (res && res.success) {
          experiences.value = res.data || [];
        }
      } catch (err) {
        AppAlerts.error('Failed to load experience', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const openCreateModal = () => {
      isEditing.value = false;
      Object.assign(form, {
        id: null,
        job_title: '',
        company: '',
        location: '',
        start_date: '2023',
        end_date: 'Present',
        currently_working: true,
        description: '',
        responsibilities: '',
        technologies: '',
        sort_order: experiences.value.length + 1,
        enabled: true
      });
      isModalOpen.value = true;
    };

    const openEditModal = (item) => {
      isEditing.value = true;
      Object.assign(form, {
        id: item.id,
        job_title: item.job_title,
        company: item.company,
        location: item.location || '',
        start_date: item.start_date,
        end_date: item.end_date || 'Present',
        currently_working: Boolean(Number(item.currently_working)),
        description: item.description || '',
        responsibilities: item.responsibilities || '',
        technologies: item.technologies || '',
        sort_order: item.sort_order || 0,
        enabled: Boolean(Number(item.enabled))
      });
      isModalOpen.value = true;
    };

    const saveExperience = async () => {
      if (!form.job_title.trim() || !form.company.trim()) {
        AppAlerts.toast('Job title and Company are required.', 'error');
        return;
      }

      saving.value = true;
      try {
        if (isEditing.value && form.id) {
          await AppModel.Experience.update(form.id, { ...form });
          AppAlerts.toast('Experience updated.');
        } else {
          await AppModel.Experience.create({ ...form });
          AppAlerts.toast('Experience record added.');
        }
        isModalOpen.value = false;
        await loadExperience();
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        saving.value = false;
      }
    };

    const toggleStatus = async (item) => {
      try {
        await AppModel.Experience.toggleStatus(item.id);
        item.enabled = 1 - item.enabled;
        AppAlerts.toast(`Status updated.`);
      } catch (err) {
        AppAlerts.error('Toggle Failed', err.message);
      }
    };

    const confirmDelete = (item) => {
      itemToDelete.value = item;
      isDeleteModalOpen.value = true;
    };

    const deleteItem = async () => {
      if (!itemToDelete.value) return;
      deleting.value = true;
      try {
        await AppModel.Experience.delete(itemToDelete.value.id);
        AppAlerts.toast('Experience deleted.');
        isDeleteModalOpen.value = false;
        await loadExperience();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deleting.value = false;
      }
    };

    Vue.onMounted(loadExperience);

    return {
      isSidebarOpen,
      loading,
      experiences,
      isModalOpen,
      isEditing,
      saving,
      form,
      isDeleteModalOpen,
      deleting,
      itemToDelete,
      openCreateModal,
      openEditModal,
      saveExperience,
      toggleStatus,
      confirmDelete,
      deleteItem
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Work Experience Timeline" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <div class="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm">
            <div>
              <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Employment History</h2>
              <p class="text-xs text-zinc-500">Add, edit, or reorganize timeline career milestones.</p>
            </div>

            <button
              type="button"
              @click="openCreateModal"
              class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <app-icon name="plus" :size="15"></app-icon>
              <span>+ Add Experience</span>
            </button>
          </div>

          <!-- Table -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="py-20 text-center">
              <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-xs font-mono text-zinc-500">Loading experience history...</p>
            </div>

            <div v-else-if="experiences.length === 0" class="py-16 text-center text-zinc-400 text-xs">
              No experience records found.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Role & Company</th>
                    <th>Period</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Order</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in experiences" :key="item.id">
                    <td>
                      <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ item.job_title }}</div>
                      <div class="text-xs text-zinc-500 font-mono">{{ item.company }}</div>
                    </td>
                    <td class="font-mono text-xs">
                      {{ item.start_date }} &mdash; {{ item.currently_working ? 'Present' : item.end_date }}
                    </td>
                    <td class="text-xs text-zinc-500">
                      {{ item.location || 'N/A' }}
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
        :title="isEditing ? 'Edit Experience' : 'Add Experience'"
        subtitle="Provide role title, organization, dates and accomplishments"
        max-width="max-w-2xl"
        @close="isModalOpen = false"
      >
        <form @submit.prevent="saveExperience" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form-field label="Job Title" v-model="form.job_title" placeholder="Senior Software Engineer" required></form-field>
            <form-field label="Company" v-model="form.company" placeholder="Acme Technologies" required></form-field>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form-field label="Location" v-model="form.location" placeholder="San Francisco / Remote"></form-field>
            <form-field label="Start Date/Year" v-model="form.start_date" placeholder="2022" required></form-field>
            <form-field
              label="End Date/Year"
              v-model="form.end_date"
              placeholder="Present"
              :disabled="form.currently_working"
            ></form-field>
          </div>

          <form-field label="I currently work in this role" type="checkbox" v-model="form.currently_working"></form-field>

          <form-field
            label="Short Overview"
            type="textarea"
            :rows="2"
            v-model="form.description"
            placeholder="High-level summary of your team and mandate..."
          ></form-field>

          <form-field
            label="Responsibilities & Achievements (Bullet points)"
            type="textarea"
            :rows="4"
            v-model="form.responsibilities"
            placeholder="• Architected backend microservices&#10;• Reduced latency by 35%..."
          ></form-field>

          <form-field
            label="Technologies Used (Comma separated)"
            v-model="form.technologies"
            placeholder="PHP, Vue.js, MySQL, Redis, AWS"
          ></form-field>

          <div class="grid grid-cols-2 gap-4">
            <form-field label="Sort Order" type="number" v-model="form.sort_order" placeholder="0"></form-field>
            <form-field label="Enable on public portfolio" type="checkbox" v-model="form.enabled"></form-field>
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
            @click="saveExperience"
            :disabled="saving"
            class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <span v-if="saving" class="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
            <span>{{ saving ? 'Saving...' : 'Save Record' }}</span>
          </button>
        </template>
      </app-modal>

      <!-- Delete Modal -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Experience Record"
        :message="'Are you sure you want to remove ' + (itemToDelete?.job_title || 'this entry') + '?'"
        confirm-text="Delete"
        :loading="deleting"
        @confirm="deleteItem"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};

