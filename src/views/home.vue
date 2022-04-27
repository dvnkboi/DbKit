<template>
  <div class="w-full h-screen">
    <div ref='draggable' class='rounded-3xl bg-gray-100 shadow-2xl w-fit'>
      hello
    </div>
    <div ref="draggable2" id="draggable2">
      <div class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit shadow-2xl">
        <h1 class="text-2xl font-bold px-5 cursor-pointer">Student</h1>
        <div class="w-full h-px bg-slate-300 rounded-2xl pointer-events-none"></div>
        <div class="flex justify-start items-start flex-col px-2 py-2 gap-2 pointer-events-none">
          <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
          <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">{{ position }}</h2>
          <h2 @click="sayHi()"
            class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100 cursor-pointer pointer-events-auto">lname :
            string
          </h2>
          <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
          <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : string[]</h2>
          <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
        </div>
      </div>
    </div>
    <div ref="testBox" class="absolute w-40 h-40 bg-red-400 top-2/3 left-0"></div>
  </div>
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
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { Draggable } from "../lib/draggable";
import PointerUtils from '../lib/PointerUtils';


const draggable = ref(null);
const draggable2 = ref(null);
const testBox = ref(null);
const position = ref({ x: 0, y: 0 });
const rightClick = ref(null);
const contextMenuOpen = ref(false);

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

onMounted(() => {
  const taptap1 = new Draggable(draggable.value, {});
  const taptap2 = new Draggable(draggable2.value, {
    handle: 'h1',
    easeTime: 0.08,
    dropEl: testBox.value,
    grid: 1,
  });
  const taptap3 = new Draggable(testBox.value, {
    holdTime: 10,
  });

  taptap2.attachTo(taptap3, {
    curve: 0.5,
    stroke: '#f1f1f1',
    strokeWidth: 1,
    opacity: 1,
    linkStartText: {
      text: '0,n',
      fontColor: '#f1f1f1',
    },
    linkEndText: {
      text: '0,1',
      fontColor: '#f1f1f1',
    },
    linkMidText: {
      text: 'has',
      fontColor: '#f1f1f1',
    },
  });

  taptap2.link.on('startClick', () => {
    taptap2.link.setStartText({
      text: taptap2.link.startText == '0,1' ? '0,n' : '0,1'
    });
  });

  taptap2.link.on('endClick', () => {
    taptap2.link.setEndText({
      text: taptap2.link.endText == '0,1' ? '0,n' : '0,1'
    });
  });

  taptap2.link.on('midClick', () => {
    console.log('midClick');
  });

  onBeforeUnmount(() => {
    taptap1.destroy();
    taptap2.destroy();
    taptap3.destroy();
    PointerUtils.destroy();
  });
});


function sayHi() {
  console.log('hi');
}
</script>


<style>
.transformer-elmnt {
  @apply transform transition duration-300 ring-4 ring-offset-2 ring-transparent ring-offset-transparent;
}

.taptap-elmnt div {
  @apply origin-top transform transition duration-300;
}

.taptap-hold>div {
  @apply ring-red-500 shadow-xl;
}

.taptap-down>div {
  @apply ring-transparent scale-95 shadow-xl;
}

.taptap-dragging>div {
  @apply scale-75 shadow-lg;
}

.taptap-dragging>div div {
  @apply scale-y-90 text-transparent;
}

.taptap-up>div {
  @apply scale-100 shadow-2xl;
}

.fade-up-enter-from,
.fade-up-enter-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>