<template>
  <div ref="draggable">
    <div class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit shadow-2xl">
      <h1 class="text-2xl font-bold px-5 cursor-pointer">Student</h1>
      <div class="w-full h-px bg-slate-300 rounded-2xl pointer-events-none"></div>
      <div class="flex justify-start items-start flex-col px-2 py-2 gap-2">
        <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
        <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">fname: string</h2>
        <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100 ">lname: string</h2>
        <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
        <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : string[]</h2>
        <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import PointerUtils from '../lib/pointerUtils';
import { Draggable } from "../lib/draggable";
import { Link } from "../lib/link";
const draggable = ref(null);
let taptap;


PointerUtils.hook();
PointerUtils.doublePrevent = true;
PointerUtils.doubleClickCb = (e) => {
  Link.initiateLink(e, {
    stroke: '#f1f1f1',
    strokeWidth: 2,
  });
};

onMounted(() => {
  taptap = new Draggable(draggable.value, {
    easeTime: 0.06,
    grid: 1,
  });
});

</script>
