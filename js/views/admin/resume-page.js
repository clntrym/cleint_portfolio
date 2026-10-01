// View: Admin ResumePage (/admin/resume)
window.AdminResumePage = {
  name: 'AdminResumePage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    ConfirmModal: window.ConfirmModal
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const uploading = Vue.ref(false);
    const deleting = Vue.ref(false);
    const isDeleteModalOpen = Vue.ref(false);
    const resumeInfo = Vue.ref({ has_resume: false, resume_url: '' });

    const loadResume = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Resume.get();
        if (res) {
          resumeInfo.value = res;
        }
      } catch (err) {
        AppAlerts.error('Failed to load resume info', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        AppAlerts.toast('Only PDF files are allowed.', 'error');
        e.target.value = '';
        return;
      }

      uploading.value = true;
      try {
        const res = await AppModel.Resume.upload(file);
        if (res.success) {
          AppAlerts.toast('Resume uploaded successfully.');
          await loadResume();
        }
      } catch (err) {
        AppAlerts.error('Upload Failed', err.message);
      } finally {
        uploading.value = false;
        e.target.value = '';
      }
    };

    const deleteResume = async () => {
      deleting.value = true;
      try {
        await AppModel.Resume.delete();
        AppAlerts.toast('Resume deleted.');
        isDeleteModalOpen.value = false;
        await loadResume();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deleting.value = false;
      }
    };

    Vue.onMounted(loadResume);

    return {
      isSidebarOpen,
      loading,
      uploading,
      deleting,
      isDeleteModalOpen,
      resumeInfo,
      handleFileUpload,
      deleteResume
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Resume Management" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div>
              <h2 class="text-xl font-bold text-zinc-950 dark:text-white">Curriculum Vitae (PDF)</h2>
              <p class="text-xs text-zinc-500 mt-1">Upload and manage the PDF resume linked across the public website.</p>
            </div>

            <!-- Status Card -->
            <div class="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                  <app-icon name="file-text" :size="28"></app-icon>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {{ resumeInfo.has_resume ? 'Active PDF Resume Available' : 'No Resume Uploaded' }}
                  </h3>
                  <p class="text-xs text-zinc-500 font-mono mt-0.5">
                    {{ resumeInfo.has_resume ? resumeInfo.resume_url : 'Visitors cannot download a resume until one is uploaded.' }}
                  </p>
                </div>
              </div>

              <!-- Action buttons -->
              <div v-if="resumeInfo.has_resume" class="flex items-center gap-3">
                <a
                  href="api/resume.php?action=download"
                  target="_blank"
                  class="btn border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <app-icon name="download" :size="14"></app-icon>
                  <span>Download / Preview</span>
                </a>

                <button
                  type="button"
                  @click="isDeleteModalOpen = true"
                  class="btn border border-zinc-200 dark:border-zinc-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 rounded-xl text-xs font-semibold"
                >
                  Delete
                </button>
              </div>

            </div>

            <!-- Upload Area -->
            <div class="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 sm:p-12 text-center hover:border-black dark:hover:border-white transition-colors">
              <app-icon name="upload-cloud" :size="40" class-name="text-zinc-400 mx-auto mb-4"></app-icon>
              
              <h4 class="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                {{ resumeInfo.has_resume ? 'Replace Current Resume' : 'Upload New Resume PDF' }}
              </h4>
              <p class="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                Only PDF files are permitted. Maximum upload file size is 10 megabytes.
              </p>

              <div>
                <label class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-6 py-3 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2 shadow-md">
                  <span v-if="uploading" class="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                  <span v-else>Select PDF Document</span>
                  <input type="file" accept="application/pdf,.pdf" @change="handleFileUpload" class="hidden" :disabled="uploading" />
                </label>
              </div>
            </div>

          </div>

        </main>
      </div>

      <!-- Delete Modal -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Resume"
        message="Are you sure you want to delete the current resume? Visitors will not be able to download it."
        confirm-text="Delete Resume"
        :loading="deleting"
        @confirm="deleteResume"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};
