<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { TrashIcon, PencilSquareIcon, Bars2Icon } from '@heroicons/vue/24/solid';

interface Props {
  id: number;
  title: string;
  completed: boolean;
  onEdit: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits([
  'triggerDelete',
  'triggerEdit',
  'triggerComplete',
  'onDragStart',
  'onDrop',
  'onDragEnd',
]);

const strikeThroughClass: Ref<string> = ref('line-through text-gray-500');

function triggerDelete(id: number): void {
  emit('triggerDelete', id);
}

function triggerEdit(id: number): void {
  emit('triggerEdit', id);
}

function triggerComplete(id: number): void {
  emit('triggerComplete', id);
}

// CODE BLOCK - drag and drop
const showDropzone: Ref<boolean> = ref(false);

function onDragStart(id: number): void {
  emit('onDragStart', id);
}

function onDragOver(): void {
  showDropzone.value = true;
}

function onDragLeave(): void {
  showDropzone.value = false;
}

function onDragEnd(): void {
  showDropzone.value = false;
  emit('onDragEnd');
}

function onDrop(id: number): void {
  showDropzone.value = false;
  emit('onDrop', id);
}
</script>

<template>
  <div @drop="onDrop(props.id)" @dragover.prevent @dragenter.prevent>
    <div class="my-2" @dragover="onDragOver()" @dragleave="onDragLeave()" @dragend="onDragEnd()">
      <div class="invisible" :class="{ visible: showDropzone }">
        <hr class="border-blue-500" />
      </div>
      <div class="flex" draggable="true" @dragstart="onDragStart(props.id)">
        <div class="p-1 pl-0 cursor-move"><Bars2Icon class="size-6 text-blue-500" /></div>
        <div class="p-1" @click="triggerComplete(props.id)" draggable="false">
          <input type="checkbox" :checked="props.completed" />
        </div>
        <div class="p-1 flex-auto" :class="{ [strikeThroughClass]: props.completed }">
          {{ props.title }}
        </div>
        <div class="flex p-1">
          <div
            @click="triggerEdit(props.id)"
            class="border border-gray-300 rounded-sm cursor-pointer w-8 h-8 flex items-center justify-center"
          >
            <PencilSquareIcon class="size-4 text-blue-500" />
          </div>
          <div class="ml-2">
            <div
              @click="triggerDelete(props.id)"
              class="border border-gray-300 rounded-sm cursor-pointer w-8 h-8 flex items-center justify-center"
            >
              <TrashIcon class="size-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
