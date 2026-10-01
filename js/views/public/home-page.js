// View: HomePage (Public Portfolio)
window.HomePage = {
  name: 'HomePage',
  components: {
    AppNavbar: window.AppNavbar,
    AppFooter: window.AppFooter,
    AppIcon: window.AppIcon,
    StatusBadge: window.StatusBadge
  },
  setup() {
    const loading = Vue.ref(true);
    const profile = Vue.ref({});
    const projects = Vue.ref([]);
    const categories = Vue.ref([]);
    const activeCategory = Vue.ref('All');
    const skillsGrouped = Vue.ref({});
    const experiences = Vue.ref([]);
    const educations = Vue.ref([]);
    const socialLinks = Vue.ref([]);
    const resumeInfo = Vue.ref({});

    // Contact Form State
    const contactForm = Vue.reactive({
      name: '',
      email: '',
      subject: '',
      message: '',
      website_honeypot: ''
    });
    const contactLoading = Vue.ref(false);
    const contactErrors = Vue.reactive({});
    const contactSuccess = Vue.ref(false);

    const loadAllData = async () => {
      loading.value = true;
      try {
        const [profRes, projRes, skillRes, expRes, eduRes, socRes, resRes] = await Promise.all([
          AppModel.Profile.get(),
          AppModel.Projects.getAll(),
          AppModel.Skills.getAll(),
          AppModel.Experience.getAll(),
          AppModel.Education.getAll(),
          AppModel.SocialLinks.getAll(),
          AppModel.Resume.get()
        ]);

        if (profRes && profRes.data) profile.value = profRes.data;
        if (projRes && projRes.data) {
          projects.value = projRes.data;
          categories.value = projRes.categories || [];
        }
        if (skillRes && skillRes.grouped) skillsGrouped.value = skillRes.grouped;
        if (expRes && expRes.data) experiences.value = expRes.data;
        if (eduRes && eduRes.data) educations.value = eduRes.data;
        if (socRes && socRes.data) socialLinks.value = socRes.data;
        if (resRes) resumeInfo.value = resRes;
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const filteredProjects = Vue.computed(() => {
      if (activeCategory.value === 'All') return projects.value;
      return projects.value.filter(p => p.category === activeCategory.value);
    });

    const submitContact = async () => {
      // Validate
      contactErrors.name = !contactForm.name.trim() ? 'Name is required' : '';
      contactErrors.email = !contactForm.email.trim() || !contactForm.email.includes('@') ? 'Valid email is required' : '';
      contactErrors.subject = !contactForm.subject.trim() ? 'Subject is required' : '';
      contactErrors.message = contactForm.message.trim().length < 5 ? 'Message must be at least 5 characters' : '';

      if (contactErrors.name || contactErrors.email || contactErrors.subject || contactErrors.message) {
        return;
      }

      contactLoading.value = true;
      try {
        const res = await AppModel.Messages.submit({ ...contactForm });
        if (res.success) {
          contactSuccess.value = true;
          AppAlerts.toast('Your message has been sent successfully!', 'success');
          contactForm.name = '';
          contactForm.email = '';
          contactForm.subject = '';
          contactForm.message = '';
          setTimeout(() => { contactSuccess.value = false; }, 6000);
        }
      } catch (err) {
        AppAlerts.error('Message Failed', err.message || 'Could not send message.');
      } finally {
        contactLoading.value = false;
      }
    };

    const parseTech = (techString) => {
      if (!techString) return [];
      return techString.split(',').map(t => t.trim()).filter(Boolean);
    };

    Vue.onMounted(() => {
      loadAllData();
    });

    return {
      loading,
      profile,
      projects,
      categories,
      activeCategory,
      filteredProjects,
      skillsGrouped,
      experiences,
      educations,
      socialLinks,
      resumeInfo,
      contactForm,
      contactLoading,
      contactErrors,
      contactSuccess,
      submitContact,
      parseTech,
      scrollTo: AppNavigation.scrollTo
    };
  },
  template: `
    <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-navbar :site-title="profile.name"></app-navbar>

      <!-- Loading skeleton -->
      <div v-if="loading" class="flex-1 flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-mono tracking-widest uppercase text-zinc-500">Loading Portfolio...</p>
        </div>
      </div>

      <main v-else class="flex-1">
        
        <!-- 1. HERO SECTION -->
        <section id="hero" class="relative pt-20 pb-24 md:pt-32 md:pb-36 border-b border-zinc-200 dark:border-zinc-800">
          <div class="max-w-5xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12">
              
              <!-- Left Column: Copy & CTAs -->
              <div class="flex-1 text-center md:text-left">
                <!-- Availability & Location Tag -->
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-6">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{{ profile.availability || 'Available for opportunities' }}</span>
                  <span v-if="profile.location" class="text-zinc-400 dark:text-zinc-600">&bull;</span>
                  <span v-if="profile.location" class="text-zinc-500 dark:text-zinc-400">{{ profile.location }}</span>
                </div>

                <!-- Main Name & Title -->
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.1] mb-4">
                  {{ profile.name || 'Alex Morgan' }}
                </h1>
                <p class="text-lg sm:text-xl font-medium text-zinc-600 dark:text-zinc-400 mb-6 font-mono">
                  {{ profile.title || 'Full-Stack Software Engineer' }}
                </p>

                <!-- Short Bio -->
                <p class="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed mb-8">
                  {{ profile.short_bio || 'I craft minimalist, high-performance web applications and robust digital architectures.' }}
                </p>

                <!-- Action Buttons -->
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <a
                    href="#projects"
                    @click.prevent="scrollTo('#projects')"
                    class="btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-6 py-3 rounded-xl font-semibold text-sm shadow-sm transition-all"
                  >
                    View Projects
                  </a>
                  
                  <a
                    href="#contact"
                    @click.prevent="scrollTo('#contact')"
                    class="btn border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white bg-transparent text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    Contact Me
                  </a>

                  <a
                    v-if="resumeInfo.has_resume"
                    href="api/resume.php?action=download"
                    target="_blank"
                    class="btn border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
                  >
                    <app-icon name="download" :size="16"></app-icon>
                    <span>Resume</span>
                  </a>
                </div>

                <!-- Quick Social Row -->
                <div v-if="socialLinks.length" class="mt-8 flex items-center justify-center md:justify-start gap-3">
                  <a
                    v-for="s in socialLinks"
                    :key="s.id"
                    :href="s.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                    :title="s.platform"
                  >
                    <app-icon :name="s.icon || 'globe'" :size="19"></app-icon>
                  </a>
                </div>
              </div>

              <!-- Right Column: Avatar / Portrait -->
              <div class="relative shrink-0">
                <div class="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-xl flex items-center justify-center">
                  <img
                    v-if="profile.profile_image"
                    :src="profile.profile_image"
                    :alt="profile.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-4xl sm:text-5xl font-mono font-bold text-zinc-400 dark:text-zinc-600">
                    {{ (profile.name || 'AM').split(' ').map(w => w[0]).join('').slice(0, 2) }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 2. ABOUT ME SECTION -->
        <section id="about" class="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div class="max-w-4xl mx-auto px-4 sm:px-6">
            <div class="mb-12">
              <span class="text-xs font-mono font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2">01 // Background</span>
              <h2 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">About Me</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="md:col-span-2 space-y-5 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <p v-if="profile.biography" class="whitespace-pre-line">
                  {{ profile.biography }}
                </p>
                <div v-if="profile.career_goals" class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 class="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2 font-mono">Career Goals & Vision</h4>
                  <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{{ profile.career_goals }}</p>
                </div>
              </div>

              <!-- Quick Info Card -->
              <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm h-fit space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">Contact Info</h4>
                
                <div v-if="profile.email" class="text-sm">
                  <span class="block text-xs text-zinc-500 mb-0.5">Email</span>
                  <a :href="'mailto:' + profile.email" class="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
                    {{ profile.email }}
                  </a>
                </div>

                <div v-if="profile.phone" class="text-sm">
                  <span class="block text-xs text-zinc-500 mb-0.5">Phone</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ profile.phone }}</span>
                </div>

                <div v-if="profile.location" class="text-sm">
                  <span class="block text-xs text-zinc-500 mb-0.5">Location</span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ profile.location }}</span>
                </div>

                <div class="pt-2">
                  <a
                    href="#contact"
                    @click.prevent="scrollTo('#contact')"
                    class="w-full btn bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs py-2 rounded-lg font-semibold block text-center"
                  >
                    Send Message
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. SKILLS SECTION -->
        <section id="skills" class="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800">
          <div class="max-w-5xl mx-auto px-4 sm:px-6">
            <div class="mb-12">
              <span class="text-xs font-mono font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2">02 // Technical Stack</span>
              <h2 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Skills & Competencies</h2>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Core toolsets, architectures, and programming environments I leverage.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                v-for="(skillsList, category) in skillsGrouped"
                :key="category"
                class="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
              >
                <div class="flex items-center gap-2 mb-6 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span class="w-2 h-2 rounded-full bg-black dark:bg-white"></span>
                  <h3 class="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">{{ category }}</h3>
                </div>

                <div class="space-y-4">
                  <div v-for="skill in skillsList" :key="skill.id" class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                        <app-icon :name="skill.icon || 'code'" :size="13"></app-icon>
                        <span>{{ skill.name }}</span>
                      </span>
                      <span class="font-mono text-zinc-500 dark:text-zinc-400">{{ skill.proficiency }}%</span>
                    </div>
                    <!-- Minimalist Monochrome Progress Track -->
                    <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-zinc-900 dark:bg-zinc-200 rounded-full transition-all duration-500"
                        :style="{ width: skill.proficiency + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. PROJECTS SECTION -->
        <section id="projects" class="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <span class="text-xs font-mono font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2">03 // Selected Works</span>
                <h2 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Featured Projects</h2>
                <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Production applications, software libraries, and digital platforms.</p>
              </div>

              <!-- Category Filter Buttons -->
              <div v-if="categories.length" class="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  @click="activeCategory = 'All'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  :class="activeCategory === 'All'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'"
                >
                  All
                </button>
                <button
                  v-for="cat in categories"
                  :key="cat"
                  type="button"
                  @click="activeCategory = cat"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  :class="activeCategory === cat
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <!-- Project Cards Grid -->
            <div v-if="filteredProjects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="project in filteredProjects"
                :key="project.id"
                class="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <!-- Card Header / Image -->
                <div>
                  <div class="h-48 w-full bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
                    <img
                      v-if="project.image"
                      :src="project.image"
                      :alt="project.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 font-mono text-sm">
                      <app-icon name="folder-git-2" :size="36" class-name="opacity-40"></app-icon>
                    </div>

                    <!-- Category & Featured Badges -->
                    <div class="absolute top-3 left-3 flex items-center gap-2">
                      <span class="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-black/80 dark:bg-white/90 text-white dark:text-black backdrop-blur-sm">
                        {{ project.category }}
                      </span>
                      <span v-if="project.featured" class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-black dark:bg-black dark:text-white border border-zinc-200 dark:border-zinc-700">
                        Featured
                      </span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="p-6">
                    <h3 class="text-lg font-bold text-zinc-950 dark:text-white mb-2 group-hover:underline">
                      <router-link :to="'/projects/' + project.slug">
                        {{ project.title }}
                      </router-link>
                    </h3>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                      {{ project.description }}
                    </p>

                    <!-- Technologies -->
                    <div class="flex flex-wrap gap-1.5 mb-2">
                      <span
                        v-for="t in parseTech(project.technologies)"
                        :key="t"
                        class="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {{ t }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
                  <router-link
                    :to="'/projects/' + project.slug"
                    class="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <app-icon name="arrow-right" :size="13"></app-icon>
                  </router-link>

                  <div class="flex items-center gap-3">
                    <a
                      v-if="project.github_url"
                      :href="project.github_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <app-icon name="github" :size="16"></app-icon>
                    </a>
                    <a
                      v-if="project.live_url"
                      :href="project.live_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                      title="Live Preview"
                    >
                      <app-icon name="external-link" :size="16"></app-icon>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
              <p class="text-sm text-zinc-500">No projects found in this category.</p>
            </div>
          </div>
        </section>

        <!-- 5. EXPERIENCE SECTION -->
        <section id="experience" class="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800">
          <div class="max-w-4xl mx-auto px-4 sm:px-6">
            <div class="mb-12">
              <span class="text-xs font-mono font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2">04 // Career</span>
              <h2 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Work Experience</h2>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Chronological timeline of professional roles and contributions.</p>
            </div>

            <div v-if="experiences.length" class="relative timeline-line pl-8 space-y-12">
              <div v-for="exp in experiences" :key="exp.id" class="relative group">
                <!-- Timeline Dot -->
                <div class="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-950 bg-black dark:bg-white"></div>

                <div class="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 class="text-lg font-bold text-zinc-950 dark:text-white">{{ exp.job_title }}</h3>
                      <p class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">
                        {{ exp.company }} <span v-if="exp.location" class="text-zinc-400 font-normal">({{ exp.location }})</span>
                      </p>
                    </div>

                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {{ exp.start_date }} &mdash; {{ exp.currently_working ? 'Present' : exp.end_date }}
                      </span>
                    </div>
                  </div>

                  <p v-if="exp.description" class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {{ exp.description }}
                  </p>

                  <div v-if="exp.responsibilities" class="mb-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-zinc-200 dark:border-zinc-800">
                    {{ exp.responsibilities }}
                  </div>

                  <div v-if="exp.technologies" class="flex flex-wrap gap-1.5 pt-2">
                    <span
                      v-for="t in parseTech(exp.technologies)"
                      :key="t"
                      class="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
                    >
                      {{ t }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-zinc-500 text-sm">
              No experience records added yet.
            </div>
          </div>
        </section>

        <!-- 6. EDUCATION SECTION -->
        <section id="education" class="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div class="max-w-4xl mx-auto px-4 sm:px-6">
            <div class="mb-12">
              <span class="text-xs font-mono font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2">05 // Academics</span>
              <h2 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Education & Certifications</h2>
            </div>

            <div v-if="educations.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="edu in educations"
                :key="edu.id"
                class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div class="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 class="text-base font-bold text-zinc-950 dark:text-white">{{ edu.degree }}</h3>
                      <p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">{{ edu.field }}</p>
                    </div>
                    <span class="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {{ edu.start_year }} &mdash; {{ edu.end_year }}
                    </span>
                  </div>

                  <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-mono mb-3">
                    {{ edu.school }}
                  </p>

                  <p v-if="edu.description" class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {{ edu.description }}
                  </p>
                </div>

                <div v-if="edu.certificate_url" class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <a
                    :href="edu.certificate_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>View Certificate</span>
                    <app-icon name="external-link" :size="12"></app-icon>
                  </a>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-zinc-500 text-sm">
              No education records added yet.
            </div>
          </div>
        </section>

        <!-- 7. RESUME CTA SECTION -->
        <section class="py-16 border-b border-zinc-200 dark:border-zinc-800">
          <div class="max-w-4xl mx-auto px-4 sm:px-6">
            <div class="bg-black dark:bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-zinc-800">
              <div class="text-center md:text-left">
                <span class="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-2">Curriculum Vitae</span>
                <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Need a concise overview?</h3>
                <p class="text-sm text-zinc-300 mt-2 max-w-lg">
                  Download my full professional PDF resume detailing complete employment history, achievements, and technical certifications.
                </p>
              </div>

              <div>
                <a
                  v-if="resumeInfo.has_resume"
                  href="api/resume.php?action=download"
                  target="_blank"
                  class="btn bg-white text-black hover:bg-zinc-200 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <app-icon name="file-down" :size="18"></app-icon>
                  <span>Download Resume (PDF)</span>
                </a>
                <span v-else class="text-xs font-mono text-zinc-400 border border-zinc-700 px-4 py-2 rounded-lg block text-center">
                  Resume Available Upon Request
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 8. CONTACT FORM SECTION -->
        <section id="contact" class="py-20 md:py-28">
          <div class="max-w-3xl mx-auto px-4 sm:px-6">
            <div class="text-center mb-12">
              <span class="text-xs font-mono font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 block mb-2">06 // Inquiries</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Get In Touch</h2>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md mx-auto">
                Have a project idea, consulting question, or potential position? Send me a direct message.
              </p>
            </div>

            <!-- Form Card -->
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div v-if="contactSuccess" class="p-4 mb-6 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-medium border border-zinc-300 dark:border-zinc-700 flex items-center gap-3">
                <app-icon name="check-circle" :size="20"></app-icon>
                <span>Thank you! Your message has been safely saved and sent to my inbox.</span>
              </div>

              <form @submit.prevent="submitContact" class="space-y-5">
                <!-- Honeypot -->
                <input type="text" v-model="contactForm.website_honeypot" class="hidden" tabindex="-1" autocomplete="off" />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      v-model="contactForm.name"
                      placeholder="Jane Doe"
                      required
                      class="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                      :class="{'border-red-500': contactErrors.name}"
                    />
                    <p v-if="contactErrors.name" class="text-xs text-red-500 mt-1">{{ contactErrors.name }}</p>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      v-model="contactForm.email"
                      placeholder="jane@example.com"
                      required
                      class="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                      :class="{'border-red-500': contactErrors.email}"
                    />
                    <p v-if="contactErrors.email" class="text-xs text-red-500 mt-1">{{ contactErrors.email }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono">
                    Subject *
                  </label>
                  <input
                    type="text"
                    v-model="contactForm.subject"
                    placeholder="Project Inquiry / Opportunity"
                    required
                    class="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                    :class="{'border-red-500': contactErrors.subject}"
                  />
                  <p v-if="contactErrors.subject" class="text-xs text-red-500 mt-1">{{ contactErrors.subject }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono">
                    Message *
                  </label>
                  <textarea
                    v-model="contactForm.message"
                    rows="5"
                    placeholder="Hello Alex, I'd like to discuss..."
                    required
                    class="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                    :class="{'border-red-500': contactErrors.message}"
                  ></textarea>
                  <p v-if="contactErrors.message" class="text-xs text-red-500 mt-1">{{ contactErrors.message }}</p>
                </div>

                <div class="pt-2">
                  <button
                    type="submit"
                    :disabled="contactLoading"
                    class="w-full btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span v-if="contactLoading" class="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                    <app-icon v-else name="send" :size="16"></app-icon>
                    <span>{{ contactLoading ? 'Sending message...' : 'Send Message' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </main>

      <app-footer :profile="profile" :social-links="socialLinks"></app-footer>
    </div>
  `
};
