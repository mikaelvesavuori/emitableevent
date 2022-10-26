import { Metadata, MetadataConfigInput } from './Metadata';

/**
 * @description Input that is required when calling the `EmittableEvent` class.
 */
export type EmittableEventInput = {
  /**
   * @description The type of user interaction event that has occurred.
   */
  eventName: string;
  /**
   * @description The name of the EventBridge bus to use.
   */
  eventBusName: string;
  /**
   * @description An object to send in the event's `data` field.
   */
  data: Data;
  /**
   * @description Metadata configuration input for the `metadata` field.
   */
  metadataConfig: MetadataConfigInput;
};

/**
 * @description Required input when producing the final EventBridge event.
 */
export type ProduceEventInput = {
  eventName: string;
  data: Data;
};

/**
 * @description Input required to create an EventBridgeEvent's `metadata` object.
 */
export type MetadataInput = {
  id: string;
  correlationId: string;
  version: number;
};

/**
 * @description Complete event input used before `EventCatalog`
 * adds dynamically produced metadata (and any other changes).
 */
export type EventDTO = {
  /**
   * @description The EventBridge bus to publish to.
   */
  eventBusName: string;
  /**
   * @description The EventBridge detail type that this event represents.
   */
  detailType: string;
  /**
   * @description The name of the event.
   */
  eventName: string;
  /**
   * @description Metadata for the event DTO.
   */
  metadata: Metadata;
  /**
   * @description Data for the event.
   */
  data: Data;
};

/**
 * @description The shape of an input into EventBridge.
 */
export type EventBridgeEvent = {
  /**
   * @description Name of the EventBridge bus.
   */
  EventBusName: string;
  /**
   * @description Source of the event.
   */
  Source: string;
  /**
   * @description The type of event.
   */
  DetailType: string;
  /**
   * @description Input data as string.
   */
  Detail: string;
};

/**
 * @description Events must include data as well as metadata.
 */
export type EventDetail = {
  /**
   * @description Metadata for the event.
   */
  metadata: Metadata;
  /**
   * @description Data for the event.
   */
  data: Data;
};

/**
 * @description Event data can be either an object or a string.
 */
type Data = Record<string, any> | string;
