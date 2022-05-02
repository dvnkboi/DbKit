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

/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: none;
  scrollbar-color: rgb(61 66 72) rgb(5 5 6);
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  @apply bg-grayish-900;
}

*::-webkit-scrollbar-thumb {
  @apply bg-grayish-700;
  border-radius: 20px;
  border: 0px solid #ffffff00;
}

::-webkit-scrollbar-corner {
  @apply bg-grayish-900;
}

*:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
