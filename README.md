# EmittableEvent

**`EmittableEvent` is an opinionated abstraction class for generating rich EventBridge events**.

![Build Status](https://github.com/mikaelvesavuori/emittableevent/workflows/main/badge.svg)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mikaelvesavuori_emittableevent&metric=alert_status)](https://sonarcloud.io/dashboard?id=mikaelvesavuori_emittableevent)

[![codecov](https://codecov.io/gh/mikaelvesavuori/emittableevent/branch/main/graph/badge.svg?token=S7D3RM9TO7)](https://codecov.io/gh/mikaelvesavuori/emittableevent)

[![Maintainability](https://api.codeclimate.com/v1/badges/b65ba911cad077660f9c/maintainability)](https://codeclimate.com/github/mikaelvesavuori/emittableevent/maintainability)

---

The problem that `EmittableEvent` solves is that it provides a simple interface to create richly metadata-detailed events. The risk of _not_ using a utility to do this is, of course, sprawl and unsynced solutions. Not using a conformant way will mean that teams across your organization will all have to deal with building possibly (unsynced) solutions to produce the events. Creating rich events is a non-trivial matter so it's just more boilerplate off your hands.

_Note that `EmittableEvent` is primarily meant to function in an AWS Lambda context, however it will function just fine also outside of one but will be missing certain metadata._

## Consider using a Domain Event Publisher

For a great complementary solution using a Domain Event Publisher and an Event Emitter abstraction together with `EmittableEvent`, [see my related Gist](https://gist.github.com/mikaelvesavuori/80c22979546693545256b71b9d3d1cce).

## Usage

### Basic importing and usage

Using `EmittableEvent` is mostly a concern of creating your own classes extending it and providing the initial, required static metadata.

```typescript
// ES5 format
const { EmittableEvent } = require('emittableevent');
// ES6 format
import { EmittableEvent } from 'emittableevent';

// Request context from API Gateway or whatever
const awsRequestContext = event.requestContext;

// Your own event class
class MyEvent extends EmittableEvent {
  // Do something here if you want, else just leave it as is!
}

// Convenience utility to produce required static metadata
// Can of course be a static metadata JSON as well!
const getMetadataConfig = (version = 1) => {
  return {
    version,
    eventType: 'DomainEvent' as any, // These have hard types internally
    domain: 'MyDomain',
    system: 'MySystem',
    service: 'MyService',
    team: 'MyTeam',
    hostPlatform: 'aws',
    owner: 'Sam Person',
    jurisdiction: 'eu' as any // These have hard types internally
  };
};

// Input for actually creating the event
const eventInput = {
  eventName: 'MyEvent',
  eventBusName: 'MyEventBus',
  data: {
    something: 'some value here if you want'
  },
  metadataConfig: getMetadataConfig()
};

// Create the event
const myEvent = new MyEvent(eventInput, awsRequestContext);
```

Another benefit of this approach is that you can now "type" your events rather than pass around dumb data blobs.

### Retrieving the event payload

This is simple. Just do:

```typescript
// ...and here's the actual full body of the event
const eventPayload = MyEvent.get();
```

The final event will look similar to:

```json
{
  "EventBusName": "MyEventBus",
  "Source": "mydomain.mysystem.myevent",
  "DetailType": "MyEvent",
  "Detail": "{\"metadata\":{\"version\":1,\"eventType\":\"DomainEvent\",\"domain\":\"MyDomain\",\"system\":\"MySystem\",\"service\":\"MyService\",\"team\":\"MyTeam\",\"hostPlatform\":\"aws\",\"owner\":\"Sam Person\",\"jurisdiction\":\"eu\",\"eventName\":\"MyEvent\",\"timestamp\":\"1666808901725\",\"timestampHuman\":\"2022-10-26T18:28:21.725Z\",\"requestTimeEpoch\":1666808901376,\"id\":\"f9cd2b03-c0ce-4678-8307-a51dd69d4284\",\"correlationId\":\"39594a3d-26d5-4d06-85e0-6d77afbe4ea9\",\"resource\":\"/demo\",\"accountId\":\"123412341234\",\"runtime\":\"AWS_Lambda_nodejs16.x\",\"functionName\":\"my-service-dev-Demo\",\"functionMemorySize\":\"1024\",\"functionVersion\":\"$LATEST\",\"lifecycleStage\":\"dev\",\"region\":\"eu-north-1\"},\"data\":{\"something\":\"some value here if you want\"}}"
}
```

## The beautified event shape

The below is an example of how a generated EventBridge event might look like. The `detail` section is a string, but for readability I've made it into an object here.

```json
{
  "EventBusName": "MyEventBus",
  "Source": "mydomain.mysystem.myevent",
  "DetailType": "MyEvent",
  "Detail": {
    "metadata": {
      "version": 1,
      "eventType": "DomainEvent",
      "domain": "MyDomain",
      "system": "MySystem",
      "service": "MyService",
      "team": "MyTeam",
      "hostPlatform": "aws",
      "owner": "Sam Person",
      "jurisdiction": "eu",
      "eventName": "MyEvent",
      "timestamp": "1666808901725",
      "timestampHuman": "2022-10-26T18:28:21.725Z",
      "requestTimeEpoch": 1666808901376,
      "id": "f9cd2b03-c0ce-4678-8307-a51dd69d4284",
      "correlationId": "39594a3d-26d5-4d06-85e0-6d77afbe4ea9",
      "resource": "/demo",
      "accountId": "123412341234",
      "runtime": "AWS_Lambda_nodejs16.x",
      "functionName": "my-service-dev-Demo",
      "functionMemorySize": "1024",
      "functionVersion": "$LATEST",
      "lifecycleStage": "dev",
      "region": "eu-north-1"
    },
    "data": { "something": "some value here if you want" }
  }
}
```

## License

MIT. See `LICENSE` for more details.
