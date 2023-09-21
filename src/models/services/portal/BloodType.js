import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Grupo Sanguíneo permite obtener un lista de opciones
 *
 *
 * @class BloodType
 * @constructor
 * @public
 *
 *
 */
export class BloodType extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_RH(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {BloodType}
   */
  clone(data) {
    return new BloodType(data);
  }
}
