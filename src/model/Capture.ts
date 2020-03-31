import * as https from 'https';
import * as AWS from 'aws-sdk';
import {
  Segment,
  Subsegment,
  captureAWS,
  captureAWSClient,
  captureHTTPs,
  captureHTTPsGlobal,
  captureFunc,
  captureCallbackFunc,
  captureAsyncFunc,
} from 'aws-xray-sdk';

export class Capture {
  constructor() {}

  public aws(awssdk: typeof AWS): Capture {
    captureAWS(awssdk);
    return this;
  }

  public awsClient<T extends AWS.Service>(service: T): Capture {
    captureAWSClient(service);
    return this;
  }

  public httpsGlobal<T extends typeof https>(mod: T, downstreamXRayEnabled: boolean): Capture {
    captureHTTPsGlobal(mod, downstreamXRayEnabled);
    return this;
  }

  public https<T extends typeof https>(mod: T, downstreamXRayEnabled: boolean): Capture {
    captureHTTPs(mod, downstreamXRayEnabled);
    return this;
  }

  public asyncFunc<T>(name: string, fcn: (subsegment?: Subsegment) => T, parent?: Segment | Subsegment): Capture {
    captureAsyncFunc(name, fcn, parent);
    return this;
  }

  /**
   *
   * @param name
   * @param fcn
   * @param parent
   */
  public callbackFunc<S extends any[], T>(name: string, fcn: (...args: S) => T, parent?: Segment | Subsegment): Capture {
    captureCallbackFunc(name, fcn, parent);
    return this;
  }

  public func<T>(name: string, fcn: (subsegment?: Subsegment) => T, parent?: Segment | Subsegment): Capture {
    captureFunc(name, fcn, parent);
    return this;
  }
}
