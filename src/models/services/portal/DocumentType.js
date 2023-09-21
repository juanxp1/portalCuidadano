import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * La clase Tipo de Documento permite obtener un listado de los tipos dependiendo la edad
 *
 *
 * @class DocumentType
 * @constructor
 * @public
 *
 * @property {number} age En función de la edad retorna los tipos de documentos para adulTos o menores
 *
 */
export class DocumentType extends Model {
  constructor(data = { age: null }) {
    super(Api.END_POINTS.PORTAL_DOCUMENT_TYPES(), data);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {DocumentType}
   */
  clone(data) {
    return new DocumentType(data);
  }
}
