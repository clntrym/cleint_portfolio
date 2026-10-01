// View: ProjectDetailPage (/projects/:slug)
window.ProjectDetailPage = {
  name: 'ProjectDetailPage',
  components: {
    AppNavbar: window.AppNavbar,
    AppFooter: window.AppFooter,
    AppIcon: window.AppIcon
  },
  setup() {
    const route = VueRouter.useRoute();
    const router = VueRouter.useRouter();
    const slug = route.params.slug;

    const loading = Vue.ref(true);
    const error = Vue.ref('');
    const project = Vue.ref(null);
    const profile = Vue.ref({});
    const socialLinks = Vue.ref([]);

    const fetchProject = async () => {
      loading.value = true;
      error.value = '';
      try {
        const [projRes, profRes, socRes] = await Promise.all([
          AppModel.Projects.getBySlug(slug),
          AppModel.Profile.get(),
          AppModel.SocialLinks.getAll()
        ]);

        if (projRes && projRes.success && projRes.data) {
          project.value = projRes.data;
        } else {
          error.value = 'Project not found';
        }

        if (profRes && profRes.data) profile.value = profRes.data;
        if (socRes && socRes.data) socialLinks.value = socRes.data;
      } catch (err) {
        error.value = err.message || 'Failed to load project details';
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const parseTech = (techString) => {
      if (!techString) return [];
      return techString.split(',').map(t => t.trim()).filter(Boolean);
    };

    Vue.onMounted(() => {
      window.scrollTo({ top: 0 });
      fetchProject();
    });

    return {
      slug,
      loading,
      error,
      project,
      profile,
      socialLinks,
      parseTech,
      router
    };
  },
  template: `
    <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-navbar :site-title="profile.name"></app-navbar>

      <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full">
        
        <!-- Back Navigation -->
        <div class="mb-8">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            <app-icon name="arrow-left" :size="14"></app-icon>
            <span>Back to All Projects</span>
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-24 text-center">
          <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-xs font-mono text-zinc-500">Loading project specification...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-20 text-center bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <app-icon name="alert-circle" :size="36" class-name="text-zinc-400 mx-auto mb-3"></app-icon>
          <h2 class="text-xl font-bold mb-2">Project Not Found</h2>
          <p class="text-sm text-zinc-500 mb-6">{{ error }}</p>
          <router-link to="/" class="btn bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-xl text-xs font-semibold">
            Return to Homepage
          </router-link>
        </div>

        <!-- Project Detail Content -->
        <article v-else-if="project" class="space-y-10 animate-fade-in">
          
          <!-- Header Meta -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 rounded-md text-xs font-mono font-bold bg-black text-white dark:bg-white dark:text-black">
                {{ project.category }}
              </span>
              <span v-if="project.featured" class="px-2 py-0.5 rounded text-xs font-mono border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                Featured Work
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-4">
              {{ project.title }}
            </h1>

            <p class="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
              {{ project.description }}
            </p>
          </div>

          <!-- Featured Image -->
          <div v-if="project.image" class="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-900">
            <img :src="project.image" :alt="project.title" class="w-full max-h-[500px] object-cover" />
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800">
            <a
              v-if="project.live_url"
              :href="project.live_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <app-icon name="external-link" :size="16"></app-icon>
              <span>Visit Live Website</span>
            </a>

            <a
              v-if="project.github_url"
              :href="project.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-transparent text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            >
              <app-icon name="github" :size="16"></app-icon>
              <span>Source Code</span>
            </a>
          </div>

          <!-- Technologies Grid -->
          <div>
            <h3 class="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Technologies & Frameworks
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="t in parseTech(project.technologies)"
                :key="t"
                class="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <!-- Deep-dive Description -->
          <div v-if="project.long_description" class="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 class="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Project Architecture & Features
            </h3>
            <div class="text-base text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed space-y-4">
              {{ project.long_description }}
            </div>
          </div>

          <!-- Additional Images Gallery -->
          <div v-if="project.additional_images && project.additional_images.length" class="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 class="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Interface Screenshots
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="(img, idx) in project.additional_images"
                :key="idx"
                class="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-900"
              >
                <img :src="img" :alt="'Screenshot ' + (idx + 1)" class="w-full h-auto object-cover" />
              </div>
            </div>
          </div>

        </article>
      </main>

      <app-footer :profile="profile" :social-links="socialLinks"></app-footer>
    </div>
  `
};
