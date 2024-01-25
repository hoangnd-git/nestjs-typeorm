export class IEventKafka<T> {
  value: T;
  topic: string;
  [key: string]: any;
}
