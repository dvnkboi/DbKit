<template>
  <transition name="fade" appear mode="out-in">
    <div v-if="entity"
      class="flex justify-start items-start flex-col w-full text-grayish-200 gap-4 px-4 py-2 transition-opacity duration-300 overflow-auto h-screen pb-6">
      <h1 class="text-2xl font-bold flex-shrink-0">Entity</h1>
      <div
        class="flex justify-start items-start flex-col gap-1 w-full overflow-hidden bg-grayish-700 bg-opacity-50 px-2 py-2 flex-shrink-0 rounded-2xl">
        <h2 class="text-lg font-semibold">Name</h2>
        <input v-model="entityNameValidator" type="text" name="name" id="name" autocomplete="do-not-autofill"
          class="rounded-xl text-lg px-2 py-1 bg-grayish-600 w-full">
      </div>

      <div class="flex justify-start items-start flex-col gap-2 w-full">
        <h2 class="text-lg font-semibold">Properties</h2>
        <div class="bg-grayish-700 bg-opacity-50 gap-2 rounded-2xl w-full px-2 py-2" :key="index"
          v-for="prop, index in entity.properties">
          <h2 class="text-base font-semibold max-w-full pr-8 truncate">{{ prop.name }}</h2>
          <div class="flex justify-start items-start flex-col w-full relative">
            <h3 class="text-base font-semibold pt-2">Name</h3>
            <input :disabled="prop.name == '_id'" v-model="prop.name" type="text" :name="'input_' + prop.name + '_name'"
              autocomplete="do-not-autofill" :id="'input_' + prop.name + '_name'"
              class="rounded-xl text-base px-2 py-1 bg-grayish-600 w-full">
            <h3 class="text-base font-semibold pt-2">Type</h3>
            <Combobox v-model="prop.type" :disabled="prop.name == '_id'">
              <ComboboxInput @change="typeQuery = $event.target.value" autocomplete="do-not-autofill"
                class="rounded-xl text-base font-normal px-2 py-1 bg-grayish-600 w-full"
                :name="'input_' + prop.name + '_type'" :id="'input_' + prop.name + '_type'"
                :disabled="prop.name == '_id'" />
              <ComboboxOptions
                class="bg-grayish-700 shadow-xl rounded-xl w-full p-2 flex justify-center items-center flex-col absolute top-36 z-50">
                <transition-group name="fade-height" appear mode="in-out">
                  <div v-if="filteredTypes.length === 0" class="relative cursor-default select-none py-2 px-4">
                    Not a valid type
                  </div>
                  <ComboboxOption v-for="propType in filteredTypes" :key="propType" :value="propType"
                    :disabled="propType == 'objectId'" v-slot="{ selected, active, disabled }" :as="'template'">
                    <div
                      :class="{ 'bg-blue-600': selected, 'bg-grayish-600': !selected, 'ring-blue-600': active, 'ring-transparent': !active, 'opacity-50 cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
                      class="comboBoxOption h-8 w-full px-2 py-1 rounded-lg transition-all duration-300 mt-2 font-semibold text-base ring-2">
                      {{ propType }}
                    </div>
                  </ComboboxOption>
                </transition-group>
              </ComboboxOptions>
            </Combobox>
            <div class="flex justify-center items-center flex-row gap-x-4 gap-y-2 flex-wrap px-4 pt-2">
              <div :key="constraint"
                v-for="constraint in Object.keys(prop.constraints).filter((e) => prop.name != '_id' && e != 'primary')"
                class="flex justify-center items-center flex-col gap-x-1 w-16 h-14 bg-grayish-700 rounded-xl">
                <Switch v-model="prop.constraints[constraint]"
                  :class="prop.constraints[constraint] ? 'bg-blue-600 bg-opacity-90' : 'bg-gray-900 bg-opacity-50'"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition duration-300 shrink-0">
                  <span :class="prop.constraints[constraint] ? 'translate-x-5' : 'translate-x-1'"
                    class="inline-block h-3 w-3 transform transition duration-150 rounded-full bg-grayish-50" />
                </Switch>
                <span class="text-xs font-normal"> {{ constraint }}</span>
              </div>
            </div>
          </div>
        </div>
        <div @click.stop.prevent="pushProperty(entity.id)"
          class="button flex justify-center items-center gap-1 bg-blue-800 shadow-lg text-sm rounded-lg h-9 px-2 w-full font-semibold cursor-pointer group transform hover:-translate-y-0.5 transition duration-300  pointer-events-auto">
          <h2 class="group-hover:-translate-y-0.5 transform transition-transform duration-300">
            add property
          </h2>
          <i class="ri-add-fill group-hover:-translate-y-0.5 transform transition-transform duration-300"></i>
        </div>
      </div>
      <div class="flex justify-start items-start flex-col gap-1 w-full">
        <h2 class="text-lg font-semibold">Relations</h2>
        <div class="flex justify-start items-center flex-col w-full gap-2">
          <div></div>
          <div :key="relation.entity" v-for="relation in entity.relations"
            class="flex justify-between items-center px-2 py-1 bg-grayish-700 rounded-xl w-full gap-2 text-base">
            <h2 class="w-4/12 text-center truncate font-semibold">{{ entityById(relation.entity).name }}</h2>
            <input v-model="relation.name" type="text" :name="'input_' + relation.name + '_name'"
              autocomplete="do-not-autofill" :id="'input_' + relation.name + '_name'"
              class="rounded-xl text-base px-2 py-1 font-semibold bg-grayish-600 w-4/12">
            <div class="flex justify-start items-center w-4/12 flex-col relative text-base">
              <Combobox v-model="relation.type">
                <ComboboxInput @change="relationQuery = $event.target.value" autocomplete="do-not-autofill"
                  class="rounded-xl text-base px-2 py-1 font-semibold bg-grayish-600 w-full"
                  :name="'input_' + relation.name + '_type'" :id="'input_' + relation.name + '_type'" />
                <ComboboxOptions
                  class="bg-grayish-700 shadow-xl rounded-xl w-full p-2 flex justify-center items-center flex-col absolute -top-28">
                  <transition-group name="fade-height" appear mode="in-out">
                    <div v-if="filteredRelations.length === 0"
                      class="relative cursor-default select-none py-2 px-4 text-base">
                      Not found
                    </div>
                    <ComboboxOption v-for="relation in filteredRelations" :key="relation" :value="relation"
                      v-slot="{ selected, active, disabled }" :as="'template'">
                      <div
                        :class="{ 'bg-blue-600': selected, 'bg-grayish-600': !selected, 'ring-blue-600': active, 'ring-transparent': !active, 'opacity-50 cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
                        class="comboBoxOption h-8 w-full px-2 py-1 rounded-lg transition-all duration-300 mt-2 font-semibold ring-2">
                        {{ relation }}
                      </div>
                    </ComboboxOption>
                  </transition-group>
                </ComboboxOptions>
              </Combobox>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div v-else
      class="w-full text-xl text-center px-4 py-2 text-grayish-200 flex justify-center items-center h-full transition-opacity duration-300">
      select an entity
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, computed, watch } from 'vue';
import { useEntities } from '../store/useEntities';
import { storeToRefs } from 'pinia';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Switch
} from '@headlessui/vue';


const types = ['Object'
  , 'Array'
  , 'String'
  , 'Number'
  , 'Boolean'
  , 'UUID'
  , 'ObjectId'
  , 'Binary Data'
  , 'Mixed'
  , 'Set'
  , 'Dictionary'];

// const selectedType = ref(types[0]);
const typeQuery = ref('');

const relations = ['one', 'many'];
// const selectedRelation = ref(relations[0]);
const relationQuery = ref('');

const filteredRelations = computed(() =>
  relationQuery.value === ''
    ? relations
    : relations.filter((relation) => {
      return relation.toLowerCase().includes(relationQuery.value.toLowerCase());
    })
);


const filteredTypes = computed(() =>
  typeQuery.value === ''
    ? types
    : types.filter((type) => {
      return type.toLowerCase().includes(typeQuery.value.toLowerCase());
    })
);


const entityStore = useEntities();
const { getSelection } = storeToRefs(entityStore);
const entity = computed(() => entityStore.entity(getSelection.value));
const entityById = computed(() => (id: number | string) => entityStore.entity(id));

const entityNameValidator = computed({
  get() {
    return entity.value.name;
  },
  set(value: string) {
    entity.value.name = value.replace(' ', '_');
  }
});

const pushProperty = (id: number | string) => {
  entityStore.pushProp(id, {
    name: 'prop_' + entityById.value(id).properties.length,
    type: types[0]
  });
};

</script>

<style>
.fade-height-enter-active .comboBoxOption {
  @apply mt-2 py-0.5 px-2 h-8;
}

.fade-height-max-enter-from,
.fade-height-max-enter-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
  width: 100%;
}

.fade-height-max-leave-active {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.fade-height-max-enter-active .sideProperty {
  @apply px-2 py-2 max-h-96;
}
</style>
