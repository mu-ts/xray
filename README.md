# xray

Syntactical sugar for working with XRAY.

## Usage

### XRAY.capture.*
For the most part, at the beginning of your handler you just need to tell XRAY what sources to capture from.

```
/**
 * Registers all AWS services, with XRAY, that get used within the scope of the handler.
 * Registers all HTTPS invocations with XRAY, that occur within the scope of the handler.
 */
XRAY.capture
  .aws(require('aws-sdk'))
  .httpsGlobal(require('https'));
```

Available capture points.

* aws(awssdk: typeof AWS)
* awsClient<T extends AWS.Service>(service: T)
* httpsGlobal<T extends typeof https>(mod: T, downstreamXRayEnabled: boolean)
* https<T extends typeof https>(mod: T, downstreamXRayEnabled: boolean)
* asyncFunc<T>(name: string, fcn: (subsegment?: Subsegment) => T, parent?: Segment | Subsegment);
* callbackFunc<S extends any[], T>(name: string, fcn: (...args: S) => T, parent?: Segment | Subsegment)
* func<T>(name: string, fcn: (subsegment?: Subsegment) => T, parent?: Segment | Subsegment)
  
<!--
### @capture

You can use the `@asyncFunc` decorator on a Promisified function and have it appear within the details of a segment in XRAY. This decorator is a synonym for `XRAY.capture.asyncFunc`.

```
class MyX {
  @asyncFunc('unique-name', {'metadata':'to-add'}, {'more-metadata':'to-add'})
  public someFunc(){}
}
```

### @captureSync

You can use the `@func` decorator on a function and have it appear within the details of a segment in XRAY. This decorator is a synonym for `XRAY.capture.func`.

```
class MyX {
  @func('unique-name', {'metadata':'to-add'}, {'more-metadata':'to-add'})
  public someFunc(){}
}
```
-->
