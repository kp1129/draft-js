/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 * @emails oncall+draft_js
 */

import type {DraftEntityMutability} from 'DraftEntityMutability';
import type {DraftEntityType} from 'DraftEntityType';

const DraftEntityInstance = require('DraftEntityInstance');

const Immutable = require('immutable');
const invariant = require('invariant');
const uuid = require('uuid');

const {OrderedMap} = Immutable;

let instances: OrderedMap<string, DraftEntityInstance> = OrderedMap();
let instanceKey: string = uuid();

/**
 * Temporary utility for generating the warnings
 */
function logWarning(oldMethodCall, newMethodCall) {
  console.warn(
    'WARNING: ' +
      oldMethodCall +
      ' will be deprecated soon!\nPlease use "' +
      newMethodCall +
      '" instead.',
  );
}

export type DraftEntityMapObject = {
  getLastCreatedEntityKey: () => string,
  create: (
    type: DraftEntityType,
    mutability: DraftEntityMutability,
    data?: Object,
  ) => string,
  add: (instance: DraftEntityInstance) => string,
  get: (key: string) => DraftEntityInstance,
  mergeData: (
    key: string,
    toMerge: {[key: string]: any, ...},
  ) => DraftEntityInstance,
  replaceData: (
    key: string,
    newData: {[key: string]: any, ...},
  ) => DraftEntityInstance,
  __loadWithEntities: (
    entities: OrderedMap<string, DraftEntityInstance>,
  ) => void,
  __getAll: () => OrderedMap<string, DraftEntityInstance>,
  __getLastCreatedEntityKey: () => string,
  __create: (
    type: DraftEntityType,
    mutability: DraftEntityMutability,
    data?: Object,
  ) => string,
  __add: (instance: DraftEntityInstance) => string,
  __get: (key: string) => DraftEntityInstance,
  __mergeData: (
    key: string,
    toMerge: {[key: string]: any, ...},
  ) => DraftEntityInstance,
  __replaceData: (
    key: string,
    newData: {[key: string]: any, ...},
  ) => DraftEntityInstance,
  ...
};

/**
 * A "document entity" is an object containing metadata associated with a
 * piece of text in a ContentBlock.
 *
 * For example, a `link` entity might include a `uri` property. When a
 * ContentBlock is rendered in the browser, text that refers to that link
 * entity may be rendered as an anchor, with the `uri` as the href value.
 *
 * In a ContentBlock, every position in the text may correspond to zero
 * or one entities. This correspondence is tracked using a key string,
 * generated via DraftEntity.create() and used to obtain entity metadata
 * via DraftEntity.get().
 */
const DraftEntity: DraftEntityMapObject = {
  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.getLastCreatedEntityKey' instead.
   * ---
   * Get the random key string from whatever entity was last created.
   * We need this to support the new API, as part of transitioning to put Entity
   * storage in contentState.
   */
  getLastCreatedEntityKey(): string {
    logWarning(
      'DraftEntity.getLastCreatedEntityKey',
      'contentState.getLastCreatedEntityKey',
    );
    return DraftEntity.__getLastCreatedEntityKey();
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.createEntity' instead.
   * ---
   * Create a DraftEntityInstance and store it for later retrieval.
   *
   * A random key string will be generated and returned. This key may
   * be used to track the entity's usage in a ContentBlock, and for
   * retrieving data about the entity at render time.
   */
  create(
    type: DraftEntityType,
    mutability: DraftEntityMutability,
    data?: Object,
  ): string {
    logWarning('DraftEntity.create', 'contentState.createEntity');
    return DraftEntity.__create(type, mutability, data);
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.addEntity' instead.
   * ---
   * Add an existing DraftEntityInstance to the DraftEntity map. This is
   * useful when restoring instances from the server.
   */
  add(instance: DraftEntityInstance): string {
    logWarning('DraftEntity.add', 'contentState.addEntity');
    return DraftEntity.__add(instance);
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.getEntity' instead.
   * ---
   * Retrieve the entity corresponding to the supplied key string.
   */
  get(key: string): DraftEntityInstance {
    logWarning('DraftEntity.get', 'contentState.getEntity');
    return DraftEntity.__get(key);
  },

  /**
   * Get all the entities in the content state.
   */
  __getAll(): OrderedMap<string, DraftEntityInstance> {
    return instances;
  },

  /**
   * Load the entity map with the given set of entities.
   */
  __loadWithEntities(entities: OrderedMap<string, DraftEntityInstance>): void {
    instances = entities;
    instanceKey = uuid();
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.mergeEntityData' instead.
   * ---
   * Entity instances are immutable. If you need to update the data for an
   * instance, this method will merge your data updates and return a new
   * instance.
   */
  mergeData(
    key: string,
    toMerge: {[key: string]: any, ...},
  ): DraftEntityInstance {
    logWarning('DraftEntity.mergeData', 'contentState.mergeEntityData');
    return DraftEntity.__mergeData(key, toMerge);
  },

  /**
   * WARNING: This method will be deprecated soon!
   * Please use 'contentState.replaceEntityData' instead.
   * ---
   * Completely replace the data for a given instance.
   */
  replaceData(
    key: string,
    newData: {[key: string]: any, ...},
  ): DraftEntityInstance {
    logWarning('DraftEntity.replaceData', 'contentState.replaceEntityData');
    return DraftEntity.__replaceData(key, newData);
  },

  // ***********************************WARNING******************************
  // --- the above public API will be deprecated in the next version of Draft!
  // The methods below this line are private - don't call them directly.

  /**
   * Get the random key string from whatever entity was last created.
   * We need this to support the new API, as part of transitioning to put Entity
   * storage in contentState.
   */
  __getLastCreatedEntityKey(): string {
    return instanceKey;
  },

  /**
   * Create a DraftEntityInstance and store it for later retrieval.
   *
   * A random key string will be generated and returned. This key may
   * be used to track the entity's usage in a ContentBlock, and for
   * retrieving data about the entity at render time.
   */
  __create(
    type: DraftEntityType,
    mutability: DraftEntityMutability,
    data?: Object,
  ): string {
    return DraftEntity.__add(
      new DraftEntityInstance({type, mutability, data: data || {}}),
    );
  },

  /**
   * Add an existing DraftEntityInstance to the DraftEntity map. This is
   * useful when restoring instances from the server.
   */
  __add(instance: DraftEntityInstance): string {
    instanceKey = uuid();
    instances = instances.set(instanceKey, instance);
    return instanceKey;
  },

  /**
   * Retrieve the entity corresponding to the supplied key string.
   */
  __get(key: string): DraftEntityInstance {
    const instance = instances.get(key);
    invariant(!!instance, 'Unknown DraftEntity key: %s.', key);
    return instance;
  },

  /**
   * Entity instances are immutable. If you need to update the data for an
   * instance, this method will merge your data updates and return a new
   * instance.
   */
  __mergeData(
    key: string,
    toMerge: {[key: string]: any, ...},
  ): DraftEntityInstance {
    const instance = DraftEntity.__get(key);
    const newData = {...instance.getData(), ...toMerge};
    const newInstance = instance.set('data', newData);
    instances = instances.set(key, newInstance);
    return newInstance;
  },

  /**
   * Completely replace the data for a given instance.
   */
  __replaceData(
    key: string,
    newData: {[key: string]: any, ...},
  ): DraftEntityInstance {
    const instance = DraftEntity.__get(key);
    const newInstance = instance.set('data', newData);
    instances = instances.set(key, newInstance);
    return newInstance;
  },
};

module.exports = DraftEntity;
