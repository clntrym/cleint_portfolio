// View: Admin EducationPage (/admin/education)
window.AdminEducationPage = {
  name: 'AdminEducationPage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    AppModal: window.AppModal,
    ConfirmModal: window.ConfirmModal,
    FormField: window.FormField
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const educations = Vue.ref([]);

    const isModalOpen = Vue.ref(false);
    const isEditing = Vue.ref(false);
    const saving = Vue.ref(false);

    const form = Vue.reactive({
      id: null,
      school: '',
      degree: '',
      field: '',
      start_year: '',
      end_year: '',
      description: '',
      certificate_url: '',
      logo: '',
      sort_order: 0
    });

    const isDeleteModalOpen = Vue.ref(false);
    const deleting = Vue.ref(false);
    const itemToDelete = Vue.ref(null);

    const loadEducation = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Education.getAll();
        if (res && res.success) {
          educations.value = res.data || [];
        }
      } catch (err) {
        AppAlerts.error('Failed to load education', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const openCreateModal = () => {
      isEditing.value = false;
      Object.assign(form, {
        id: null,
        school: '',
        degree: '',
        field: '',
        start_year: '2018',
        end_year: '2022',
        description: '',
        certificate_url: '',
        logo: '',
        sort_order: educations.value.length + 1
      });
      isModalOpen.value = true;
    };

    const openEditModal = (item) => {
      isEditing.value = true;
      Object.assign(form, {
        id: item.id,
        school: item.school,
        degree: item.degree,
        field: item.field,
        start_year: item.start_year,
        end_year: item.end_year,
        description: item.description || '',
        certificate_url: item.certificate_url || '',
        logo: item.logo || '',
        sort_order: item.sort_order || 0
      });
      isModalOpen.value = true;
    };

    const saveEducation = async () => {
      if (!form.school.trim() || !form.degree.trim()) {
        AppAlerts.toast('School and Degree are required.', 'error');
        return;
      }

      saving.value = true;
      try {
        if (isEditing.value && form.id) {
          await AppModel.Education.update(form.id, { ...form });
          AppAlerts.toast('Education record updated.');
        } else {
          await AppModel.Education.create({ ...form });
          AppAlerts.toast('Education record added.');
        }
        isModalOpen.value = false;
        await loadEducation();
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        saving.value = false;
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
        await AppModel.Education.delete(itemToDelete.value.id);
        AppAlerts.toast('Education record deleted.');
        isDeleteModalOpen.value = false;
        await loadEducation();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deleting.value = false;
      }
    };

    Vue.onMounted(loadEducation);

    return {
      isSidebarOpen,
      loading,
      educations,
      isModalOpen,
      isEditing,
      saving,
      form,
      isDeleteModalOpen,
      deleting,
      itemToDelete,
      openCreateModal,
      openEditModal,
      saveEducation,
      confirmDelete,
      deleteItem
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Education & Credentials" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <div class="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm">
            <div>
              <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Degrees & Certifications</h2>
              <p class="text-xs text-zinc-500">Manage academic credentials and verified professional licenses.</p>
            </div>

            <button
              type="button"
              @click="openCreateModal"
              class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <app-icon name="plus" :size="15"></app-icon>
              <span>+ Add Education</span>
            </button>
          </div>

          <!-- Table -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="py-20 text-center">
              <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-xs font-mono text-zinc-500">Loading education records...</p>
            </div>

            <div v-else-if="educations.length === 0" class="py-16 text-center text-zinc-400 text-xs">
              No education records listed.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Degree / Program</th>
                    <th>Institution</th>
                    <th>Field</th>
                    <th>Years</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in educations" :key="item.id">
                    <td>
                      <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ item.degree }}</div>
                      <div v-if="item.certificate_url" class="text-xs font-mono text-zinc-400 mt-0.5">Verified URL</div>
                    </td>
                    <td class="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
                      {{ item.school }}
                    </td>
                    <td class="text-xs text-zinc-500">
                      {{ item.field }}
                    </td>
                    <td class="font-mono text-xs text-zinc-500">
                      {{ item.start_year }} &mdash; {{ item.end_year }}
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
        :title="isEditing ? 'Edit Education Record' : 'Add Education Record'"
        subtitle="Institution, degree, field of study, and certificate validation URL"
        max-width="max-w-xl"
        @close="isModalOpen = false"
      >
        <form @submit.prevent="saveEducation" class="space-y-4">
          <form-field label="Institution / University" v-model="form.school" placeholder="MIT, Stanford University..." required></form-field>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form-field label="Degree / Program" v-model="form.degree" placeholder="B.S., M.S., Professional Cert..." required></form-field>
            <form-field label="Field of Study" v-model="form.field" placeholder="Computer Science, Software Eng..." required></form-field>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <form-field label="Start Year" v-model="form.start_year" placeholder="2018" required></form-field>
            <form-field label="End Year" v-model="form.end_year" placeholder="2022" required></form-field>
          </div>

          <form-field
            label="Program Description & Highlights"
            type="textarea"
            :rows="3"
            v-model="form.description"
            placeholder="Focus areas, honors, thesis..."
          ></form-field>

          <form-field label="Online Certificate Verification URL" v-model="form.certificate_url" placeholder="https://coursera.org/verify/..."></form-field>
          <form-field label="Sort Order" type="number" v-model="form.sort_order" placeholder="0"></form-field>
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
            @click="saveEducation"
            :disabled="saving"
            class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <span v-if="saving" class="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
            <span>{{ saving ? 'Saving...' : 'Save Education' }}</span>
          </button>
        </template>
      </app-modal>

      <!-- Delete Modal -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Education Record"
        :message="'Are you sure you want to remove ' + (itemToDelete?.degree || 'this record') + '?'"
        confirm-text="Delete"
        :loading="deleting"
        @confirm="deleteItem"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};

