// View: Admin LoginPage (/admin/login)
window.AdminLoginPage = {
  name: 'AdminLoginPage',
  components: {
    AppIcon: window.AppIcon
  },
  setup() {
    const router = VueRouter.useRouter();
    const store = window.AppStore;

    const form = Vue.reactive({
      username: '',
      password: ''
    });
    const showPassword = Vue.ref(false);
    const loading = Vue.ref(false);
    const errorMessage = Vue.ref('');

    const handleLogin = async () => {
      errorMessage.value = '';
      if (!form.username.trim() || !form.password.trim()) {
        errorMessage.value = 'Please enter both username/email and password.';
        return;
      }

      loading.value = true;
      try {
        await store.login(form.username, form.password);
        AppAlerts.toast('Welcome back! Signed in successfully.');
        router.push('/admin');
      } catch (err) {
        errorMessage.value = err.message || 'Invalid username or password.';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      showPassword,
      loading,
      errorMessage,
      handleLogin,
      store
    };
  },
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      <!-- Top Theme Switcher -->
      <div class="absolute top-6 right-6">
        <button
          type="button"
          @click="store.toggleTheme()"
          class="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white bg-white dark:bg-zinc-900"
          title="Toggle theme"
        >
          <app-icon :name="store.theme === 'dark' ? 'sun' : 'moon'" :size="16"></app-icon>
        </button>
      </div>

      <!-- Login Card -->
      <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono font-bold text-lg mx-auto mb-4 shadow-md">
            AM
          </div>
          <h1 class="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Admin Dashboard</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">Sign in to manage portfolio content</p>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-6 p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 flex items-center gap-2">
          <app-icon name="alert-circle" :size="16"></app-icon>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono">
              Username or Email
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.username"
                placeholder="cleint or salarda.cleintraymund@ncst.edu.ph"
                required
                autocomplete="username"
                class="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all pl-10"
              />
              <span class="absolute left-3 top-3.5 text-zinc-400">
                <app-icon name="user" :size="16"></app-icon>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 font-mono">
              Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all pl-10 pr-10"
              />
              <span class="absolute left-3 top-3.5 text-zinc-400">
                <app-icon name="lock" :size="16"></app-icon>
              </span>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <app-icon :name="showPassword ? 'eye-off' : 'eye'" :size="16"></app-icon>
              </button>
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
              <span v-else>Sign In</span>
            </button>
          </div>
        </form>

        <!-- Default Credentials Hint -->
        <div class="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p class="text-xs text-zinc-400 font-mono">
            Credentials: <br />
            <span class="text-zinc-700 dark:text-zinc-300 font-semibold">Username:</span> cleint &nbsp;|&nbsp; 
            <span class="text-zinc-700 dark:text-zinc-300 font-semibold">Password:</span> admin123
          </p>
        </div>

        <div class="mt-4 text-center">
          <router-link to="/" class="text-xs text-zinc-500 hover:underline inline-flex items-center gap-1 font-mono">
            <app-icon name="arrow-left" :size="12"></app-icon>
            <span>Back to Public Portfolio</span>
          </router-link>
        </div>

      </div>
    </div>
  `
};
