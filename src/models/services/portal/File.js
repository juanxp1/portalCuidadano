import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

/**
 * Template formulario
 * @type {{file: null, file_type_id: null}}
 */
const form = {
  file_type_id: null,
  file: null,
};

/**
 * La clase Archivo muestra, almacena y elimina archivos del usuario
 *
 * @property {number} file_type_id Tipo de archivp que se va a almacenar
 * @property {file} file archivo que se va a cargar
 */
export class File extends Model {
  constructor(profileId, data = form) {
    super(Api.END_POINTS.PORTAL_PROFILES_FILES(profileId), data);
  }

  clone(id, data = form) {
    return new File(id, data);
  }

  download(profileId, fileId, options = {}) {
    return this.get(
      `${Api.END_POINTS.PORTAL_PROFILES_FILES(profileId)}/${fileId}`,
      options
    );
  }
}
