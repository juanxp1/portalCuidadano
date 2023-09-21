import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Localidad permite obtener un listado de países, estados y ciudades
 *
 *
 * @class Locality
 * @constructor
 * @public
 *
 * @param {object} data Contiene la información de formulario que se enviará a la URL
 *
 */
export class Locality extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.PORTAL_LOCALITIES(), data);
  }

  /**
   * Se debe establecer el parámetro locality_id para recibir la lista
   * de upz asociadas a la localidad
   *
   * @param {number} locality_id Identificador de la localidad
   * @param {object} options Modificadores de axios
   * @returns {Promise<minimist.Opts.unknown>}
   */
  upz(locality_id, options = {}) {
    return this.get(Api.END_POINTS.PORTAL_UPZ(locality_id), options);
  }

  /**
   * Se debe establecer el parámetro locality_id y upz_id para recibir la lista
   * de barrios asociados a la UPZ
   *
   * @param {number} locality_id Identificador de la localidad
   * @param {number} upz_id Identificador de la UPZ
   * @param {object} options Modificadores de axios
   * @returns {Promise<minimist.Opts.unknown>}
   */
  neighborhoods(locality_id, upz_id, options = {}) {
    return this.get(
      Api.END_POINTS.PORTAL_NEIGHBORHOODS(locality_id, upz_id),
      options
    );
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Locality}
   */
  clone(data) {
    return new Locality(data);
  }
}
