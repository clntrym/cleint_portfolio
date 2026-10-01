// Component: FormField
// Reusable accessible input/textarea/select wrapper
window.FormField = {
  name: 'FormField',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: ''
    },
    type: {
      type: String,
      default: 'text' // 'text', 'email', 'password', 'textarea', 'select', 'checkbox', 'number'
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    rows: {
      type: [Number, String],
      default: 4
    },
    helpText: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div class="mb-4">
      <div v-if="type === 'checkbox'" class="flex items-center gap-3">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
          class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
        />
        <label class="text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
          {{ label }} <span v-if="required" class="text-zinc-500">*</span>
        </label>
      </div>

      <div v-else>
        <label v-if="label" class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
          {{ label }} <span v-if="required" class="text-zinc-500">*</span>
        </label>

        <textarea
          v-if="type === 'textarea'"
          :value="modelValue"
          :placeholder="placeholder"
          :rows="rows"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
          :class="{'border-zinc-900 dark:border-zinc-100': error}"
        ></textarea>

        <select
          v-else-if="type === 'select'"
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all cursor-pointer"
        >
          <option v-for="opt in options" :key="opt.value ?? opt" :value="opt.value ?? opt">
            {{ opt.label ?? opt }}
          </option>
        </select>

        <input
          v-else
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all"
          :class="{'border-zinc-900 dark:border-zinc-100': error}"
        />
      </div>

      <p v-if="error" class="mt-1 text-xs text-zinc-600 dark:text-zinc-400 font-medium">{{ error }}</p>
      <p v-else-if="helpText" class="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{{ helpText }}</p>
    </div>
  `
};
