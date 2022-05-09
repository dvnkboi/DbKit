<template>
  <div ref="draggable" class="absolute left-0 transition-opacity duration-500">
    <div :class="{ 'ring-blue-500': getSelection === entity.id, 'ring-transparent': getSelection != entity.id }"
      class="entity rounded-3xl bg-grayish-800 flex justify-start items-start flex-col pt-2 pb-2 w-fit min-w-[16rem] shadow-2xl relative transition duration-300 text-grayish-200 ring-2">
      <!-- <div class="absolute top-2 right-2 text-xs">entity</div> -->
      <h1 :class="{ 'bg-grayish-700 w-10 h-[1rem] max-h-[1rem]': entity.name == '' }"
        class="text-2xl font-bold mx-5 cursor-pointer transition-all duration-300 rounded-md w-fit h-8">
        {{
            entity.name
        }}</h1>
      <div
        class="property flex justify-start items-start flex-col px-2 py-2 w-full transition duration-300 -mt-2 pointer-events-none">
        <transition-group name="fade-height" appear>
          <div :key="prop.name" v-for="prop in entity.properties"
            class="prop-info flex justify-start items-start gap-1 bg-grayish-700 shadow-lg rounded-lg w-full mt-2 py-0.5 px-2 h-8 transition-all duration-300 transform pr-12 overflow-hidden  pointer-events-auto">
            <h2 class="text-base">{{ prop.name }} : {{ prop.type }}</h2>
            <div v-show="prop.constraints[constraint] == true" :key="constraint"
              v-for="constraint in Object.keys(prop.constraints)" :class="[constraintColors[constraint]]"
              class="constraint text-[0.6rem] pb-px px-0.5 rounded-[0.25rem] text-white transition duration-300">{{
                  constraint
              }}</div>
            <div
              class="constraint absolute right-1 top-0 bottom-0 flex justify-center items-center text-xs text-grayish-50 font-semibold transition duration-300">
              <div v-if="prop.name != '_id'" @click="removeProp(prop.name)"
                class="bg-red-500 rounded-md flex justify-center items-center w-5 h-5 transition duration-300 group hover:-translate-y-px cursor-pointer">
                <i class="ri-close-line -mr-px font-normal group-hover:-translate-y-px transition duration-300"></i>
              </div>
            </div>
          </div>
        </transition-group>

        <div @click.stop.prevent="pushProperty"
          class="button flex justify-center items-center gap-1 mt-2 bg-blue-800 shadow-lg rounded-lg h-7 px-2 w-full font-semibold cursor-pointer group transform hover:-translate-y-0.5 transition duration-300  pointer-events-auto">
          <h2 class="group-hover:-translate-y-0.5 transform transition-transform duration-300">
            add property
          </h2>
          <i class="ri-add-fill group-hover:-translate-y-0.5 transform transition-transform duration-300"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Draggable } from "../lib/draggable";
import PointerUtils from '../lib/pointerUtils';
import { useEntities } from '../store/useEntities';
const entityStore = useEntities();


const draggable = ref(null);
const taptap = ref<Draggable>(null);
const constraintColors = {
  primary: 'bg-green-600',
  index: 'bg-purple-600',
  unique: 'bg-blue-600',
  required: 'bg-red-600',
  selectable: 'bg-pink-600'
};


interface Props {
  event?: MouseEvent;
  index?: number;
  id?: string | number;
}

const emit = defineEmits(['initialized', 'linked', 'destroyed']);
const props = withDefaults(defineProps<Props>(), {
  event: () => new PointerEvent('null', {
    clientX: 0,
    clientY: 0
  }),
  index: 0
});

const { getSelection } = storeToRefs(entityStore);
const entity = computed(() => entityStore.entity(props.id));

const pushProperty = () => {
  entityStore.pushProp(props.id, {
    name: 'prop_' + entity.value.properties.length,
    type: 'String'
  });
};

const removeProp = (key: string | number) => {
  entity.value.properties = entity.value.properties.filter(prop => prop.name !== key);
};

watch(entity, (newEntity) => {
  for (const val of entity.value.relations) {
    const linkMap = taptap.value.links.get(taptap.value.generateLinkId(val.entity));
    if (taptap.value.id != linkMap.link.end.id) {
      linkMap.link.setStartText({
        text: val.type
      });
    }
    else {
      linkMap.link.setEndText({
        text: val.type
      });
    }

    linkMap.link.setMidText({
      text: val.name
    });
  }
}, {
  deep: true,
  flush: 'post',
  immediate: false
});

onMounted(() => {
  const parent = PointerUtils.getScrollableParent(draggable.value);
  taptap.value = new Draggable(draggable.value, {
    easeTime: 0.1,
    grid: 1,
    // handle: 'h1',
    initialCoords: { x: props.event.clientX + parent.scrollLeft, y: props.event.clientY + parent.scrollTop },
    maxX: 10000,
    maxY: 10000,
    id: props.id,
  });

  taptap.value.on('down', () => {
    entityStore.selectEntity(entity.value.id);
  });

  taptap.value.once('initialized', async () => {
    await taptap.value.moveTo(taptap.value.elementCoords.x + Math.random() * 100, taptap.value.elementCoords.y + Math.random() * 100, 0.04);
    emit('initialized', taptap.value, props.index);
  });

  taptap.value.on('linked', (to: Draggable) => {
    emit('linked', taptap.value, props.index);
    entityStore.pushRelation(entity.value.id, {
      entity: to.id,
      type: 'one'
    });
  });

  taptap.value.once('destroy', () => {
    emit('destroyed', taptap.value, props.index);
    console.log(props.index);
  });

  onBeforeUnmount(() => {
    taptap.value.destroy();
  });
});

</script>

<style>
.taptap-down .entity {
  @apply scale-95;
}

.taptap-dragging .entity {
  @apply scale-75;
}

.taptap-dragging .property {
  @apply scale-90;
}

.taptap-dragging .prop-info {
  @apply text-transparent;
}

.taptap-dragging .constraint {
  @apply scale-90 opacity-0;
}

.taptap-dragging .button {
  @apply text-transparent;
}

.fade-up-enter-from,
.fade-up-enter-to {
  opacity: 0;
  transform: translateY(15px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-height-enter-from,
.fade-height-enter-to {
  height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
  width: 100%;
}

.fade-height-leave-active {
  height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.fade-height-enter-active .prop-info {
  @apply mt-2 py-0.5 px-2 h-8;
}
</style>
