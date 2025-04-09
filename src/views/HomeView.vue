<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import Swal from 'sweetalert2';
import { TrashIcon, PencilSquareIcon, PlusCircleIcon, Bars2Icon } from '@heroicons/vue/24/solid';

import TaskInput from '@/components/TaskInput.vue';

interface task {
  id: number;
  title: string;
  completed: boolean;
  onEdit: boolean;
}

const SwalStyledButton = Swal.mixin({
  customClass: {
    confirmButton: 'bg-red-500 text-white py-2 px-4 rounded-md cursor-pointer mx-2',
    cancelButton: 'bg-gray-500 text-white py-2 px-4 rounded-md cursor-pointer mx-2',
  },
  buttonsStyling: false,
});

const tasks: Ref<task[]> = useStorage('tasks', []);

// CODE BLOCK - complete a task
const strikeThroughClass: Ref<string> = ref('line-through text-gray-500');

// CODE BLOCK - add task
const isMainAddTaskInputHidden: Ref<boolean> = ref(true);
const inputTaskTitle: Ref<string> = ref('');

function toggleMainAddTaskInput(): void {
  isMainAddTaskInputHidden.value = !isMainAddTaskInputHidden.value;
}

function addTask(): void {
  if (inputTaskTitle.value.trim() === '') return;

  const temp = {
    id: tasks.value.length + 1,
    title: inputTaskTitle.value,
    completed: false,
    onEdit: false,
  };

  tasks.value.push(temp);

  inputTaskTitle.value = '';
}

// CODE BLOCK - delete
const deleteTaskId: Ref<number | null> = ref(null);

function triggerDelete(id: number): void {
  deleteTaskId.value = id;

  SwalStyledButton.fire({
    text: 'Delete this task?',
    confirmButtonText: 'Delete',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask();
    }
    deleteTaskId.value = null;
  });
}

function deleteTask() {
  tasks.value = tasks.value.filter((task) => task.id !== deleteTaskId.value);
}
</script>

<template>
  <main class="mx-auto max-w-xl py-4 px-2">
    <h1 class="font-bold mb-8 text-4xl">Simple Todos</h1>

    <div>
      <div
        v-if="isMainAddTaskInputHidden"
        @click="toggleMainAddTaskInput"
        class="flex cursor-pointer"
      >
        <PlusCircleIcon class="size-6" /><span class="ml-2">Add Task</span>
      </div>
      <div v-else>
        <TaskInput
          v-model="inputTaskTitle"
          @close-editor="toggleMainAddTaskInput"
          @add-task="addTask"
        />
      </div>
    </div>

    <hr class="my-4" />

    <div>
      <div v-for="task in tasks" class="flex mb-2" :key="task.id">
        <div class="p-1 pl-0"><Bars2Icon class="size-6 text-blue-500" /></div>
        <div class="p-1"><input type="checkbox" v-model="task.completed" /></div>
        <div class="p-1 flex-auto" :class="{ [strikeThroughClass]: task.completed }">
          {{ task.title }}
        </div>
        <div class="flex p-1">
          <div>
            <div
              class="border border-gray-300 rounded-sm cursor-pointer w-6 h-6 flex items-center justify-center"
            >
              <PencilSquareIcon class="size-4 text-blue-500" />
            </div>
          </div>
          <div class="ml-2">
            <div
              class="border border-gray-300 rounded-sm cursor-pointer w-6 h-6 flex items-center justify-center"
              @click="triggerDelete(task.id)"
            >
              <TrashIcon class="size-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
