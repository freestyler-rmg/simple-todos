<script setup lang="ts">
import type { Ref } from 'vue';

// const inputTaskTitle: Ref<string> = ref('');
const inputTaskTitle: Ref<string> = defineModel({ default: '' });

const emit = defineEmits(['closeEditor', 'addTask']);

function closeEditor() {
  emit('closeEditor');
}

function addTask() {
  emit('addTask');
}
</script>

<template>
  <input
    v-model="inputTaskTitle"
    type="text"
    class="border-2 border-gray-300 rounded-md p-2 w-full"
    placeholder="Task name..."
  />
  <div class="flex justify-end mt-2">
    <button class="bg-gray-500 text-white rounded-md py-1 px-3 cursor-pointer" @click="closeEditor">
      Cancel
    </button>
    <button
      class="bg-blue-500 text-white rounded-md py-1 px-3 cursor-pointer ml-2"
      @click="addTask"
    >
      Add
    </button>
  </div>
</template>
