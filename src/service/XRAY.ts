import { Logger, LoggerService } from '@mu-ts/logger';
import { setLogger } from 'aws-xray-sdk';
import { Capture } from '../model/Capture';

export class XRAY {
  private static _i: XRAY;

  private readonly logger: Logger;
  private readonly capture: Capture;

  private constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 'xray' } });
    this.capture = new Capture();
  }

  public static get capture(): Capture {
    return this.instance.capture;
  }

  private static get instance() {
    if (!this._i) {
      this.instance.logger.debug('instance()', 'new instance created');
      this._i = new XRAY();
      setLogger(this.instance.logger);
    }
    return this._i;
  }
}
