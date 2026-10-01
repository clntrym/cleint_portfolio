// View: Admin SkillsPage (/admin/skills)
window.AdminSkillsPage = {
  name: 'AdminSkillsPage',
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
    const skills = Vue.ref([]);
    const categoryFilter = Vue.ref('');

    // Modal state
    const isModalOpen = Vue.ref(false);
    const isEditing = Vue.ref(false);
    const savingSkill = Vue.ref(false);

    const skillForm = Vue.reactive({
      id: null,
      name: '',
      category: 'Frontend',
      proficiency: 85,
      icon: 'code',
      sort_order: 0,
      enabled: true
    });

    // Delete modal
    const isDeleteModalOpen = Vue.ref(false);
    const deletingSkill = Vue.ref(false);
    const skillToDelete = Vue.ref(null);

    const loadSkills = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Skills.getAll(true);
        if (res && res.success) {
          skills.value = res.data || [];
        }
      } catch (err) {
        AppAlerts.error('Failed to load skills', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const filteredSkills = Vue.computed(() => {
      if (!categoryFilter.value) return skills.value;
      return skills.value.filter(s => s.category === categoryFilter.value);
    });

    const openCreateModal = () => {
      isEditing.value = false;
      Object.assign(skillForm, {
        id: null,
        name: '',
        category: categoryFilter.value || 'Frontend',
        proficiency: 85,
        icon: 'code',
        sort_order: skills.value.length + 1,
        enabled: true
      });
      isModalOpen.value = true;
    };

    const openEditModal = (s) => {
      isEditing.value = true;
      Object.assign(skillForm, {
        id: s.id,
        name: s.name,
        category: s.category || 'Frontend',
        proficiency: Number(s.proficiency) || 80,
        icon: s.icon || 'code',
        sort_order: s.sort_order || 0,
        enabled: Boolean(Number(s.enabled))
      });
      isModalOpen.value = true;
    };

    const saveSkill = async () => {
      if (!skillForm.name.trim()) {
        AppAlerts.toast('Skill name is required.', 'error');
        return;
      }

      savingSkill.value = true;
      try {
        if (isEditing.value && skillForm.id) {
          await AppModel.Skills.update(skillForm.id, { ...skillForm });
          AppAlerts.toast('Skill updated successfully.');
        } else {
          await AppModel.Skills.create({ ...skillForm });
          AppAlerts.toast('Skill added successfully.');
        }
        isModalOpen.value = false;
        await loadSkills();
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        savingSkill.value = false;
      }
    };

    const toggleStatus = async (s) => {
      try {
        await AppModel.Skills.toggleStatus(s.id);
        s.enabled = 1 - s.enabled;
        AppAlerts.toast(`Skill ${s.enabled ? 'activated' : 'disabled'}.`);
      } catch (err) {
        AppAlerts.error('Toggle Failed', err.message);
      }
    };

    const confirmDelete = (s) => {
      skillToDelete.value = s;
      isDeleteModalOpen.value = true;
    };

    const deleteSkill = async () => {
      if (!skillToDelete.value) return;
      deletingSkill.value = true;
      try {
        await AppModel.Skills.delete(skillToDelete.value.id);
        AppAlerts.toast('Skill removed.');
        isDeleteModalOpen.value = false;
        await loadSkills();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deletingSkill.value = false;
      }
    };

    Vue.onMounted(loadSkills);

    return {
      isSidebarOpen,
      loading,
      skills,
      categoryFilter,
      filteredSkills,
      isModalOpen,
      isEditing,
      savingSkill,
      skillForm,
      isDeleteModalOpen,
      deletingSkill,
      skillToDelete,
      openCreateModal,
      openEditModal,
      saveSkill,
      toggleStatus,
      confirmDelete,
      deleteSkill,
      categoryOptions: AppLabels.skillCategories
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Skills & Proficiencies" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <!-- Actions & Category Toolbar -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <label class="text-xs font-mono uppercase text-zinc-500">Filter Category:</label>
              <select
                v-model="categoryFilter"
                class="px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none"
              >
                <option value="">All Categories ({{ skills.length }})</option>
                <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <button
              type="button"
              @click="openCreateModal"
              class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
            >
              <app-icon name="plus" :size="15"></app-icon>
              <span>+ Add Skill</span>
            </button>
          </div>

          <!-- Skills Table -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="py-20 text-center">
              <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-xs font-mono text-zinc-500">Loading skill inventory...</p>
            </div>

            <div v-else-if="filteredSkills.length === 0" class="py-16 text-center text-zinc-400 text-xs">
              No skills found for this filter.
            </div>

            <div v-else class="overflow-x-auto">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Category</th>
                    <th>Proficiency</th>
                    <th>Status</th>
                    <th>Sort Order</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in filteredSkills" :key="s.id">
                    
                    <td>
                      <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                          <app-icon :name="s.icon || 'code'" :size="16"></app-icon>
                        </span>
                        <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ s.name }}</span>
                      </div>
                    </td>

                    <td>
                      <span class="text-xs font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {{ s.category }}
                      </span>
                    </td>

                    <td>
                      <div class="flex items-center gap-3 max-w-[180px]">
                        <div class="w-24 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div class="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" :style="{ width: s.proficiency + '%' }"></div>
                        </div>
                        <span class="text-xs font-mono text-zinc-500">{{ s.proficiency }}%</span>
                      </div>
                    </td>

                    <td>
                      <button type="button" @click="toggleStatus(s)">
                        <status-badge :status="s.enabled" variant="enabled"></status-badge>
                      </button>
                    </td>

                    <td class="font-mono text-xs text-zinc-500">
                      {{ s.sort_order }}
                    </td>

                    <td class="text-right">
                      <div class="inline-flex items-center gap-1">
                        <button
                          type="button"
                          @click="openEditModal(s)"
                          class="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <app-icon name="pencil" :size="15"></app-icon>
                        </button>
                        <button
                          type="button"
                          @click="confirmDelete(s)"
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

      <!-- Add / Edit Modal -->
      <app-modal
        :is-open="isModalOpen"
        :title="isEditing ? 'Edit Skill' : 'Add New Skill'"
        subtitle="Specify technology name, proficiency bar percentage and category"
        max-width="max-w-md"
        @close="isModalOpen = false"
      >
        <form @submit.prevent="saveSkill" class="space-y-4">
          <form-field label="Skill Name" v-model="skillForm.name" placeholder="TypeScript, Docker..." required></form-field>
          
          <form-field
            label="Category"
            type="select"
            v-model="skillForm.category"
            :options="categoryOptions"
          ></form-field>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
                Proficiency Level ({{ skillForm.proficiency }}%)
              </label>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              v-model.number="skillForm.proficiency"
              class="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer accent-black dark:accent-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <form-field label="Lucide Icon" v-model="skillForm.icon" placeholder="code, layout, cpu..."></form-field>
            <form-field label="Sort Order" type="number" v-model="skillForm.sort_order" placeholder="0"></form-field>
          </div>

          <form-field label="Enable on public portfolio" type="checkbox" v-model="skillForm.enabled"></form-field>
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
            @click="saveSkill"
            :disabled="savingSkill"
            class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <span v-if="savingSkill" class="w-3 h-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
            <span>{{ savingSkill ? 'Saving...' : 'Save Skill' }}</span>
          </button>
        </template>
      </app-modal>

      <!-- Delete Modal -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Skill"
        :message="'Are you sure you want to remove ' + (skillToDelete?.name || 'this skill') + ' from your profile?'"
        confirm-text="Remove Skill"
        :loading="deletingSkill"
        @confirm="deleteSkill"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};
