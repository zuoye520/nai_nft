<template>
  <a 
    :href="href" 
    target="_blank" 
    rel="noopener noreferrer"
    class="text-gray-400 hover:text-green-400 transition-colors"
  >
    <component :is="icons[icon]" class="w-6 h-6" />
  </a>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { 
  GlobeAltIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) => ['twitter', 'telegram', 'website'].includes(value)
  },
  href: {
    type: String,
    required: true
  }
})

const icons = {
  twitter: defineComponent({
    render: () => h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'w-6 h-6',
      fill: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' })
    ])
  }),
  telegram: PaperAirplaneIcon,
  website: GlobeAltIcon
}
</script>