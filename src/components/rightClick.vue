<template>
  <div ref="rightClick" class="absolute top-0 left-0 pointer-events-none select-none z-50">
    <transition name="fade-up" appear>
      <div v-if="contextMenuOpen" ref="contextMenu"
        class="rounded-xl bg-gray-50 shadow-2xl w-max p-2 transition duration-100 flex justify-start items-center flex-col gap-2 font-semibold text-sm">
        <Menu :as="'div'">
          <MenuItems static class="flex justify-start items-center flex-col gap-2 pointer-events-auto">
            <MenuItem @click="createNew" as="div" v-slot="{ active }" class="w-full">
            <div :class="{ 'bg-blue-400': active }"
              class="option bg-blue-200 group transform transition hover:-translate-y-0.5">
              <h2 class="transform transition-transform group-hover:-translate-y-0.5">Add new</h2>
              <i class="ri-add-fill transform transition-transform group-hover:-translate-y-0.5"></i>
            </div>
            </MenuItem>
            <MenuItem v-if="isDraggable" @click="attach" as="div" v-slot="{ active }" class="w-full">
            <div :class="{ 'bg-gray-300': active }"
              class="option bg-gray-100 group transform transition hover:-translate-y-0.5">
              <h2 class="transform transition-transform group-hover:-translate-y-0.5">Link</h2>
            </div>
            </MenuItem>
            <MenuItem as="div" v-slot="{ active }" @click="exportCode" class="w-full">
            <div :class="{ 'bg-gray-300': active }"
              class="option bg-gray-100 group transform transition hover:-translate-y-0.5">
              <h2 class="transform transition-transform group-hover:-translate-y-0.5">Export as code</h2>
            </div>
            </MenuItem>
            <MenuItem v-if="isDraggable" @click="deleteEntity" as="div" v-slot="{ active }" class="w-full">
            <div :class="{ 'bg-red-400': active }"
              class="option bg-red-200 group transform transition hover:-translate-y-0.5">
              <h2 class="transform transition-transform group-hover:-translate-y-0.5">Delete entity</h2>
            </div>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </transition>
  </div>
</template>

<script setup lang='ts'>
import { Menu, MenuItems, MenuItem } from '@headlessui/vue';
import { ref, nextTick, onMounted } from 'vue';
import PointerUtils from '../lib/pointerUtils';
import Draggable from '../lib/draggable';
import Link from '../lib/link';
import { useEntities } from '../store/useEntities';
const entityStore = useEntities();


const emit = defineEmits(['link', 'createNew', 'export']);


const contextMenuOpen = ref(false);
const rightClick = ref<HTMLElement>(null);
const contextMenu = ref<HTMLElement>(null);
const isDraggable = ref(false);
const pos = { x: 0, y: 0 };
let draggable;

const pointerUtil = new PointerUtils();

const createNew = (e) => {
  contextMenuOpen.value = false;
  emit('createNew', e);
};

const exportCode = (e) => {
  contextMenuOpen.value = false;
  emit('export', e);
};

const attach = async (e) => {
  contextMenuOpen.value = false;
  const evt = await PointerUtils.changeEventCoords(e, pos);
  const link = await Link.initiateLink(evt, {
    stroke: "#f1f1f1",
    linkEndText: {
      text: 'one',
      fontColor: '#f1f1f1'
    },
    linkMidText: {
      text: 'has',
      fontColor: '#f1f1f1'
    },
    linkStartText: {
      text: 'one',
      fontColor: '#f1f1f1'
    }
  });
};

const deleteEntity = async (e) => {
  contextMenuOpen.value = false;
  const taptap = await Draggable.getDraggableFromPoint(pos);
  entityStore.deleteEntity(taptap.id);
  taptap.destroy();
};

onMounted(() => {
  const parent = PointerUtils.getScrollableParent(rightClick.value);

  pointerUtil.hook();
  pointerUtil.contextMenuPrevent = true;
  pointerUtil.upPrevent = true;

  const contextMenuCb = async (e) => {
    pos.x = PointerUtils.clamp(e.clientX, 0, parent.clientWidth);
    pos.y = PointerUtils.clamp(e.clientY, 0, parent.clientHeight);
    draggable = await Draggable.getDraggableFromPoint(pos);
    if (draggable) {
      isDraggable.value = true;
    }
    else {
      isDraggable.value = false;
      draggable = null;
    }

    contextMenuOpen.value = true;
    nextTick(() => {
      rightClick.value.style.left = PointerUtils.clamp(e.clientX + parent.scrollLeft, 0, parent.clientWidth + parent.scrollLeft - rightClick.value.getBoundingClientRect().width) + 'px';
      rightClick.value.style.top = PointerUtils.clamp(e.clientY + parent.scrollTop, 0, parent.clientHeight + parent.scrollTop - rightClick.value.getBoundingClientRect().height) + 'px';
    });
  };

  pointerUtil.contextMenuCb = (e) => {
    contextMenuCb(e);
  };

  pointerUtil.longPressCb = (e) => {
    if (pointerUtil.isTouch) {
      contextMenuCb(e);
    }
  };

  pointerUtil.downCb = (e: PointerEvent) => {
    !pointerUtil.currentPath.includes(rightClick.value) && (contextMenuOpen.value = false);
  };
});

</script>

<style>
.option {
  @apply flex justify-start items-center cursor-pointer px-4 py-1 shadow-xl rounded-lg w-full pointer-events-auto;
}
</style>
