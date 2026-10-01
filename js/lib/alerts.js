// Alerts & Notifications Helper using SweetAlert2 styled in Monochrome
const AppAlerts = {
  toast(message, icon = 'success') {
    if (window.Swal) {
      const isDark = document.documentElement.classList.contains('dark');
      const Toast = window.Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: isDark ? '#18181b' : '#ffffff',
        color: isDark ? '#f4f4f5' : '#09090b',
        customClass: {
          popup: 'border border-zinc-200 dark:border-zinc-800 shadow-lg text-sm rounded-lg'
        }
      });
      Toast.fire({
        icon: icon === 'error' ? 'error' : 'success',
        title: message
      });
    } else {
      console.log(`[Toast ${icon}]: ${message}`);
    }
  },

  async confirm(title = 'Are you sure?', text = 'This action cannot be undone.', confirmButtonText = 'Yes, delete') {
    if (window.Swal) {
      const isDark = document.documentElement.classList.contains('dark');
      const result = await window.Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#09090b',
        cancelButtonColor: '#71717a',
        confirmButtonText,
        cancelButtonText: 'Cancel',
        background: isDark ? '#18181b' : '#ffffff',
        color: isDark ? '#f4f4f5' : '#09090b',
        customClass: {
          popup: 'border border-zinc-200 dark:border-zinc-800 rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90',
          cancelButton: 'px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 ml-2'
        },
        buttonsStyling: false
      });
      return result.isConfirmed;
    }
    return window.confirm(`${title}\n${text}`);
  },

  success(title, text) {
    if (window.Swal) {
      const isDark = document.documentElement.classList.contains('dark');
      window.Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#09090b',
        background: isDark ? '#18181b' : '#ffffff',
        color: isDark ? '#f4f4f5' : '#09090b',
        customClass: {
          popup: 'border border-zinc-200 dark:border-zinc-800 rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
        },
        buttonsStyling: false
      });
    } else {
      alert(`${title}\n${text}`);
    }
  },

  error(title, text) {
    if (window.Swal) {
      const isDark = document.documentElement.classList.contains('dark');
      window.Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#09090b',
        background: isDark ? '#18181b' : '#ffffff',
        color: isDark ? '#f4f4f5' : '#09090b',
        customClass: {
          popup: 'border border-zinc-200 dark:border-zinc-800 rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
        },
        buttonsStyling: false
      });
    } else {
      alert(`Error: ${title}\n${text}`);
    }
  }
};
