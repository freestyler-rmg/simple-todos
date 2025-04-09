<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import Swal from 'sweetalert2';
import { TrashIcon, PencilSquareIcon, PlusCircleIcon, Bars2Icon } from '@heroicons/vue/24/solid';

import TaskInput from '@/components/TaskInput.vue';
import TaskItem from '@/components/TaskItem.vue';

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
function triggerComplete(id: number): void {
  const task = tasks.value.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
  }
}

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

// CODE BLOCK - undo delete

// CODE BLOCK - edit
const editTaskId: Ref<number | null> = ref(null);
const inputTaskTitleEdit: Ref<string> = ref('');
const taskArrayIndex: Ref<number | null> = ref(null);

function triggerEdit(id: number): void {
  if (id !== editTaskId.value) {
    closeEdit();
  }
  taskArrayIndex.value = tasks.value.findIndex((task) => task.id === id);
  if (taskArrayIndex.value !== -1) {
    tasks.value[taskArrayIndex.value].onEdit = !tasks.value[taskArrayIndex.value].onEdit;
    inputTaskTitleEdit.value = tasks.value[taskArrayIndex.value].title;
    editTaskId.value = id;
  }
}

function closeEdit(): void {
  if (taskArrayIndex.value !== -1 && taskArrayIndex.value !== null) {
    tasks.value[taskArrayIndex.value].onEdit = false;
    inputTaskTitleEdit.value = '';
    editTaskId.value = null;
    taskArrayIndex.value = null;
  }
}

function updateTask(): void {
  if (inputTaskTitleEdit.value.trim() === '') {
    closeEdit();
    return;
  }

  if (taskArrayIndex.value !== -1 && taskArrayIndex.value !== null) {
    const task = tasks.value[taskArrayIndex.value];
    task.title = inputTaskTitleEdit.value;

    closeEdit();
  }
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
          @update-task="addTask"
        />
      </div>
    </div>

    <hr class="my-4" />

    <div>
      <template v-for="task in tasks" :key="task.id">
        <TaskInput
          v-if="task.onEdit"
          v-model="inputTaskTitleEdit"
          @close-editor="closeEdit"
          @update-task="updateTask"
          button-text="Update"
          class="mb-4"
        />
        <TaskItem
          v-else
          :id="task.id"
          :title="task.title"
          :completed="task.completed"
          :onEdit="task.onEdit"
          @triggerDelete="triggerDelete(task.id)"
          @triggerEdit="triggerEdit(task.id)"
          @triggerComplete="triggerComplete(task.id)"
        />
      </template>
    </div>
  </main>
</template>
