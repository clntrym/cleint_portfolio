// View: Admin MessagesPage (/admin/messages)
window.AdminMessagesPage = {
  name: 'AdminMessagesPage',
  components: {
    AppSidebar: window.AppSidebar,
    AppTopbar: window.AppTopbar,
    AppIcon: window.AppIcon,
    StatusBadge: window.StatusBadge,
    AppModal: window.AppModal,
    ConfirmModal: window.ConfirmModal
  },
  setup() {
    const isSidebarOpen = Vue.ref(false);
    const loading = Vue.ref(true);
    const messages = Vue.ref([]);
    const searchQuery = Vue.ref('');
    const statusFilter = Vue.ref(''); // '' = all, '0' = unread, '1' = read

    // View Modal
    const activeMessage = Vue.ref(null);
    const isViewModalOpen = Vue.ref(false);

    // Delete Modal
    const isDeleteModalOpen = Vue.ref(false);
    const messageToDelete = Vue.ref(null);
    const deleting = Vue.ref(false);

    const store = window.AppStore;

    const loadMessages = async () => {
      loading.value = true;
      try {
        const res = await AppModel.Messages.getAll();
        if (res && res.success) {
          messages.value = res.data || [];
          store.unreadMessagesCount = res.unread_count || 0;
        }
      } catch (err) {
        AppAlerts.error('Failed to load messages', err.message);
      } finally {
        loading.value = false;
        AppNavigation.renderIcons();
      }
    };

    const filteredMessages = Vue.computed(() => {
      return messages.value.filter(m => {
        const matchesQuery = !searchQuery.value.trim() ||
          m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          m.message.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesStatus = statusFilter.value === '' || Number(m.is_read) === Number(statusFilter.value);
        return matchesQuery && matchesStatus;
      });
    });

    const openMessage = async (msg) => {
      activeMessage.value = msg;
      isViewModalOpen.value = true;
      if (!Number(msg.is_read)) {
        await toggleRead(msg);
      }
    };

    const toggleRead = async (msg) => {
      try {
        await AppModel.Messages.toggleRead(msg.id);
        msg.is_read = 1 - msg.is_read;
        await store.fetchUnreadCount();
      } catch (err) {
        AppAlerts.error('Failed to update status', err.message);
      }
    };

    const markAllAsRead = async () => {
      try {
        await AppModel.Messages.markAllRead();
        messages.value.forEach(m => m.is_read = 1);
        store.unreadMessagesCount = 0;
        AppAlerts.toast('All messages marked as read.');
      } catch (err) {
        AppAlerts.error('Action Failed', err.message);
      }
    };

    const confirmDelete = (msg) => {
      messageToDelete.value = msg;
      isDeleteModalOpen.value = true;
    };

    const deleteMessage = async () => {
      if (!messageToDelete.value) return;
      deleting.value = true;
      try {
        await AppModel.Messages.delete(messageToDelete.value.id);
        AppAlerts.toast('Message deleted.');
        isDeleteModalOpen.value = false;
        if (activeMessage.value && activeMessage.value.id === messageToDelete.value.id) {
          isViewModalOpen.value = false;
        }
        await loadMessages();
      } catch (err) {
        AppAlerts.error('Delete Failed', err.message);
      } finally {
        deleting.value = false;
      }
    };

    Vue.onMounted(loadMessages);

    return {
      isSidebarOpen,
      loading,
      messages,
      searchQuery,
      statusFilter,
      filteredMessages,
      activeMessage,
      isViewModalOpen,
      isDeleteModalOpen,
      messageToDelete,
      deleting,
      openMessage,
      toggleRead,
      markAllAsRead,
      confirmDelete,
      deleteMessage
    };
  },
  template: `
    <div class="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <app-sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false"></app-sidebar>

      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar title="Inquiries & Messages" @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></app-topbar>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          <!-- Toolbar -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <!-- Search -->
              <div class="relative w-full sm:w-64">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search sender, subject..."
                  class="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none"
                />
                <span class="absolute left-3 top-2.5 text-zinc-400">
                  <app-icon name="search" :size="14"></app-icon>
                </span>
              </div>

              <!-- Filter tabs -->
              <div class="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  type="button"
                  @click="statusFilter = ''"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  :class="statusFilter === '' ? 'bg-white dark:bg-zinc-950 text-black dark:text-white shadow-sm' : 'text-zinc-500'"
                >
                  All ({{ messages.length }})
                </button>
                <button
                  type="button"
                  @click="statusFilter = '0'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  :class="statusFilter === '0' ? 'bg-white dark:bg-zinc-950 text-black dark:text-white shadow-sm' : 'text-zinc-500'"
                >
                  Unread
                </button>
                <button
                  type="button"
                  @click="statusFilter = '1'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  :class="statusFilter === '1' ? 'bg-white dark:bg-zinc-950 text-black dark:text-white shadow-sm' : 'text-zinc-500'"
                >
                  Read
                </button>
              </div>
            </div>

            <button
              v-if="messages.some(m => !Number(m.is_read))"
              type="button"
              @click="markAllAsRead"
              class="btn border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
            >
              <app-icon name="check-check" :size="14"></app-icon>
              <span>Mark All as Read</span>
            </button>
          </div>

          <!-- Messages List Card -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div v-if="loading" class="py-20 text-center">
              <div class="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-xs font-mono text-zinc-500">Checking inbox...</p>
            </div>

            <div v-else-if="filteredMessages.length === 0" class="py-16 text-center text-zinc-400 text-xs">
              No messages found.
            </div>

            <div v-else class="divide-y divide-zinc-100 dark:divide-zinc-800">
              <div
                v-for="msg in filteredMessages"
                :key="msg.id"
                class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                :class="{'bg-zinc-50/60 dark:bg-zinc-900/50 font-semibold': !Number(msg.is_read)}"
                @click="openMessage(msg)"
              >
                <!-- Sender Info -->
                <div class="flex items-start gap-4 flex-1 min-w-0">
                  <span
                    class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                    :class="!Number(msg.is_read) ? 'bg-black dark:bg-white animate-pulse' : 'bg-transparent'"
                  ></span>

                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-3">
                      <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{{ msg.name }}</span>
                      <span class="text-xs text-zinc-500 font-mono truncate">&lt;{{ msg.email }}&gt;</span>
                    </div>

                    <h4 class="text-sm text-zinc-800 dark:text-zinc-200 mt-1 font-medium truncate">
                      {{ msg.subject }}
                    </h4>

                    <p class="text-xs text-zinc-500 line-clamp-1 mt-0.5 font-normal">
                      {{ msg.message }}
                    </p>
                  </div>
                </div>

                <!-- Meta & Action -->
                <div class="flex items-center justify-between sm:justify-end gap-4 shrink-0" @click.stop>
                  <span class="text-xs font-mono text-zinc-400">
                    {{ new Date(msg.created_at).toLocaleDateString() }}
                  </span>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="toggleRead(msg)"
                      class="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      :title="Number(msg.is_read) ? 'Mark as Unread' : 'Mark as Read'"
                    >
                      <app-icon :name="Number(msg.is_read) ? 'mail' : 'mail-open'" :size="16"></app-icon>
                    </button>

                    <button
                      type="button"
                      @click="confirmDelete(msg)"
                      class="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      title="Delete Message"
                    >
                      <app-icon name="trash-2" :size="16"></app-icon>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </main>
      </div>

      <!-- View Message Modal -->
      <app-modal
        :is-open="isViewModalOpen"
        title="Inquiry Details"
        subtitle="Contact submission information"
        max-width="max-w-xl"
        @close="isViewModalOpen = false"
      >
        <div v-if="activeMessage" class="space-y-4">
          <div class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono text-zinc-400">Sender</span>
              <span class="text-xs font-mono text-zinc-400">{{ new Date(activeMessage.created_at).toLocaleString() }}</span>
            </div>
            <div class="font-bold text-base text-zinc-900 dark:text-zinc-100">{{ activeMessage.name }}</div>
            <div class="text-xs text-zinc-500 font-mono">
              <a :href="'mailto:' + activeMessage.email" class="hover:underline">{{ activeMessage.email }}</a>
            </div>
          </div>

          <div>
            <span class="text-xs font-mono uppercase text-zinc-400 block mb-1">Subject</span>
            <div class="text-base font-bold text-zinc-900 dark:text-zinc-100">{{ activeMessage.subject }}</div>
          </div>

          <div>
            <span class="text-xs font-mono uppercase text-zinc-400 block mb-1">Message Content</span>
            <div class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {{ activeMessage.message }}
            </div>
          </div>
        </div>

        <template v-slot:footer>
          <div class="flex items-center justify-between w-full">
            <a
              v-if="activeMessage"
              :href="'mailto:' + activeMessage.email + '?subject=Re: ' + encodeURIComponent(activeMessage.subject)"
              class="btn bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
            >
              <app-icon name="reply" :size="14"></app-icon>
              <span>Reply via Email</span>
            </a>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="confirmDelete(activeMessage)"
                class="px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Delete
              </button>
              <button
                type="button"
                @click="isViewModalOpen = false"
                class="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200"
              >
                Close
              </button>
            </div>
          </div>
        </template>
      </app-modal>

      <!-- Delete Confirmation -->
      <confirm-modal
        :is-open="isDeleteModalOpen"
        title="Delete Message"
        message="Are you sure you want to delete this inquiry? This cannot be undone."
        confirm-text="Delete"
        :loading="deleting"
        @confirm="deleteMessage"
        @cancel="isDeleteModalOpen = false"
      ></confirm-modal>

    </div>
  `
};

