/**
 * @description Runtime user-provided metadata.
 */
export type MetadataConfigInput = StaticMetadata & {
  /**
   * @description Integer description of the event version.
   */
  version: number;
  /**
   * @description Does this event represent an error?
   * @default false
   */
  error?: boolean;
};

/**
 * @description Static, user-provided metadata.
 */
export type StaticMetadata = {
  /**
   * @description Which domain is this event part of?
   */
  domain: string;
  /**
   * @description Which system is this event part of?
   */
  system: string;
  /**
   * @description Which service is this event part of?
   */
  service: string;
  /**
   * @description The team that is responsible for the service that emitted this event.
   */
  team: string;
  /**
   * @description The type of event. Must be one of:
   * - `DomainEvent` for events occurring within the domain
   * - `IntegrationEvent` when crossing domain boundaries
   */
  eventType: 'DomainEvent' | 'IntegrationEvent';
  /**
   * @description Platform that hosts the solution that emitted this event.
   *
   * If the event is within the organization, it must be one of:
   * - `azure`
   * - `aws`
   * - `gcp` (Google Cloud)
   */
  hostPlatform: string;
  /**
   * @description Owner of the host platform.
   */
  owner: string;
  /**
   * @description What is the overall jurisdiction (legal region) for this service?
   *
   * **Must be one of:**
   * - `eu` (European Union)
   * - `us` (USA or North America generally)
   * - `cn` (China)
   * - `apj` (Asia generally, minus China)
   */
  jurisdiction: Jurisdiction;
  /**
   * @description Additional optional tags and metadata.
   */
  tags?: string[];
  /**
   * @description Data sensitivity classification.
   */
  dataSensitivity?: DataSensitivity;
};

/**
 * @description Dynamically generated metadata values.
 */
export type DynamicMetadata = {
  /**
   * @description Message ID in UUID v4 format (RFC 4122) format.
   */
  id: string;
  /**
   * @description ID in UUID v4 format (RFC 4122) of the correlated call chain.
   */
  correlationId: string;
  /**
   * @description Current timestamp in Unix epoch time.
   */
  timestamp: string;
  /**
   * @description Current timestamp in ISO 8601 (RFC 3339) format.
   */
  timestampHuman: string;
  /**
   * @description Timestamp of first **origin request** (i.e. first-called function behind API Gateway) in Unix epoch time.
   *
   * This will be generated in `event.requestContext.requestTimeEpoch` in AWS Gateway.
   *
   * It must then be passed on in further calls by way of a header or similar, same as `correlationId`.
   */
  requestTimeEpoch: number;
  /**
   * @description Which lifecycle stage the event pertains to.
   */
  lifecycleStage: string;
  /**
   * @description HTTP route, resource name or similar. Use this to detail more exactly where this event was sent.
   */
  resource: string;
  /**
   * @description The account identifier that was used, for example `123412341234` if using the common AWS account pattern.
   */
  accountId: string;
  /**
   * @description Which cloud region is this event emitted from?
   */
  region: string;
  /**
   * @description Which runtime was used?
   */
  runtime: string;
  /**
   * @description The name of the function that ran.
   */
  functionName: string;
  /**
   * @description The amount of RAM allocated to the function.
   */
  functionMemorySize: string;
  /**
   * @description The version of the function.
   */
  functionVersion: string;
  /**
   * @description User ID or similar.
   *
   * May be Cognito ID, email, user identifier, or anything similar.
   */
  user?: string;
};

/**
 * @description The combined, grand total metadata object.
 */
export type Metadata = MetadataConfigInput &
  DynamicMetadata & {
    /**
     * @description Name of the event.
     */
    eventName: string;
  };

/**
 * @description Valid data sensitivity levels.
 */
type DataSensitivity = 'public' | 'sensitive' | 'proprietary' | 'secret';

/**
 * @description The overall jurisdiction (legal region) for this service.
 */
type Jurisdiction = 'eu' | 'us' | 'cn' | 'apj';
