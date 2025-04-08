<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { TrashIcon, PencilSquareIcon, PlusCircleIcon, Bars2Icon } from '@heroicons/vue/24/solid';

// const tasks = ref([
//   { id: 1, title: 'Task 1', completed: false },
//   { id: 2, title: 'Task 2', completed: false },
// ]);

const tasks = useStorage('tasks', []);

const isMainAddTaskInputHidden = ref(true);
const inputTaskTitle = ref('');

const strikeThroughClass = ref('line-through text-gray-500');

function toggleMainAddTaskInput() {
  isMainAddTaskInputHidden.value = !isMainAddTaskInputHidden.value;
}

function addTask() {
  if (inputTaskTitle.value.trim() === '') return;

  const temp = {
    id: tasks.value.length + 1,
    title: inputTaskTitle.value,
    completed: false,
  };

  tasks.value.push(temp);

  inputTaskTitle.value = '';
}

// function deleteTask(id) {
//   tasks.value = tasks.value.filter(task => task.id !== id);
// }

// function toggleTaskCompletion(id) {
//   const task = tasks.value.find(task => task.id === id);
//   if (task) {
//     task.completed = !task.completed;
//   }
// }
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
        <input
          v-model="inputTaskTitle"
          type="text"
          class="border-2 border-gray-300 rounded-md p-2 w-full"
          placeholder="Task name..."
        />
        <div class="flex justify-end mt-2">
          <button
            class="bg-gray-500 text-white rounded-md py-1 px-3 cursor-pointer"
            @click="toggleMainAddTaskInput"
          >
            Cancel
          </button>
          <button
            class="bg-blue-500 text-white rounded-md py-1 px-3 cursor-pointer ml-2"
            @click="addTask"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <hr class="my-4" />

    <div>
      <div v-for="task in tasks" class="flex">
        <div><Bars2Icon class="size-6 text-blue-500" /></div>
        <div><input type="checkbox" v-model="task.completed" /></div>
        <div :class="{ [strikeThroughClass]: task.completed }">{{ task.title }}</div>
        <div class="flex">
          <div><PencilSquareIcon class="size-4 text-blue-500" /></div>
          <div class="ml-2"><TrashIcon class="size-4 text-blue-500" /></div>
        </div>
      </div>
    </div>
  </main>
</template>
