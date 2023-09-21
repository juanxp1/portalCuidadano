import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase País permite obtener un listado de países, estados y ciudades
 *
 *
 * @class Country
 * @constructor
 * @public
 *
 * @param {object} data Contiene la información de formulario que se enviará a
 * la URL
 * @property {number} country_id El id del país es un parámetro que permite
 * obtener estados asociados al mismo
 * @property {number} state_id El id del estado/depto es un parámetro que
 * permite obtener ciudades asociadas al mismo
 *
 */
export class Country extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_COUNTRIES(), data);
  }

  /**
   * Se debe establecer el parámetro country_id para recibir la lista de estados
   * o departamentos asociados al país
   *
   * @param {number} country_id Identificador de la ciudad
   * @param {object} options Modificadores de axios
   * @returns {Promise<minimist.Opts.unknown>}
   */
  states(country_id, options = {}) {
    return this.get(Api.END_POINTS.PORTAL_STATES(country_id), options);
  }

  /**
   * Se debe establecer el parámetro country_id (id país) y state_id (id depto.)
   * para recibir la lista de ciudades asociadas al departamento o estado
   *
   * @param {number} country_id Identificador del país
   * @param {number} state_id Identificador del estado/departamento
   * @param {object} options Modificadores de axios
   * @returns {Promise<minimist.Opts.unknown>}
   */
  cities(country_id, state_id, options = {}) {
    this.state_id = state_id;
    return this.get(
      Api.END_POINTS.PORTAL_CITIES(country_id, state_id),
      options
    );
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Country}
   */
  clone(data) {
    return new Country(data);
  }
}
