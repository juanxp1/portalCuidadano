import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Orientación Sexual permite obtener un listado
 * de las orientaciones sexuales dependiendo la edad
 *
 *
 * @class Orientation
 * @constructor
 * @public
 *
 * @property {number} age En función de la edad retorna los tipos de documentos para adulos o menores
 *
 */
export class Orientation extends Model {
  constructor(data = { age: null }) {
    super(Api.END_POINTS.PORTAL_SEXUAL_ORIENTATION(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Orientation}
   */
  clone(data) {
    return new Orientation(data);
  }
}
