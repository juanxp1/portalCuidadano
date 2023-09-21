import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Location extends Model {
  constructor() {
    super(Api.END_POINTS.LOCATION(), {});
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Location}
   */
  clone(data) {
    return new Location(data);
  }
}
