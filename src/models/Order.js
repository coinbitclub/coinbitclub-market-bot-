export default class Order {
  constructor(obj) {
    this.id = obj.id;
    this.userId = obj.user_id;
    this.direction = obj.direction;
    this.entry = obj.entry;
    this.exit = obj.exit;
    this.result = obj.result;
  }
}
