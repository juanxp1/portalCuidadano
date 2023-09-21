import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Discapacidad permite obtener una lista de opciones
 *
 *
 * @class Disability
 * @constructor
 * @public
 *
 *
 */
export class Disability extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_DISABILITY(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Disability}
   */
  clone(data) {
    return new Disability(data);
  }
}
