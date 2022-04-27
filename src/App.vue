<template>
  <router-view></router-view>
</template>

<script lang="ts">

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body,
html,
#app {
  @apply bg-gray-900;
}

* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
  -webkit-focus-ring-color: rgba(255, 255, 255, 0) !important;
  outline: none !important;
}
</style>
