import {EventBusMessageTypes} from '@constants';

export interface EventBusMessage<T> {
  Type: EventBusMessageTypes;
  Payload: T;
}
