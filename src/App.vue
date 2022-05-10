<template>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;


body,
html,
#app {
  @apply bg-grayish-900 overflow-hidden;
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


.fade-x-enter-from{
  @apply opacity-0 translate-x-5;
}

.fade-x-leave-to{
  @apply opacity-0 -translate-x-5;
}

</style>
