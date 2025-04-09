<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useStorage, useTimeout } from '@vueuse/core';
import Swal from 'sweetalert2';
import 'drag-drop-touch';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

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

// CODE BLOCK - delete and undo delete
const deleteTaskId: Ref<number | null> = ref(null);
const previousTasks: Ref<task[]> = ref([]);

const { ready, start, stop } = useTimeout(5000, { controls: true });
stop();

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
  previousTasks.value = [...tasks.value];
  tasks.value = tasks.value.filter((task) => task.id !== deleteTaskId.value);
  start();
}

function undoDeleteTask() {
  tasks.value = previousTasks.value;
  previousTasks.value = [];
  stop();
}

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

// CODE BLOCK - drag and drop
const dragTaskId: Ref<number | null> = ref(null);

function onDragStart(id: number) {
  dragTaskId.value = id;
}

function onDrop(dropTaskId: number) {
  const dragTaskIndex = tasks.value.findIndex((task) => task.id === dragTaskId.value);
  const dropTaskIndex = tasks.value.findIndex((task) => task.id === dropTaskId);

  if (dragTaskIndex !== -1 && dropTaskIndex !== -1) {
    const draggedTask = tasks.value.splice(dragTaskIndex, 1);
    if (dragTaskIndex < dropTaskIndex) {
      tasks.value.splice(dropTaskIndex - 1, 0, ...draggedTask);
    } else {
      tasks.value.splice(dropTaskIndex, 0, ...draggedTask);
    }
  }

  dragTaskId.value = null;
}

function onDragEnd() {
  dragTaskId.value = null;
}
</script>

<template>
  <main class="mx-auto max-w-xl py-4 px-2 pb-24">
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
          @onDragStart="onDragStart(task.id)"
          @onDragEnd="onDragEnd()"
          @onDrop="onDrop(task.id)"
        />
      </template>
      <div class="p-4" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>dropzone</div>
    </div>

    <div v-if="!ready" class="fixed bottom-0 left-0 right-0 p-4 max-w-xl mx-auto">
      <div class="bg-gray-800 text-white p-4 rounded-md text-center">
        Task deleted. <button class="underline cursor-pointer" @click="undoDeleteTask">Undo</button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
