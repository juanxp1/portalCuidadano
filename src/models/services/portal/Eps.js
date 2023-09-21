import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Eps permite obtener un lista de opciones
 *
 *
 * @class Eps
 * @constructor
 * @public
 *
 *
 */
export class Eps extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_EPS(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Eps}
   */
  clone(data) {
    return new Eps(data);
  }
}
