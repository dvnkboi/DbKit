<template>
  <div ref="rightClick" class="absolute top-0 left-0 pointer-events-none">
    <transition name="fade-up" appear>
      <div v-if="contextMenuOpen"
        class="rounded-xl bg-gray-50 shadow-2xl w-max p-2 transition duration-100 flex justify-start items-center flex-col gap-2 font-semibold text-sm">
        <div class="px-4 py-1 bg-blue-100 shadow-xl rounded-lg w-full pointer-events-auto">Add entity + </div>
        <div class="px-4 py-1 bg-gray-100 shadow-xl rounded-lg w-full pointer-events-auto">Save</div>
        <div class="px-4 py-1 bg-gray-100 shadow-xl rounded-lg w-full pointer-events-auto">Export as code</div>
      </div>
    </transition>
  </div>
</template>

<script setup lang='ts'>
import { ref, nextTick } from 'vue';
import PointerUtils from '../lib/pointerUtils';

const contextMenuOpen = ref(false);
const rightClick = ref(null);

PointerUtils.hook();
PointerUtils.contextMenuPrevent = true;
PointerUtils.upPrevent = true;

PointerUtils.contextMenuCb = (e) => {
  contextMenuOpen.value = true;
  nextTick(() => {
    rightClick.value.style.left = PointerUtils.clamp(e.pageX, 0, window.innerWidth - rightClick.value.getBoundingClientRect().width) + 'px';
    rightClick.value.style.top = PointerUtils.clamp(e.pageY, 0, window.innerHeight - rightClick.value.getBoundingClientRect().height) + 'px';
  });
};

PointerUtils.longPressCb = (e) => {
  if (PointerUtils.isTouch) {
    contextMenuOpen.value = true;
    nextTick(() => {
      rightClick.value.style.left = PointerUtils.clamp(e.pageX, 0, window.innerWidth - rightClick.value.getBoundingClientRect().width) + 'px';
      rightClick.value.style.top = PointerUtils.clamp(e.pageY, 0, window.innerHeight - rightClick.value.getBoundingClientRect().height) + 'px';
    });
  }
};

PointerUtils.downCb = (e: PointerEvent) => {
  !PointerUtils.currentPath.includes(rightClick.value) && (contextMenuOpen.value = false);
};


</script>
