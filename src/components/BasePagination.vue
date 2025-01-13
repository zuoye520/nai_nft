<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6" >
    <!-- Mobile View -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="onPageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
               text-gray-400 bg-gray-900/50 border border-gray-800
               hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="onPageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
               text-gray-400 bg-gray-900/50 border border-gray-800
               hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Desktop View -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
      <!-- <div>
        <p class="text-sm text-gray-400">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div> -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous Page -->
          <button
            @click="onPageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2
                   text-gray-400 bg-gray-900/50 border border-gray-800
                   hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>

          <!-- Page Numbers -->
          <template v-for="page in displayedPages" :key="page">
            <span
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium
                     text-gray-400 bg-gray-900/50 border border-gray-800"
            >
              ...
            </span>
            <button
              v-else
              @click="onPageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-medium border',
                currentPage === page
                  ? 'z-10 bg-green-500/20 border-green-500 text-green-400'
                  : 'text-gray-400 bg-gray-900/50 border-gray-800 hover:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Next Page -->
          <button
            @click="onPageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2
                   text-gray-400 bg-gray-900/50 border border-gray-800
                   hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:currentPage'])

// 计算总页数
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 计算当前页显示的起始和结束项
const startItem = computed(() => ((props.currentPage - 1) * props.pageSize) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

// 计算要显示的页码
const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 7 // 最多显示的页码数
  
  if (totalPages.value <= maxDisplayed) {
    // 如果总页数小于等于最大显示数，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 始终显示第一页
    pages.push(1)
    
    // 计算中间要显示的页码
    let start = Math.max(2, props.currentPage - 2)
    let end = Math.min(totalPages.value - 1, props.currentPage + 2)
    
    // 如果当前页靠近开始
    if (props.currentPage < 4) {
      end = 5
    }
    
    // 如果当前页靠近结束
    if (props.currentPage > totalPages.value - 3) {
      start = totalPages.value - 4
    }
    
    // 添加省略号和中间页码
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (end < totalPages.value - 1) pages.push('...')
    
    // 始终显示最后一页
    pages.push(totalPages.value)
  }
  
  return pages
})

// 页码改变处理函数
const onPageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>