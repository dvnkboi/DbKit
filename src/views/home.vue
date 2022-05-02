<template>
  <div class="flex flex-row justify-center items-center select-none">
    <div ref="playGroundContainer" class="w-full h-screen overflow-auto">
      <div ref="playGround" class="w-[10000px] h-[10000px] relative flex-none bg-grayish-900">
        <transition-group name="fade" appear>
          <entity @destroyed="deleteEntity" :index="index" :event="entity.event" :id="entity.id" :key="entity.id"
            v-for="entity, index in entities.values()" />
        </transition-group>
        <rightClick @createNew="addEntity" />
        <div class="fixed top-4 left-4 flex justify-start items-start flex-col gap-2">
          <div
            class="px-2 py-1  rounded-lg bg-gray-200 text-grayish-900 group hover:-translate-y-1 hover:bg-blue-100 transition duration-300 cursor-pointer">
            <div @click="addEntity"
              class="group-hover:-translate-y-0.5 transition-transform duration-300 flex justify-start items-center gap-1">
              <h1>Add entity</h1>
              <i class="ri-add-fill"></i>
            </div>
          </div>
          <div v-if="tooManyEntities" class="text-red-400 animate-pulse font-semibold text-base">too many entities</div>
        </div>
      </div>
    </div>
    <div class="w-80 shrink-0 h-screen bg-grayish-800">
      <sidebar />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import rightClick from '../components/rightClick.vue';
import entity from '../components/entity.vue';
import sidebar from '../components/sidebar.vue';
import Draggable from '../lib/draggable';
import { useEntities } from '../store/useEntities';
import { storeToRefs } from 'pinia';

const playGroundContainer = ref(null);
const playGround = ref(null);
const isMounted = ref(false);
const tooManyEntities = ref(false);

const entityStore = useEntities();
const { entities } = storeToRefs(entityStore);

interface Entities {
  ref: string,
  entity: Draggable,
  event: MouseEvent
}

const addEntity = (evt: MouseEvent) => {
  if (entities.value.size > 5) {
    tooManyEntities.value = true;
    setTimeout(() => {
      tooManyEntities.value = false;
    }, 5000);
  }
  else {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    entityStore.createEntity(id, {
      id: id,
      event: evt,
    });
  }
};


const deleteEntity = (entity: Draggable, index: number) => {
  entityStore.deleteEntity(entity.id);
};


//scroll playground container to middle of playground size
const scrollToMiddle = () => {
  const playgroundWidth = playGround.value.clientWidth;
  const playgroundHeight = playGround.value.clientHeight;
  playGroundContainer.value.scrollTo(playgroundWidth / 2, playgroundHeight / 2);
};

onMounted(() => {
  scrollToMiddle();
  isMounted.value = true;
});

</script>


<style>
</style>
