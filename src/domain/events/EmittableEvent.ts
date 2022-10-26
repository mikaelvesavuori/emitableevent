import { randomUUID } from 'crypto';

import {
  EventDetail,
  EventBridgeEvent,
  ProduceEventInput,
  EmittableEventInput
} from '../../interfaces/Event';
import { Metadata, MetadataConfigInput } from '../../interfaces/Metadata';
import { AwsRequestContext } from '../../interfaces/Request';

/**
 * @description Vend a complete EventBridge-compatible event.
 *
 * @example
 * import { EmittableEvent } from 'emittableevent';
 *
 * class MyEvent extends EmittableEvent {
 *   // Do something here if you want, else just leave it as is!
 * }
 *
 * const event = new MyEvent(eventInput, awsRequestContext);
 */
export abstract class EmittableEvent {
  private readonly event: EventBridgeEvent;
  private readonly eventBusName: string;
  private readonly metadataConfig: MetadataConfigInput;
  private readonly awsRequestContext: AwsRequestContext;

  constructor(eventInput: EmittableEventInput, awsRequestContext: AwsRequestContext) {
    if (
      !eventInput.eventName ||
      !eventInput.eventBusName ||
      !eventInput.data ||
      !eventInput.metadataConfig ||
      !awsRequestContext
    )
      throw new MissingRequiredInputsError();

    const { eventName, eventBusName, data, metadataConfig } = eventInput;

    this.eventBusName = eventBusName;
    this.metadataConfig = metadataConfig;
    this.awsRequestContext = awsRequestContext;

    this.event = this.produceEvent({
      eventName,
      data
    });
  }

  /**
   * @description Produce a ready-to use EventBridge-compatible event shape.
   */
  private produceEvent(input: ProduceEventInput) {
    const { eventName, data } = input;
    const detailType = eventName;
    const metadata = this.produceMetadata(eventName);
    const source = `${metadata.domain.toLowerCase()}.${metadata.system.toLowerCase()}.${detailType.toLowerCase()}`;

    const detail: EventDetail = {
      metadata,
      data
    };

    return {
      EventBusName: this.eventBusName,
      Source: source,
      DetailType: detailType,
      Detail: JSON.stringify(detail)
    };
  }

  /**
   * @description Produce correct metadata format for the event.
   * @note The verbose format is used as we cannot make assumptions
   * on users actually passing in fully formed data.
   */
  private produceMetadata(eventName: string): Metadata {
    const metadata = this.metadataConfig;
    const requestContext = this.awsRequestContext;

    this.validateMetadata(metadata);
    this.validateRequestContext(requestContext);

    const timeNow = Date.now();

    return {
      ...this.metadataConfig,
      eventName,
      timestamp: `${timeNow}`,
      timestampHuman: new Date(timeNow).toISOString(),
      requestTimeEpoch: requestContext.requestTimeEpoch,
      version: metadata.version,
      id: randomUUID().toString(),
      correlationId: requestContext.requestId,
      resource: requestContext.resourcePath,
      accountId: requestContext.accountId,
      runtime: process.env.AWS_EXECUTION_ENV || '',
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME || '',
      functionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || '',
      functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION || '',
      lifecycleStage: requestContext.stage as any,
      domain: metadata.domain,
      system: metadata.system,
      service: metadata.service,
      team: metadata.team,
      hostPlatform: metadata.hostPlatform,
      owner: metadata.owner,
      region: process.env.AWS_REGION || '',
      jurisdiction: metadata.jurisdiction,
      tags: metadata.tags,
      dataSensitivity: metadata.dataSensitivity
    };
  }

  private validateMetadata(metadata: MetadataConfigInput) {
    if (
      !metadata.version ||
      !metadata.domain ||
      !metadata.system ||
      !metadata.service ||
      !metadata.team
    )
      throw new MissingMetadataFieldsError();
  }

  private validateRequestContext(requestContext: AwsRequestContext) {
    if (
      !requestContext.accountId ||
      !requestContext.resourcePath ||
      !requestContext.requestId ||
      !requestContext.requestTimeEpoch ||
      !requestContext.stage
    )
      throw new MissingRequestContextFieldsError();
  }

  /**
   * @description Get full, EventBridge-compatible payload.
   */
  public get() {
    return this.event;
  }
}

/**
 * @description Used when missing required inputs when calling `EmittableEvent`.
 */
class MissingRequiredInputsError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequiredInputsError';
    const message = `Missing required fields to create the event!`;
    this.message = message;

    console.error(message);
  }
}

/**
 * @description Used when missing required metadata fields.
 */
class MissingMetadataFieldsError extends Error {
  constructor() {
    super();
    this.name = 'MissingMetadataFieldsError';
    const message = `Missing required fields to produce metadata!`;
    this.message = message;

    console.error(message);
  }
}

/**
 * @description Used when missing required AWS request context fields.
 */
class MissingRequestContextFieldsError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequestContextFieldsError';
    const message = `Missing required AWS request context fields to produce metadata!`;
    this.message = message;

    console.error(message);
  }
}
