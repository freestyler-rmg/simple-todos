<script setup lang="ts">
import type { Ref } from 'vue';

interface props {
  buttonText?: string;
}

const { buttonText = 'Add' } = defineProps<props>();

const inputTaskTitle: Ref<string> = defineModel({ default: '' });

const emit = defineEmits(['closeEditor', 'updateTask']);

function closeEditor() {
  emit('closeEditor');
}

function updateTask() {
  emit('updateTask');
}
</script>

<template>
  <div>
    <input
      v-model="inputTaskTitle"
      type="text"
      class="border-2 border-gray-300 rounded-md p-2 w-full"
      placeholder="Task name..."
    />
    <div class="flex justify-end mt-2">
      <button
        class="bg-gray-500 text-white rounded-md py-1 px-3 cursor-pointer"
        @click="closeEditor"
      >
        Cancel
      </button>
      <button
        class="bg-blue-500 text-white rounded-md py-1 px-3 cursor-pointer ml-2"
        @click="updateTask"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
