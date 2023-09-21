import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * Clase tipo de archivos obtiene un listado de los posibles documentos
 * que se deben cargar al sistema.
 * @class FileType
 * @constructor
 * @public
 *
 * @property {number} id Identificador del tipo de archivo
 * @property {string} name Nombre del tipo de archivo
 */
export class FileType extends Model {
  constructor(data = { name: null }) {
    super(Api.END_POINTS.PORTAL_FILES(), data);
  }

  clone(data = { name: null }) {
    return new File(data);
  }
}
