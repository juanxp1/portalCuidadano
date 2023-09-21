import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Calendar extends Model {
  constructor(id) {
    super(Api.END_POINTS.ACTIVITIES(id), {});
  }

  others(options = {}) {
    return this.get(Api.END_POINTS.OTHERS_ACTIVITIES(), options);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Calendar}
   */
  clone(data) {
    return new Calendar(data);
  }
}
