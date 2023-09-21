import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Park extends Model {
  constructor() {
    super(Api.END_POINTS.PARKS(), {});
  }
  show(id, options = {}) {
    return this.get(Api.END_POINTS.PARKS_DETAILS(id), options);
  }
  sectors(id, options = {}) {
    return this.get(Api.END_POINTS.PARKS_SECTORS(id), options);
  }
  diagrams(options = {}) {
    return this.get(Api.END_POINTS.DIAGRAMS(), options);
  }
  equipment(park_id, equipment_id, options = {}) {
    return this.get(
      Api.END_POINTS.PARKS_EQUIPMENT(park_id, equipment_id),
      options
    );
  }
  esri(options = {}) {
    return this.get(Api.END_POINTS.PARKS_ESRI_CONFIG(), options);
  }
  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Park}
   */
  clone(data) {
    return new Park(data);
  }
}
