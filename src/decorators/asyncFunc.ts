import { Logger, LoggerService, LoggerConfig } from '@mu-ts/logger';
import { getSegment, Segment } from 'aws-xray-sdk';

import { XRAY } from '../service/XRAY';
import { MetadataItem } from '../model/MetadataItem';

/**
 * Used to capture the execution of a function as a segment within
 * xray tracing.
 */
export function asyncFunc(name: string, ...metadata: MetadataItem[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const parent: string = target.constructor.name;
    const logConfig: LoggerConfig = { name: `${parent}.${propertyKey}.asyncFunc`, adornments: { '@mu-ts': 'xray' } };
    const logger: Logger = LoggerService.named(logConfig);
    const method: Function = descriptor.value;

    let segment;

    try {
      segment = getSegment();
    } catch (error) {
      logger.warn('Failed to get segment!');
    }

    if (!segment) {
      segment = new Segment(`${parent}.${propertyKey}`);
    }

    if (typeof descriptor.value !== 'function') {
      return descriptor;
    }

    logger.debug({ parent, propertyKey }, 'asyncFunc()', 'decorating');

    descriptor.value = function(...args: any[]) {
      return XRAY.capture.asyncFunc(name, async (subsegment: any) => {
        args.forEach((arg: any, index: number) => {
          subsegment.addMetadata(`param_${index}`, typeof arg === 'string' || typeof arg === 'number' ? arg : JSON.stringify(arg, null, 2));
        });

        if (metadata) {
          metadata.forEach((item: MetadataItem) => {
            subsegment.addMetadata(item.name, item.value);
          });
        }

        const result = method.apply(this, args);

        if (result.then) {
          try {
            const returnResult = await result;
            subsegment.close();
            return returnResult;
          } catch (error) {
            subsegment.close(error);
            throw error;
          }
        } else {
          subsegment.close();
          return result;
        }
      });
    };

    return descriptor;
  };
}
