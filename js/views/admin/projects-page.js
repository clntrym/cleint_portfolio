// View: Admin ProjectsPage (/admin/projects)
window.AdminProjectsPage = {
  name: 'AdminProjectsPage',
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
    const projects = Vue.ref([]);
    const categories = Vue.ref([]);

    // Filters
    const searchQuery = Vue.ref('');
    const selectedCategory = Vue.ref('');
    const selectedStatus = Vue.ref('');
    const selectedFeatured = Vue.ref('');

    // Modal state for Add / Edit
    const isEditModalOpen = Vue.ref(false);
    const isEditing = Vue.ref(false);
    const savingProject = Vue.ref(false);
    const uploadingImage = Vue.ref(false);

    const projectForm = Vue.reactive({
      id: null,
      title: '',
      slug: '',
      category: 'Web App',
      description: '',
      long_description: '',
      image: '',
      additional_images: [],
      technologies: '',
      github_url: '',
      live_url: '',
      featured: false,
      published: true,
      sort_order: 0
    });

    // Delete modal
    const isDeleteModalOpen = Vue.ref(false);
    const deletingProject = Vue.ref(false);
    const projectToDelete = Vue.ref(null);

    const loadProjects = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Projects.getAll({ admin_view: 1 });
        if (res && res.success) {
          projects.value = res.data || [];
          categories.value = res.categories || [];
        }
      } catch (err) {
        AppAlerts.error('Failed to load projects', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const filteredProjects = Vue.computed(() => {
      return projects.value.filter(p => {
        const matchesSearch = !searchQuery.value.trim() || 
          p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          p.technologies.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesCat = !selectedCategory.value || p.category === selectedCategory.value;
        const matchesPub = selectedStatus.value === '' || Number(p.published) === Number(selectedStatus.value);
        const matchesFeat = selectedFeatured.value === '' || Number(p.featured) === Number(selectedFeatured.value);

        return matchesSearch && matchesCat && matchesPub && matchesFeat;
      });
    });

    const openCreateModal = () => {
      isEditing.value = false;
      Object.assign(projectForm, {
        id: null,
        title: '',
        slug: '',
        category: 'Web App',
        description: '',
        long_description: '',
        image: '',
        additional_images: [],
        technologies: '',
        github_url: '',
        live_url: '',
        featured: false,
        published: true,
        sort_order: projects.value.length + 1
      });
      isEditModalOpen.value = true;
    };

    const openEditModal = (proj) => {
      isEditing.value = true;
      Object.assign(projectForm, {
        id: proj.id,
        title: proj.title,
        slug: proj.slug,
        category: proj.category || 'Web App',
        description: proj.description,
        long_description: proj.long_description || '',
        image: proj.image || '',
        additional_images: proj.additional_images || [],
        technologies: proj.technologies,
        github_url: proj.github_url || '',
        live_url: proj.live_url || '',
        featured: Boolean(Number(proj.featured)),
        published: Boolean(Number(proj.published)),
        sort_order: proj.sort_order || 0
      });
      isEditModalOpen.value = true;
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadingImage.value = true;
      try {
        const res = await AppApi.upload(file, 'projects');
        if (res.success && res.url) {
          projectForm.image = res.url;
          AppAlerts.toast('Featured image uploaded.', 'success');
        }
      } catch (err) {
        AppAlerts.error('Upload Failed', err.message);
      } finally {
        uploadingImage.value = false;
        e.target.value = '';
      }
    };

    const saveProject = async () => {
      if (!projectForm.title.trim()) {
        AppAlerts.toast('Project Title is required.', 'error');
        return;
      }
      if (!projectForm.description.trim()) {
        AppAlerts.toast('Short Description is required.', 'error');
        return;
      }

      savingProject.value = true;
      try {
        if (isEditing.value && projectForm.id) {
          await AppModel.Projects.update(projectForm.id, { ...projectForm });
          AppAlerts.toast('Project updated successfully.');
        } else {
          await AppModel.Projects.create({ ...projectForm });
          AppAlerts.toast('Project created successfully.');
        }
        isEditModalOpen.value = false;
        await loadProjects();
      } catch (err) {
        AppAlerts.error('Save Failed', err.message);
      } finally {
        savingProject.value = false;
      }
    };

    const toggleStatus = async (proj) => {
      try {
        await AppModel.Projects.toggleStatus(proj.id);
        proj.published = 1 - proj.published;
        AppAlerts.toast(`Project ${proj.published ? 'published' : 'moved to draft'}.`);
      } catch (err) {
        AppAlerts.error('Failed to update status', err.message);
      }
    };

    const toggleFeatured = async (proj) => {
      try {
        await AppModel.Projects.toggleFeatured(proj.id);
        proj.featured = 1 - proj.featured;
        AppAlerts.toast(`Featured status updated.`);
      } catch (err) {
        AppAlerts.error('Failed to update featured', err.message);
      }
    };

    const confirmDelete = (proj) => {
      projectToDelete.value = proj;
      isDeleteModalOpen.value = true;
    };

    const deleteProject = async () => {
      if (!projectToDelete.value) return;
      deletingProject.value = true;
      try {
        await AppModel.Projects.delete(projectToDelete.value.id);
        AppAlerts.toast('Project deleted.');
        isDeleteModalOpen.value = false;
        await loadProjects();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deletingProject.value = false;
      }
    };

    Vue.onMounted(loadProjects);

    return {
      isSidebarOpen,
      loading,
      projects,
      categories,
      searchQuery,
      selectedCategory,
      selectedStatus,
      selectedFeatured,
      filteredProjects,
      isEditModalOpen,
      isEditing,
      savingProject,
      uploadingImage,
      projectForm,
      isDeleteModalOpen,
      deletingProject,
      projectToDelete,
      openCreateModal,
      openEditModal,
      handleImageUpload,
      saveProject,
      toggleStatus,
      toggleFeatured,
      confirmDelete,
      deleteProject,
      categoryOptions: AppLabels.projectCategories
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Project Management" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <!-- Actions & Search Toolbar -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3 flex-1">
              <!-- Search Box -->
              <div class="relative w-full sm:w-64">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search by title, tech..."
                  class="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
                <span class="absolute left-3 top-2.5 text-zinc-400">
                  <app-icon name="search" :size="14"></app-icon>
                </span>
              </div>

              <!-- Category Filter -->
              <select
                v-model="selectedCategory"
                class="px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              >
                <option value="">All Categories</option>
                <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
              </select>

              <!-- Published Filter -->
              <select
                v-model="selectedStatus"
                class="px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              >
                <option value="">All Statuses</option>
                <option value="1">Published</option>
                <option value="0">Draft</option>
              </select>

              <!-- Featured Filter -->
              <select
                v-model="selectedFeatured"
                class="px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              >
                <option value="">All Items</option>
                <option value="1">Featured Only</option>
                <option value="0">Standard</option>
              </select>
            </div>

            <!-- New Project Button -->
            <button
              type="button"
              @click="openCreateModal"
              class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <app-icon name="plus" :size="15"></app-icon>
              <span>+ Add Project</span>
            </button>
          </div>

          <!-- Projects Table Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="py-20 text-center">
              <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-xs font-mono text-zinc-500">Loading projects catalog...</p>
            </div>

            <div v-else-if="filteredProjects.length === 0" class="py-16 text-center">
              <app-icon name="folder-git-2" :size="36" class-name="text-zinc-300 dark:text-zinc-700 mx-auto mb-3"></app-icon>
              <p class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No projects match the filters.</p>
              <p class="text-xs text-zinc-400 mt-1">Try resetting the search terms or create a new project.</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Created</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="proj in filteredProjects" :key="proj.id">
                    
                    <!-- Title & Image -->
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                          <img v-if="proj.image" :src="proj.image" :alt="proj.title" class="w-full h-full object-cover" />
                          <app-icon v-else name="image" :size="18" class-name="text-zinc-400"></app-icon>
                        </div>
                        <div>
                          <div class="font-bold text-zinc-900 dark:text-zinc-100">{{ proj.title }}</div>
                          <div class="text-xs text-zinc-400 font-mono">/projects/{{ proj.slug }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Category -->
                    <td>
                      <span class="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {{ proj.category }}
                      </span>
                    </td>

                    <!-- Status Toggle -->
                    <td>
                      <button
                        type="button"
                        @click="toggleStatus(proj)"
                        class="hover:opacity-80 transition-opacity"
                        title="Click to toggle status"
                      >
                        <status-badge :status="proj.published" variant="published"></status-badge>
                      </button>
                    </td>

                    <!-- Featured Toggle -->
                    <td>
                      <button
                        type="button"
                        @click="toggleFeatured(proj)"
                        class="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        :title="proj.featured ? 'Featured on home' : 'Click to feature'"
                      >
                        <app-icon
                          :name="proj.featured ? 'star' : 'star-off'"
                          :size="16"
                          :class-name="proj.featured ? 'text-black dark:text-white fill-current' : 'text-zinc-400'"
                        ></app-icon>
                      </button>
                    </td>

                    <!-- Date -->
                    <td class="text-xs text-zinc-500 font-mono">
                      {{ new Date(proj.created_at).toLocaleDateString() }}
                    </td>

                    <!-- Actions -->
                    <td class="text-right">
                      <div class="inline-flex items-center gap-1">
                        <router-link
                          :to="'/projects/' + proj.slug"
                          target="_blank"
                          class="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="View Live"
                        >
                          <app-icon name="external-link" :size="15"></app-icon>
                        </router-link>

                        <button
                          type="button"
                          @click="openEditModal(proj)"
                          class="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Edit Project"
                        >
                          <app-icon name="pencil" :size="15"></app-icon>
                        </button>

                        <button
                          type="button"
                          @click="confirmDelete(proj)"
                          class="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Delete Project"
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

      <!-- Add / Edit Project Modal -->
      <app-modal
        :is-open="isEditModalOpen"
        :title="isEditing ? 'Edit Project' : 'Create New Project'"
        subtitle="Configure project meta, images, technologies and links"
        max-width="max-w-3xl"
        @close="isEditModalOpen = false"
      >
        <form @submit.prevent="saveProject" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form-field label="Project Title" v-model="projectForm.title" placeholder="Aura CMS" required></form-field>
            <form-field label="Custom Slug (optional)" v-model="projectForm.slug" placeholder="aura-cms" help-text="Auto-generated if left blank"></form-field>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form-field
              label="Category"
              type="select"
              v-model="projectForm.category"
              :options="categoryOptions"
            ></form-field>

            <form-field
              label="Sort Order"
              type="number"
              v-model="projectForm.sort_order"
              placeholder="0"
            ></form-field>
          </div>

          <!-- Featured Image Section -->
          <div class="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950 space-y-3">
            <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
              Featured Image
            </label>
            
            <div class="flex items-center gap-4">
              <div class="w-20 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                <img v-if="projectForm.image" :src="projectForm.image" alt="Preview" class="w-full h-full object-cover" />
                <app-icon v-else name="image" :size="20" class-name="text-zinc-400"></app-icon>
              </div>

              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-3">
                  <label class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                    <span v-if="uploadingImage" class="w-3 h-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>Upload Image</span>
                    <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" :disabled="uploadingImage" />
                  </label>
                  <button
                    v-if="projectForm.image"
                    type="button"
                    @click="projectForm.image = ''"
                    class="text-xs text-red-500 hover:underline"
                  >
                    Clear Image
                  </button>
                </div>
                <input
                  type="text"
                  v-model="projectForm.image"
                  placeholder="Or paste external image URL"
                  class="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg"
                />
              </div>
            </div>
          </div>

          <form-field
            label="Short Summary"
            type="textarea"
            :rows="2"
            v-model="projectForm.description"
            placeholder="Brief overview displayed on card..."
            required
          ></form-field>

          <form-field
            label="Detailed Architecture & Description (Markdown supported)"
            type="textarea"
            :rows="5"
            v-model="projectForm.long_description"
            placeholder="Detailed write-up shown on dedicated /projects/:slug page..."
          ></form-field>

          <form-field
            label="Technologies (Comma separated)"
            v-model="projectForm.technologies"
            placeholder="Vue.js, PHP, MySQL, Tailwind CSS"
            required
          ></form-field>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form-field label="GitHub Repository URL" v-model="projectForm.github_url" placeholder="https://github.com/..."></form-field>
            <form-field label="Live Demo URL" v-model="projectForm.live_url" placeholder="https://demo.example.com"></form-field>
          </div>

          <div class="flex items-center gap-6 pt-2">
            <form-field label="Publish on portfolio" type="checkbox" v-model="projectForm.published"></form-field>
            <form-field label="Mark as Featured" type="checkbox" v-model="projectForm.featured"></form-field>
          </div>
        </form>

        <template v-slot:footer>
          <button
            type="button"
            @click="isEditModalOpen = false"
            class="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveProject"
            :disabled="savingProject"
            class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <span v-if="savingProject" class="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
            <span>{{ savingProject ? 'Saving...' : 'Save Project' }}</span>
          </button>
        </template>
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Project"
        :message="'Are you sure you want to permanently delete ' + (projectToDelete?.title || 'this project') + ' from the database?'"
        confirm-text="Delete Permanently"
        :loading="deletingProject"
        @confirm="deleteProject"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};

