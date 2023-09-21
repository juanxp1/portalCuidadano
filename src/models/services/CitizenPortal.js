import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class CitizenPortal extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.CITIZEN_PORTAL(), data);
  }

  categories(options = {}) {
    return this.get(Api.END_POINTS.CITIZEN_PORTAL_CATEGORIES(), options)
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {CitizenPortal}
   */
  clone(data) {
    return new CitizenPortal(data);
  }
}
