// Component: AppIcon
// Renders Lucide icons with automatic icon initialization
window.AppIcon = {
  name: 'AppIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 18
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const iconRef = Vue.ref(null);

    const refresh = () => {
      Vue.nextTick(() => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons({
            attrs: {
              width: props.size,
              height: props.size,
              'stroke-width': props.strokeWidth
            }
          });
        }
      });
    };

    Vue.onMounted(refresh);
    Vue.watch(() => [props.name, props.size], refresh);

    return { iconRef };
  },
  template: `
    <span class="inline-flex items-center justify-center shrink-0" :class="className">
      <i :data-lucide="name" :key="name" ref="iconRef"></i>
    </span>
  `
};
