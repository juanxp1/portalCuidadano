import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Programas permite obtener un lista de opciones
 *
 *
 * @class Program
 * @constructor
 * @public
 *
 *
 */
export class Program extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_PROGRAMS(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Program}
   */
  clone(data) {
    return new Program(data);
  }
}
