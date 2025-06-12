export default class Signal {
  constructor(obj) {
    this.time = obj.received_at;
    this.payload = obj.raw_payload;
  }
}
