import test from 'ava';

import { EmittableEvent } from '../src/domain/events/EmittableEvent';

import { MetadataConfigInput } from '../src/interfaces/Metadata';

import awsRequest from '../testdata/AwsRequest.json';

/**
 * SETUP AND DATA
 */
const requestContext = awsRequest.requestContext;

class CreatedEvent extends EmittableEvent {
  //
}

/**
 * @description Retrieve static or "known" metadata as a configuration
 * so we can create new events correctly.
 */
const getMetadataConfig = (version = 1): MetadataConfigInput => {
  return {
    version,
    eventType: 'DomainEvent',
    domain: 'MyDomain',
    system: 'MySystem',
    service: 'MyService',
    team: 'MyTeam',
    hostPlatform: 'aws',
    owner: 'Sam Person',
    jurisdiction: 'eu'
  };
};

const eventInput = {
  eventName: 'Created',
  eventBusName: 'MyEventBus',
  data: {
    something: 'some value here'
  },
  metadataConfig: getMetadataConfig()
};

const expected = {
  Detail:
    '{"metadata":{"version":1,"eventType":"DomainEvent","domain":"MyDomain","system":"MySystem","service":"MyService","team":"MyTeam","hostPlatform":"aws","owner":"Sam Person","jurisdiction":"eu","eventName":"Created","correlationId":"26dd1faf-a901-4413-92db-9e09b7915a3c","resource":"/","accountId":"123412341234","runtime":"","functionName":"","functionMemorySize":"","functionVersion":"","lifecycleStage":"dev","region":""},"data":{"something":"some value here"}}',
  DetailType: 'Created',
  EventBusName: 'MyEventBus',
  Source: 'mydomain.mysystem.created'
};

/**
 * POSITIVE TESTS
 */

test.serial('It should create a fully formed event from the EmittableEvent abstraction', (t) => {
  const event = new CreatedEvent(eventInput, requestContext).get();

  const detail = JSON.parse(event.Detail);
  delete detail.metadata.timestamp;
  delete detail.metadata.timestampHuman;
  delete detail.metadata.requestTimeEpoch;
  delete detail.metadata.id;

  const result = {
    ...event,
    Detail: JSON.stringify(detail)
  };

  t.deepEqual(result, expected);
});

test.serial('It should assert that an event has a timestamp value in the metadata', (t) => {
  const event = new CreatedEvent(eventInput, requestContext).get();
  const detail = JSON.parse(event.Detail);
  t.assert(detail.metadata.timestamp !== undefined);
});

test.serial('It should assert that an event has a timestampHuman value in the metadata', (t) => {
  const event = new CreatedEvent(eventInput, requestContext).get();
  const detail = JSON.parse(event.Detail);
  t.assert(detail.metadata.timestampHuman !== undefined);
});

test.serial('It should assert that an event has a requestTimeEpoch value in the metadata', (t) => {
  const event = new CreatedEvent(eventInput, requestContext).get();
  const detail = JSON.parse(event.Detail);
  t.assert(detail.metadata.requestTimeEpoch !== undefined);
});

test.serial('It should assert that an event has an ID in the metadata', (t) => {
  const event = new CreatedEvent(eventInput, requestContext).get();
  const detail = JSON.parse(event.Detail);
  t.assert(detail.metadata.id !== undefined);
});

/**
 * NEGATIVE TESTS
 */

test.serial('It should throw a MissingRequiredInputsError if missing eventInput', (t) => {
  const error: any = t.throws(() => {
    // @ts-ignore
    new CreatedEvent({}, requestContext);
  });

  t.is(error.name, 'MissingRequiredInputsError');
});

test.serial('It should throw a MissingRequiredInputsError if missing awsRequestContext', (t) => {
  const error: any = t.throws(() => {
    // @ts-ignore
    new CreatedEvent(eventInput);
  });

  t.is(error.name, 'MissingRequiredInputsError');
});

test.serial('It should throw a MissingMetadataFieldsError if missing metadata fields', (t) => {
  const error: any = t.throws(() => {
    const _metadataConfig = JSON.parse(JSON.stringify(eventInput));
    delete _metadataConfig.version;

    new CreatedEvent(
      {
        eventName: 'Created',
        eventBusName: 'MyEventBus',
        data: {},
        metadataConfig: {
          ..._metadataConfig,
          correlationId: 'abc123',
          version: 1
        }
      },
      requestContext
    );
  });

  t.is(error.name, 'MissingMetadataFieldsError');
});

test.serial(
  'It should throw a MissingRequestContextFieldsError if missing some required AWS request context fields',
  (t) => {
    const error: any = t.throws(() => {
      const _requestContext = JSON.parse(JSON.stringify(requestContext));
      delete _requestContext.requestId;

      new CreatedEvent(eventInput, _requestContext);
    });

    t.is(error.name, 'MissingRequestContextFieldsError');
  }
);
