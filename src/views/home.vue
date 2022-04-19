<template>
  <div ref='draggable' class='rounded-3xl bg-gray-100 shadow-2xl w-fit'>
    hello
  </div>
  <div id="draggable2"
    class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit">
    <h1 class="text-2xl font-bold px-5">Student</h1>
    <div class="w-full h-px bg-slate-300 rounded-2xl"></div>
    <div class="flex justify-start items-start flex-col px-2 py-2 gap-2">
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">fname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">lname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : [string]</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
    </div>
  </div>
  <div id="draggable3"
    class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit">
    <h1 class="text-2xl font-bold px-5">Student</h1>
    <div class="w-full h-px bg-slate-300 rounded-2xl"></div>
    <div class="flex justify-start items-start flex-col px-2 py-2 gap-2">
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">fname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">lname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : [string]</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
    </div>
  </div>
  <div id="draggable4"
    class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit">
    <h1 class="text-2xl font-bold px-5">Student</h1>
    <div class="w-full h-px bg-slate-300 rounded-2xl"></div>
    <div class="flex justify-start items-start flex-col px-2 py-2 gap-2">
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">fname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">lname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : [string]</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
    </div>
  </div>
  <div id="draggable5"
    class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit">
    <h1 class="text-2xl font-bold px-5">Student</h1>
    <div class="w-full h-px bg-slate-300 rounded-2xl"></div>
    <div class="flex justify-start items-start flex-col px-2 py-2 gap-2">
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">fname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">lname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : [string]</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
    </div>
  </div>
  <div id="draggable6"
    class="rounded-3xl bg-gray-100 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-fit">
    <h1 class="text-2xl font-bold px-5">Studwadadent</h1>
    <div class="w-full h-px bg-slate-300 rounded-2xl"></div>
    <div class="flex justify-start items-start flex-col px-2 py-2 gap-2">
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-red-100">_id : mongoDefault, primary, index</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">fname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">lname : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-blue-100">address : string</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-purple-100">address : [string]</h2>
      <h2 class="shadow-lg rounded-lg py-0.5 px-2 w-full bg-yellow-100">created : number</h2>
    </div>
  </div>

</template>

<script lang='ts'>
import Draggable from '../lib/draggable';
export default {
  data() {
    return {

    };
  },
  methods: {

  },
  mounted() {
    const draggable = new Draggable(this.$refs.draggable, {
      ease: true
    });

    const draggable2 = new Draggable('#draggable2', {
      ease: true
    });
    const draggable6 = new Draggable('#draggable6', {
      ease: true
    });
  }
};
</script>


<style>
.transformer-elmnt {
  @apply transform transition-all duration-300;
}

.mirror-down .transformer-elmnt {
  @apply scale-95 shadow-xl;
}

.mirror-dragging .transformer-elmnt {
  @apply scale-75 shadow-lg;
}

.mirror-up .transformer-elmnt {
  @apply scale-100 shadow-2xl;
}

.draggable-elmnt {
  opacity: 0;
}
</style>