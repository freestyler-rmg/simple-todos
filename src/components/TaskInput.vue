<script setup lang="ts">
import { onMounted, useTemplateRef, type Ref } from 'vue';
import { useFocus } from '@vueuse/core';

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

// CODE BLOCK - focus
const input = useTemplateRef<HTMLInputElement>('input');
const { focused: inputFocus } = useFocus(input, { initialValue: true });

onMounted(() => {
  inputFocus.value = true;
});
</script>

<template>
  <div>
    <form @submit.prevent="updateTask">
      <input
        ref="input"
        v-model="inputTaskTitle"
        type="text"
        class="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
        placeholder="Task name..."
      />
    </form>
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
