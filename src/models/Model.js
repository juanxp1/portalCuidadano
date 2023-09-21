import validations from "@/models/validations";
import { Form } from "./Form";

/**
 * La clase Modelo contiene métodos por defecto para realizar peticiones
 * HTTP a rutas establecidas con sus respectivos verbos [GET, POST, PUT,
 * PATCH, DELETE] y manejo de resultados y/o errores de respuesta
 *
 * @class Model
 * @constructor
 * @public
 *
 * @property {string} url Dirección a la que se deben realizar las peticiones
 * @property {object} validations Dirección a la que se deben realizar las peticiones
 */
export class Model extends Form {
  /**
   * Inicializa la ruta que debe apuntar para realizar peticiones
   *
   * @param {string} url Dirección a la que se deben realizar las peticiones
   * @param  {object} data Recibe y sobreescribe los parámetros por defecto que se envían a las rutas especificadas
   */
  constructor(url, data = {}) {
    super(data);
    this.url = url;
    this.validations = validations;
  }

  /**
   * Display a listing of the resource.
   *
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  index(options = {}) {
    return this.get(this.url, options);
  }

  /**
   * Display the specified resource.
   *
   * @param {string|number} id Recibe el identificador de un recurso para su consulta
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  show(id, options = {}) {
    return this.get(`${this.url}/${id}`, options);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  store(options = {}) {
    return this.post(this.url, options);
  }

  /**
   * Store with files a newly created resource in storage.
   *
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  storeWithFiles(options = {}) {
    return this.postWithFiles(this.url, options);
  }

  /**
   * Update with files the specified resource in storage.
   *
   * @param {string|number} id Recibe el identificador de un recurso para su actualización
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  updateWithFiles(id, options = {}) {
    return this.putWithFiles(`${this.url}/${id}`, options);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param {string|number} id Recibe el identificador de un recurso para su actualización
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  update(id, options = {}) {
    return this.put(`${this.url}/${id}`, options);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param {string|number} id Recibe el identificador de un recurso para su eliminación
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  destroy(id, options = {}) {
    return this.delete(`${this.url}/${id}`, options);
  }

  /**
   * Restore the specified resource from storage.
   * Only if model has SoftDeletes
   *
   * @param {string|number} id Recibe el identificador de un recurso para retaurarlo si fue eliminado
   * @param {object} options Opciones o modificadores recibidas por axios como parámetros, encabezados, etc.
   * @returns {Promise<ValidationOptions.unknown>}
   */
  restore(id, options = {}) {
    return this.patch(`${this.url}/${id}/restore`, options);
  }
}
