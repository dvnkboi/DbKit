<template>
  <div class="w-full h-screen overflow-hidden">
    <entity />
    <entity />
    <rightClickVue />
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import rightClickVue from '../components/rightClick.vue';
import Entity from '../components/entity.vue';


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
