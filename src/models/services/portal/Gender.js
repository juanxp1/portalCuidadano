import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Identidad de Género permite obtener un listado
 * de las identidades dependiendo la edad
 *
 *
 * @class Gender
 * @constructor
 * @public
 *
 *
 */
export class Gender extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_GENDER_IDENTITY(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Gender}
   */
  clone(data) {
    return new Gender(data);
  }
}
