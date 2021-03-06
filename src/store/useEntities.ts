import { defineStore } from 'pinia';

interface Property {
  name: string;
  type: string;
  constraints?: {
    [prop in keyof Constraint]?: boolean
  };
}

interface Relation {
  name?: string;
  entity: string;
  type: 'one' | 'many';
}

interface Constraint {
  primary: 1;
  // index: 1;
  unique: 1;
  required: 1;
  selectable: 1;
}

interface EntityOptions {
  id?: string;
  name?: string;
  properties?: Property[];
  relations?: Relation[];
  event?: MouseEvent;
}

export const useEntities = defineStore("entityStore", {
  state: () => ({
    entities: new Map<string, EntityOptions>(),
    selectedEntity: null
  }),
  getters: {
    allEntities: (state) => state.entities,
    entity: (state) => (id: any) => state.entities.get(id),
    getSelection: (state) => state.selectedEntity
  },
  actions: {
    createEntity(id: any, options: EntityOptions = {}): EntityOptions | undefined {
      const withDefaults: EntityOptions = {
        id: id,
        name: 'unnamed',
        properties: [
          {
            name: '_id',
            type: 'ObjectId',
            constraints: {
              primary: true,
              // index: true,
              unique: true,
              required: true,
              selectable: true,
            }
          }
        ],
        relations: [],
        event: undefined,
        ...options
      };
      this.entities.set(id, withDefaults);
      return this.entities.get(id);
    },
    pushProp(id: string | number, prop: Property): void {
      const entity = this.entities.get(id);
      if (entity) {
        const propIndex = entity.properties.findIndex(p => p.name === prop.name);
        if (propIndex == -1) {
          const propWithDefaults: Property = {
            type: 'String',
            constraints: {
              primary: false,
              // index: false,
              unique: false,
              required: false,
              selectable: true,
            },
            ...prop
          };
          entity.properties.push(propWithDefaults);
        }
      }
    },
    pushRelation(id: string | number, relation: Relation): void {
      const entity = this.entities.get(id);
      if (entity) {
        const propIndex = entity.relations.findIndex(r => r.entity === relation.entity);
        if (propIndex != -1) return;
        const relWithDefaults: Relation = {
          type: 'one',
          name: 'has',
          ...relation
        };
        entity.relations.push(relWithDefaults);
      }
    },
    deleteProp(id: string | number, propName: string): void {
      this.entities.get(id).properties = this.entities.get(id).properties.filter(prop => prop.name !== propName);
    },
    deleteRelation(entityFrom: string | number, entityTo: string): void {
      this.entities.get(entityFrom).relations = this.entities.get(entityFrom).relations.filter(rel => rel.entity !== entityTo);
      this.entities.get(entityTo).relations = this.entities.get(entityTo).relations.filter(rel => rel.entity !== entityFrom);
    },
    selectEntity(id): void {
      this.selectedEntity = id;
    },
    deleteEntity(id): void {
      this.entities.delete(id);
    },
    setRef(id, ref): void {
      this.entities.get(id).ref = ref;
    },
    setEvent(id, event): void {
      this.entities.get(id).event = event;
    }
  }
});
