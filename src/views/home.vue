<template>
  <transition
    name="fade-x"
    appear
  >
    <div class="w-full h-screen bg-grayish-900 text-grayish-200 overflow-hidden relative transform transition duration-300">
      <RightClick class="text-grayish-900" />
      <div class="fixed h-screen w-screen z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          class="h-full w-full scale-75 overflow-visible"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient
              id="Gradient1"
              cx="50%"
              cy="50%"
              fx="0.441602%"
              fy="50%"
              r=".5"
            >
              <stop
                offset="0%"
                stop-color="rgba(255, 0, 123, 1)"
              />
              <stop
                offset="100%"
                stop-color="rgba(255, 0, 123, 0)"
              />
            </radialGradient>
            <radialGradient
              id="Gradient2"
              cx="50%"
              cy="50%"
              fx="2.68147%"
              fy="50%"
              r=".5"
            >
              <stop
                offset="0%"
                stop-color="rgba(255, 174, 0, 1)"
              />
              <stop
                offset="100%"
                stop-color="rgba(255, 174, 0, 0)"
              />
            </radialGradient>
            <radialGradient
              id="Gradient3"
              cx="50%"
              cy="50%"
              fx="0.836536%"
              fy="50%"
              r=".5"
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="1s"
                begin="2s"
                fill="freeze"
                repeatCount="0"
              />
              <stop
                offset="0%"
                stop-color="rgba(0, 136, 255, 1)"
              />
              <stop
                offset="100%"
                stop-color="rgba(0, 136, 255, 0)"
              />
            </radialGradient>
            <radialGradient
              id="Gradient4"
              cx="50%"
              cy="50%"
              fx="4.56417%"
              fy="50%"
              r=".5"
            >
              <stop
                offset="0%"
                stop-color="rgba(0, 255, 0, 1)"
              />
              <stop
                offset="100%"
                stop-color="rgba(0, 255, 0, 0)"
              />
            </radialGradient>
            <radialGradient
              id="Gradient5"
              cx="50%"
              cy="50%"
              fx="2.65405%"
              fy="50%"
              r=".5"
            >
              <stop
                offset="0%"
                stop-color="rgba(50,0,255, 1)"
              />
              <stop
                offset="100%"
                stop-color="rgba(50,0,255, 0)"
              />
            </radialGradient>
            <radialGradient
              id="Gradient6"
              cx="50%"
              cy="50%"
              fx="0.981338%"
              fy="50%"
              r=".5"
            >
              <stop
                offset="0%"
                stop-color="rgba(255,0,0, 1)"
              />
              <stop
                offset="100%"
                stop-color="rgba(255,0,0, 0)"
              />
            </radialGradient>
          </defs>
          <rect
            x="50%"
            y="25%"
            width="50%"
            height="50%"
            fill="url(#Gradient5)"
            transform="rotate(0 50 50)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="1s"
              begin="0s"
              fill="freeze"
              repeatCount="0"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 50 50;360 50 50;0 50 50"
              dur="10s"
              keyTimes="0;0.8;1"
              repeatCount="0"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.7 1"
            />
          </rect>
          <rect
            x="50%"
            y="25%"
            width="50%"
            height="50%"
            fill="url(#Gradient6)"
            transform="rotate(72 50 50)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="1s"
              begin="1s"
              fill="freeze"
              repeatCount="0"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="72 50 50;360 50 50;72 50 50"
              dur="10s"
              keyTimes="0;0.8;1"
              repeatCount="0"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.7 1"
            />
          </rect>
          <rect
            x="50%"
            y="25%"
            width="50%"
            height="50%"
            fill="url(#Gradient1)"
            transform="rotate(144 50 50)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="1s"
              begin="2s"
              fill="freeze"
              repeatCount="0"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="144 50 50;360 50 50;144 50 50"
              dur="10s"
              keyTimes="0;0.8;1"
              repeatCount="0"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.7 1"
            />
          </rect>
          <rect
            x="50%"
            y="25%"
            width="50%"
            height="50%"
            fill="url(#Gradient2)"
            transform="rotate(216 50 50)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="1s"
              begin="3s"
              fill="freeze"
              repeatCount="0"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="216 50 50;360 50 50;216 50 50"
              dur="10s"
              keyTimes="0;0.8;1"
              repeatCount="0"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.7 1"
            />
          </rect>
          <rect
            x="50%"
            y="25%"
            width="50%"
            height="50%"
            fill="url(#Gradient3)"
            transform="rotate(288 50 50)"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="1s"
              begin="4s"
              fill="freeze"
              repeatCount="0"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="288 50 50;360 50 50;288 50 50"
              dur="10s"
              keyTimes="0;0.8;1"
              repeatCount="0"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.7 1"
            />
          </rect>
        </svg>
      </div>
      <div class="text-4xl font-bold px-5 py-2 mix-blend-exclusion">
        Terminal Ape
      </div>
      <div class="flex justify-start items-start flex-col gap-5 pt-32 pl-32 z-50">
        <div
          ref="entityDesigner"
          class="text-9xl font-bold max-w-min mix-blend-exclusion overflow-hidden absolute"
        >
          <h1
            ref="entityText"
            class="cursor-grab opacity-0 -translate-y-4"
          >
            Your entity designer is here
          </h1>
        </div>
        <div
          ref="tryIt"
          class="text-4xl mix-blend-exclusion overflow-hidden absolute top-[44rem]"
        >
          <h2
            ref="tryItText"
            class="cursor-grab opacity-0 -translate-y-4"
          >
            Try it out now
          </h2>
        </div>
      </div>
      <router-link to="/designer">
        <div
          ref="designerLink"
          class="flex justify-start items-center px-2 py-1 bg-blue-600 rounded-xl absolute bottom-[10%] right-[10%] text-grayish-50 gap-2.5 font-semibold group hover:-translate-y-1 transform transition duration-300 opacity-0"
        >
          <h1 class="group-hover:-translate-y-0.5 transition-transform duration-300">
            Get started
          </h1>
          <i class="ri-arrow-right-line group-hover:-translate-y-0.5 transition-transform duration-300" />
        </div>
      </router-link>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick, Ref } from 'vue';
import Draggable from '../lib/draggable';
import { setIfNotExists, getWithExpiry } from '../lib/localStorage';
import RightClick from '../components/rightClick.vue';

const entityDesigner: Ref<HTMLElement> = ref(null);
const tryIt: Ref<HTMLElement> = ref(null);
const entityText: Ref<HTMLElement> = ref(null);
const tryItText: Ref<HTMLElement> = ref(null);
const designerLink: Ref<HTMLElement> = ref(null);
let taptapDesigner: Draggable = null;
let taptapTryIt: Draggable = null;


let intoTimeout = null;
let introBtnTimeout = null;

onMounted(() => {
  const animate = !getWithExpiry('introPlayed');
  setIfNotExists('introPlayed', true, 604800000);
  nextTick(() => {
    if (animate) {
      entityText.value.style.transition = 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1), transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
      tryItText.value.style.transition = 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1), transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
      designerLink.value.style.transition = 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1), transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
      designerLink.value.style.transform = 'translateY(15px)';
    }
    else {
      entityText.value.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      tryItText.value.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      designerLink.value.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      designerLink.value.style.transform = 'translateY(15px)';
    }
  });


  intoTimeout = setTimeout(() => {
    entityText.value.style.opacity = '1';
    tryItText.value.style.opacity = '1';
    entityText.value.style.transform = 'translateY(0px)';
    tryItText.value.style.transform = 'translateY(0px)';
    designerLink.value.style.opacity = '1';
    designerLink.value.style.transform = 'translateY(0px)';

    taptapDesigner = new Draggable(entityDesigner.value, {
      easeTime: 0.05,
      maxX: document.body.clientWidth,
      maxY: document.body.clientHeight,
    });
    taptapTryIt = new Draggable(tryIt.value, {
      easeTime: 0.08,
      maxX: document.body.clientWidth,
      maxY: document.body.clientHeight,
    });

    introBtnTimeout = setTimeout(() => {
      designerLink.value.style.transform = '';
      designerLink.value.style.transition = 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)';
    }, animate ? 2500 : 0);
  }, animate ? 5000 : 0);

});

onBeforeUnmount(() => {
  clearTimeout(intoTimeout);
  clearTimeout(introBtnTimeout);
  taptapDesigner?.destroy();
  taptapTryIt?.destroy();
  entityDesigner.value.remove();
  tryIt.value.remove();
});


</script>
