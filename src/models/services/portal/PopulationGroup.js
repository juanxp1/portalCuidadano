import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Grupo Poblacional permite obtener una lista de opciones
 *
 *
 * @class PopulationGroup
 * @constructor
 * @public
 *
 *
 */
export class PopulationGroup extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_POPULATION_GROUP(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {PopulationGroup}
   */
  clone(data) {
    return new PopulationGroup(data);
  }
}
