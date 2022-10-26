/**
 * @description A subset of the full AWS request context.
 */
export type AwsRequestContext = {
  accountId: string;
  /**
   * @description Maps to `resource`.
   */
  resourcePath: string;
  /**
   * @description Maps to `correlationId`.
   */
  requestId: string;
  requestTimeEpoch: number;
  /**
   * @description Maps to `lifecycleStage`.
   */
  stage: string;
};
