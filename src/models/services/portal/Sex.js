import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Sexo permite obtener una lista de opciones
 *
 *
 * @class Sex
 * @constructor
 * @public
 *
 */
export class Sex extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_GENDER(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Sex}
   */
  clone(data) {
    return new Sex(data);
  }
}
