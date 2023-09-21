import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Payment extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_PAYMENTS(), data);
  }

  export(options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PAYMENTS() + "/export", options);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Payment}
   */
  clone(data) {
    return new Payment(data);
  }
}
