<template>
  <transition
    name="fade"
    appear
    mode="out-in"
  >
    <div
      v-if="entity"
      class="flex justify-start items-start flex-col w-full text-grayish-200 gap-4 px-4 py-2 transition-opacity duration-300 overflow-auto h-screen pb-6"
    >
      <h1 class="text-2xl font-bold flex-shrink-0">
        Entity
      </h1>
      <div
        class="flex justify-start items-start flex-col gap-1 w-full overflow-hidden bg-grayish-700 bg-opacity-50 px-2 py-2 flex-shrink-0 rounded-2xl"
      >
        <h2 class="text-lg font-semibold">
          Name
        </h2>
        <input
          id="name"
          v-model="entityNameValidator"
          type="text"
          name="name"
          autocomplete="do-not-autofill"
          class="rounded-xl text-lg px-2 py-1 bg-grayish-600 w-full"
        >
      </div>

      <div class="flex justify-start items-start flex-col gap-2 w-full">
        <h2 class="text-lg font-semibold">
          Properties
        </h2>
        <!-- each property -->
        <div
          v-for="prop, index in entity.properties"
          :key="index"
          class="bg-grayish-700 bg-opacity-50 gap-2 rounded-2xl w-full px-2 py-2 relative"
        >
          <div
            class="constraint absolute right-2 top-2 flex justify-center items-center text-xs text-grayish-50 font-semibold transition duration-300"
          >
            <div
              v-if="prop.name != '_id'"
              class="bg-red-500 rounded-md flex justify-center items-center w-6 h-6 transition duration-300 group hover:-translate-y-px cursor-pointer"
              @click="removeProp(prop.name)"
            >
              <i class="ri-close-line text-base font-normal group-hover:-translate-y-px transition duration-300" />
            </div>
          </div>
          <h2 class="text-base font-semibold max-w-full pr-8 truncate">
            {{ prop.name }}
          </h2>
          <div class="flex justify-start items-start flex-col w-full relative">
            <h3 class="text-base font-semibold pt-2">
              Name
            </h3>
            <input
              :id="'input_' + prop.name + '_name'"
              v-model="prop.name"
              :disabled="prop.name == '_id'"
              type="text"
              :name="'input_' + prop.name + '_name'"
              autocomplete="do-not-autofill"
              class="rounded-xl text-base px-2 py-1 bg-grayish-600 w-full"
            >
            <h3 class="text-base font-semibold pt-2">
              Type
            </h3>
            <Combobox
              v-model="prop.type"
              :disabled="prop.name == '_id'"
            >
              <ComboboxInput
                :id="'input_' + prop.name + '_type'"
                autocomplete="do-not-autofill"
                class="rounded-xl text-base font-normal px-2 py-1 bg-grayish-600 w-full"
                :name="'input_' + prop.name + '_type'"
                :disabled="prop.name == '_id'"
                @change="typeQuery = $event.target.value"
              />
              <ComboboxOptions
                class="bg-grayish-700 shadow-xl rounded-xl w-full p-2 flex justify-center items-center flex-col absolute bottom-0 min-h-[3.5rem] z-50"
              >
                <transition-group
                  name="fade-height"
                  appear
                  mode="in-out"
                >
                  <div
                    v-if="filteredTypes.length === 0"
                    class="relative cursor-default select-none py-2 px-4"
                  >
                    Not a valid type
                  </div>
                  <ComboboxOption
                    v-for="propType in filteredTypes"
                    :key="propType"
                    v-slot="{ selected, active, disabled }"
                    :value="propType"
                    :disabled="propType == 'objectId'"
                    :as="'template'"
                  >
                    <div
                      :class="{ 'bg-blue-600': selected, 'bg-grayish-600': !selected, 'ring-blue-600': active, 'ring-transparent': !active, 'opacity-50 cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
                      class="comboBoxOption h-8 w-full px-2 py-1 rounded-lg transition-all duration-300 mt-2 font-semibold text-base ring-2"
                    >
                      {{ propType }}
                    </div>
                  </ComboboxOption>
                </transition-group>
              </ComboboxOptions>
            </Combobox>
            <!-- property constraints -->
            <div class="flex justify-center items-center flex-row gap-x-4 gap-y-2 flex-wrap px-4 pt-2 w-full">
              <div
                v-for="constraint in Object.keys(prop.constraints).filter((e) => prop.name != '_id' && e != 'primary' && (prop.type == 'String' || e != 'unique'))"
                :key="constraint"
                class="flex justify-center items-center flex-col gap-x-1 w-16 h-14 bg-grayish-700 rounded-xl"
              >
                <Switch
                  v-model="prop.constraints[constraint]"
                  :class="prop.constraints[constraint] ? 'bg-blue-600 bg-opacity-90' : 'bg-gray-900 bg-opacity-50'"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition duration-300 shrink-0"
                >
                  <span
                    :class="prop.constraints[constraint] ? 'translate-x-5' : 'translate-x-1'"
                    class="inline-block h-3 w-3 transform transition duration-150 rounded-full bg-grayish-50"
                  />
                </Switch>
                <span class="text-xs font-normal"> {{ constraint }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="button flex justify-center items-center gap-1 bg-blue-800 shadow-lg text-sm rounded-lg h-9 px-2 w-full font-semibold cursor-pointer group transform hover:-translate-y-0.5 transition duration-300  pointer-events-auto"
          @click.stop.prevent="pushProperty(entity.id)"
        >
          <h2 class="group-hover:-translate-y-0.5 transform transition-transform duration-300">
            add property
          </h2>
          <i class="ri-add-fill group-hover:-translate-y-0.5 transform transition-transform duration-300" />
        </div>
      </div>
      <!-- each relation -->
      <div class="flex justify-start items-start flex-col gap-1 w-full">
        <h2 class="text-lg font-semibold">
          Relations
        </h2>
        <div v-if="entity.relations.length < 1">
          <h1 class="text-sm">
            No relation from this entity
          </h1>
          <h2 class="text-xs">
            Right click and click link
          </h2>
        </div>
        <div
          v-else
          class="flex justify-start items-center flex-col w-full gap-2"
        >
          <div
            v-for="relation in entity.relations"
            :key="relation.entity"
            class="flex justify-start items-center px-2 py-1 bg-grayish-700 rounded-xl w-full gap-2 text-base flex-col relative"
          >
            <div
              class="absolute right-2 top-2 constraint w-6 h-6 flex justify-center items-center text-xs text-grayish-50 font-semibold transition duration-300"
            >
              <div
                class="bg-red-500 rounded-md flex justify-center items-center w-6 h-6 transition duration-300 group hover:-translate-y-px cursor-pointer"
                @click="removeRelation(relation.entity)"
              >
                <i class="ri-close-line text-base font-normal group-hover:-translate-y-px transition duration-300" />
              </div>
            </div>
            <div class="w-full justify-start items-center flex-row flex-nowrap">
              <h2 class="max-w-fit truncate font-semibold text-lg">
                {{ entityById(relation.entity).name }}
              </h2>
            </div>
            <div class="flex justify-start items-center gap-2">
              <input
                :id="'input_' + relation.name + '_name'"
                v-model="relation.name"
                type="text"
                :name="'input_' + relation.name + '_name'"
                autocomplete="do-not-autofill"
                class="rounded-xl text-base px-2 py-1 font-semibold bg-grayish-600 w-2/3"
              >
              <div class="flex justify-start items-center w-1/3 flex-col relative text-base">
                <Combobox v-model="relation.type">
                  <ComboboxInput
                    :id="'input_' + relation.name + '_type'"
                    autocomplete="do-not-autofill"
                    class="rounded-xl text-base px-2 py-1 font-semibold bg-grayish-600 w-full"
                    :name="'input_' + relation.name + '_type'"
                    @change="relationQuery = $event.target.value"
                  />
                  <ComboboxOptions
                    class="bg-grayish-700 shadow-xl rounded-xl w-full p-2 flex justify-center items-center flex-col absolute bottom-10"
                  >
                    <transition-group
                      name="fade-height"
                      appear
                      mode="in-out"
                    >
                      <div
                        v-if="filteredRelations.length === 0"
                        class="relative cursor-default select-none py-2 px-4 text-base"
                      >
                        Not found
                      </div>
                      <ComboboxOption
                        v-for="relation in filteredRelations"
                        :key="relation"
                        v-slot="{ selected, active, disabled }"
                        :value="relation"
                        :as="'template'"
                      >
                        <div
                          :class="{ 'bg-blue-600': selected, 'bg-grayish-600': !selected, 'ring-blue-600': active, 'ring-transparent': !active, 'opacity-50 cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
                          class="comboBoxOption h-8 w-full px-2 py-1 rounded-lg transition-all duration-300 mt-2 font-semibold ring-2 overflow-hidden"
                        >
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
    </div>
    <div
      v-else
      class="w-full text-xl text-center px-4 py-2 text-grayish-200 flex justify-center items-center h-full transition-opacity duration-300"
    >
      select an entity
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useEntities } from '../store/useEntities';
import { storeToRefs } from 'pinia';
import Draggable from '../lib/draggable';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Switch
} from '@headlessui/vue';


const types = ['Mixed', 'String', 'Number', 'Boolean', 'ObjectId', 'String Array', 'Number Array', 'Mixed Array', 'ObjectId Array', 'Buffer', 'Date'];

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

const removeProp = (key: string) => {
  entityStore.deleteProp(entity.value.id, key);
};

const removeRelation = (entityTo: string) => {
  entityStore.deleteRelation(entity.value.id, entityTo);
  Draggable.draggables.get(entity.value.id).detachFrom(Draggable.draggables.get(entityTo));
  Draggable.draggables.get(entityTo).detachFrom(Draggable.draggables.get(entity.value.id));
};


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
