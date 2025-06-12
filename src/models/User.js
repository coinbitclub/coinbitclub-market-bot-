export default class User {
  constructor(obj) {
    this.id = obj.id;
    this.bybitApiKey = obj.bybit_api_key;
    this.bybitApiSecret = obj.bybit_api_secret;
    this.capitalPct = obj.capital_per_order;
    this.leverage = obj.leverage;
  }
}
