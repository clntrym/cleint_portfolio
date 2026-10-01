// Component: StatusBadge
// Minimalist Monochrome badges
window.StatusBadge = {
  name: 'StatusBadge',
  props: {
    status: {
      type: [String, Number, Boolean],
      default: ''
    },
    variant: {
      type: String,
      default: 'default' // 'published', 'featured', 'unread', 'tag', 'default'
    }
  },
  setup(props) {
    const badgeConfig = Vue.computed(() => {
      if (props.variant === 'published') {
        const isPub = Number(props.status) === 1 || props.status === true;
        return {
          label: isPub ? 'Published' : 'Draft',
          classes: isPub 
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent' 
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
        };
      }
      if (props.variant === 'featured') {
        const isFeat = Number(props.status) === 1 || props.status === true;
        if (!isFeat) return null;
        return {
          label: 'Featured',
          classes: 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900 font-mono text-[11px]'
        };
      }
      if (props.variant === 'unread') {
        const isUnread = Number(props.status) === 0;
        return {
          label: isUnread ? 'Unread' : 'Read',
          classes: isUnread
            ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        };
      }
      if (props.variant === 'enabled') {
        const isEn = Number(props.status) === 1 || props.status === true;
        return {
          label: isEn ? 'Active' : 'Disabled',
          classes: isEn
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        };
      }
      // default / tag
      return {
        label: String(props.status),
        classes: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
      };
    });

    return { badgeConfig };
  },
  template: `
    <span v-if="badgeConfig" class="inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium transition-colors" :class="badgeConfig.classes">
      {{ badgeConfig.label }}
    </span>
  `
};
