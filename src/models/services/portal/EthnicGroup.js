import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Grupo Étnico permite obtener una lista de opciones
 *
 *
 * @class EthnicGroup
 * @constructor
 * @public
 *
 *
 */
export class EthnicGroup extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_ETHNIC_GROUP(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {EthnicGroup}
   */
  clone(data) {
    return new EthnicGroup(data);
  }
}
