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
const emit = defineEmits(['triggerDelete', 'triggerEdit', 'triggerComplete']);

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
</script>

<template>
  <div class="flex mb-2">
    <div class="p-1 pl-0 cursor-move"><Bars2Icon class="size-6 text-blue-500" /></div>
    <div class="p-1" @click="triggerComplete(props.id)">
      <input type="checkbox" :value="props.completed" />
    </div>
    <div class="p-1 flex-auto" :class="{ [strikeThroughClass]: props.completed }">
      {{ props.title }}
    </div>
    <div class="flex p-1">
      <div>
        <div
          @click="triggerEdit(props.id)"
          class="border border-gray-300 rounded-sm cursor-pointer w-6 h-6 flex items-center justify-center"
        >
          <PencilSquareIcon class="size-4 text-blue-500" />
        </div>
      </div>
      <div class="ml-2">
        <div
          @click="triggerDelete(props.id)"
          class="border border-gray-300 rounded-sm cursor-pointer w-6 h-6 flex items-center justify-center"
        >
          <TrashIcon class="size-4 text-blue-500" />
        </div>
      </div>
    </div>
  </div>
</template>
