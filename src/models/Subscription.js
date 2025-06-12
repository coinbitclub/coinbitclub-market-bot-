export default class Subscription {
  constructor(obj) {
    this.userId = obj.user_id;
    this.expiresAt = obj.expires_at;
  }
}
